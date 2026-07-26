const childProcess = require("node:child_process")
const fs = require("node:fs")
const os = require("node:os")
const path = require("node:path")

function usage() {
  process.stdout.write(`Usage: pi-l-ce <command> [options]

Commands:
  init [--force] [target_dir]   Initialize a target project.
  self-update                   Update the managed pi-light-ce repository from git.
  help                          Show this help.
`)
}

function fail(message) {
  process.stderr.write(`${message}\n`)
  process.exit(1)
}

function run(command, commandArgs, options = {}) {
  const result = childProcess.spawnSync(command, commandArgs, {
    stdio: options.stdio || "pipe",
    encoding: "utf8",
    cwd: options.cwd,
  })

  if (result.error) {
    return result
  }

  return result
}

function ensureGit() {
  const result = run("git", ["--version"])
  if (result.error || result.status !== 0) {
    fail("git is required for self-update.")
  }
}

function isGitRepo(dir) {
  return fs.existsSync(path.join(dir, ".git"))
}

function getManagedRepoCandidates(repoRoot) {
  return [
    repoRoot,
    path.join(os.homedir(), ".pi-l-ce", "repo"),
  ]
}

function canonicalPath(dir) {
  try {
    return fs.realpathSync.native(dir)
  } catch {
    return path.resolve(dir)
  }
}

function findManagedRepo(repoRoot) {
  const seen = new Set()

  for (const candidate of getManagedRepoCandidates(repoRoot)) {
    const resolved = canonicalPath(candidate)
    if (seen.has(resolved)) {
      continue
    }
    seen.add(resolved)

    if (isGitRepo(resolved)) {
      return resolved
    }
  }

  return null
}

function ensureCleanWorkingTree(repoDir) {
  const result = run("git", ["status", "--porcelain"], { cwd: repoDir })
  if (result.error || result.status !== 0) {
    fail(`Failed to inspect repository state: ${repoDir}`)
  }

  if (result.stdout.trim() !== "") {
    fail(`Refusing to self-update because the repository has local changes: ${repoDir}`)
  }
}

function syncStandardWrappers(repoDir) {
  const standardRepoDir = path.join(os.homedir(), ".pi-l-ce", "repo")
  if (canonicalPath(repoDir) !== canonicalPath(standardRepoDir)) {
    return false
  }

  if (process.platform === "win32") {
    const userBin = path.join(os.homedir(), ".pi-l-ce", "bin")
    fs.mkdirSync(userBin, { recursive: true })

    const wrapperFile = path.join(userBin, "pi-l-ce.cmd")
    fs.writeFileSync(wrapperFile, "@echo off\r\nnode \"%USERPROFILE%\\.pi-l-ce\\repo\\bin\\pi-l-ce\" %*\r\n", "ascii")

    const legacyWrapperFile = path.join(userBin, "pi-l-ce-init.cmd")
    if (fs.existsSync(legacyWrapperFile)) {
      fs.rmSync(legacyWrapperFile, { force: true })
    }

    return true
  }

  const userBin = path.join(os.homedir(), ".local", "bin")
  fs.mkdirSync(userBin, { recursive: true })

  const wrapperFile = path.join(userBin, "pi-l-ce")
  fs.writeFileSync(wrapperFile, `#!/usr/bin/env bash\nset -euo pipefail\nexec node "${standardRepoDir}/bin/pi-l-ce" "$@"\n`, "utf8")
  fs.chmodSync(wrapperFile, 0o755)

  const legacyWrapperFile = path.join(userBin, "pi-l-ce-init")
  if (fs.existsSync(legacyWrapperFile)) {
    fs.rmSync(legacyWrapperFile, { force: true })
  }

  return true
}

function selfUpdate(repoRoot) {
  ensureGit()

  const managedRepo = findManagedRepo(repoRoot)
  if (!managedRepo) {
    fail("Self-update requires a git-backed pi-light-ce installation. Reinstall with the bootstrap script first.")
  }

  ensureCleanWorkingTree(managedRepo)

  process.stdout.write(`Updating pi-light-ce from ${managedRepo}\n`)
  const result = run("git", ["pull", "--ff-only"], {
    cwd: managedRepo,
    stdio: "inherit",
  })

  if (result.error) {
    fail(`Failed to run git pull: ${result.error.message}`)
  }

  if (result.status !== 0) {
    fail("Self-update failed.")
  }

  if (syncStandardWrappers(managedRepo)) {
    process.stdout.write("Updated command wrappers.\n")
  }

  process.stdout.write("Self-update complete.\n")
}

function runInit(initArgs, repoRoot) {
  let force = false
  let targetArg = "."
  let targetAssigned = false

  for (let i = 0; i < initArgs.length; i += 1) {
    const arg = initArgs[i]

    if (arg === "--force") {
      force = true
      continue
    }

    if (arg === "-h" || arg === "--help") {
      usage()
      process.exit(0)
    }

    if (arg.startsWith("-")) {
      fail(`Unknown option: ${arg}`)
    }

    if (targetAssigned) {
      fail("Only one target_dir is allowed.")
    }

    targetArg = arg
    targetAssigned = true
  }

  const templateRoot = path.join(repoRoot, "templates", "project")
  const targetDir = path.resolve(process.cwd(), targetArg)

  if (!fs.existsSync(targetDir) || !fs.statSync(targetDir).isDirectory()) {
    fail("Target directory does not exist.")
  }

  fs.mkdirSync(path.join(targetDir, "docs", "plans"), { recursive: true })
  fs.mkdirSync(path.join(targetDir, "docs", "solutions"), { recursive: true })

  function copyFile(src, rel) {
    const dst = path.join(targetDir, rel)
    fs.mkdirSync(path.dirname(dst), { recursive: true })

    if (fs.existsSync(dst) && !force) {
      process.stdout.write(`skip   ${rel} (already exists)\n`)
      return
    }

    fs.copyFileSync(src, dst)
    process.stdout.write(`write  ${rel}\n`)
  }

  copyFile(path.join(templateRoot, "PLCE_AGENTS.md"), "AGENTS.md")
  copyFile(path.join(templateRoot, "docs", "plans", "TEMPLATE.md"), path.join("docs", "plans", "TEMPLATE.md"))
  copyFile(path.join(templateRoot, "docs", "solutions", "TEMPLATE.md"), path.join("docs", "solutions", "TEMPLATE.md"))

  process.stdout.write(`\nInitialization complete.\n`)
}

function runCommand(command, commandArgs, repoRoot) {
  if (command === "init") {
    runInit(commandArgs, repoRoot)
    return
  }

  if (command === "self-update" || command === "--self-update") {
    if (commandArgs.length > 0) {
      fail("self-update does not accept extra arguments.")
    }

    selfUpdate(repoRoot)
    return
  }

  if (command === "help" || command === "-h" || command === "--help") {
    usage()
    return
  }

  fail(`Unknown command: ${command}`)
}

function main(rawArgs) {
  const repoRoot = path.resolve(__dirname, "..")
  const args = rawArgs.slice()

  if (args.length === 0) {
    usage()
    return
  }

  runCommand(args[0], args.slice(1), repoRoot)
}

module.exports = {
  main,
}
