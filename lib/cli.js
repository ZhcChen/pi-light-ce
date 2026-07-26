const childProcess = require("node:child_process")
const fs = require("node:fs")
const os = require("node:os")
const path = require("node:path")
const packageInfo = require("../package.json")

const RECOMMENDED_PI_PACKAGES = [
  "npm:pi-subagents",
  "npm:@narumitw/pi-goal",
]

const PROJECT_CHECKS = [
  "AGENTS.md",
  path.join(".pi", "prompts", "brainstorm.md"),
  path.join(".pi", "prompts", "plan.md"),
  path.join(".pi", "prompts", "execute.md"),
  path.join(".pi", "prompts", "review.md"),
  path.join(".pi", "prompts", "compound.md"),
  path.join("docs", "brainstorms", "TEMPLATE.md"),
  path.join("docs", "plans", "TEMPLATE.md"),
  path.join("docs", "solutions", "TEMPLATE.md"),
]

function usage() {
  process.stdout.write(`Usage: pi-l-ce <command> [options]

Commands:
  init [--force] [target_dir]   Initialize a target project.
  self-update                   Update the managed pi-light-ce repository from git.
  doctor                        Inspect runtime prerequisites and current project files.
  version                       Show the current pi-light-ce version.
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

function findCommand(commandName) {
  const pathValue = process.env.PATH || ""
  const searchDirs = pathValue.split(path.delimiter).filter(Boolean)
  const hasExtension = process.platform === "win32" && path.extname(commandName) !== ""
  const pathExts = process.platform === "win32"
    ? (process.env.PATHEXT || ".EXE;.CMD;.BAT;.COM").split(";").filter(Boolean)
    : [""]

  for (const dir of searchDirs) {
    const base = path.join(dir, commandName)
    const candidates = hasExtension
      ? [base]
      : [base, ...pathExts.map((ext) => `${base}${ext}`)]

    for (const candidate of candidates) {
      try {
        if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
          return candidate
        }
      } catch {
        // Ignore unreadable PATH entries and keep searching.
      }
    }
  }

  return null
}

function formatDoctorLine(status, label, detail = "") {
  return `  [${status}] ${label}${detail ? ` - ${detail}` : ""}`
}

function appendDoctorCheck(lines, label, ok, detail, state) {
  lines.push(formatDoctorLine(ok ? "ok" : "warn", label, detail))
  if (!ok) {
    state.warnings += 1
  }
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

  if (fs.existsSync(targetDir)) {
    if (!fs.statSync(targetDir).isDirectory()) {
      fail("Target path exists but is not a directory.")
    }
  } else {
    fs.mkdirSync(targetDir, { recursive: true })
  }

  fs.mkdirSync(path.join(targetDir, "docs", "brainstorms"), { recursive: true })
  fs.mkdirSync(path.join(targetDir, "docs", "plans"), { recursive: true })
  fs.mkdirSync(path.join(targetDir, "docs", "solutions"), { recursive: true })
  fs.mkdirSync(path.join(targetDir, ".pi", "prompts"), { recursive: true })

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
  copyFile(path.join(templateRoot, ".pi", "prompts", "brainstorm.md"), path.join(".pi", "prompts", "brainstorm.md"))
  copyFile(path.join(templateRoot, ".pi", "prompts", "plan.md"), path.join(".pi", "prompts", "plan.md"))
  copyFile(path.join(templateRoot, ".pi", "prompts", "execute.md"), path.join(".pi", "prompts", "execute.md"))
  copyFile(path.join(templateRoot, ".pi", "prompts", "review.md"), path.join(".pi", "prompts", "review.md"))
  copyFile(path.join(templateRoot, ".pi", "prompts", "compound.md"), path.join(".pi", "prompts", "compound.md"))
  copyFile(path.join(templateRoot, "docs", "brainstorms", "TEMPLATE.md"), path.join("docs", "brainstorms", "TEMPLATE.md"))
  copyFile(path.join(templateRoot, "docs", "plans", "TEMPLATE.md"), path.join("docs", "plans", "TEMPLATE.md"))
  copyFile(path.join(templateRoot, "docs", "solutions", "TEMPLATE.md"), path.join("docs", "solutions", "TEMPLATE.md"))

  process.stdout.write(`\nInitialization complete.\n`)
}

function printVersion() {
  process.stdout.write(`${packageInfo.version}\n`)
}

function runDoctor(commandArgs) {
  if (commandArgs.length > 0) {
    fail("doctor does not accept extra arguments.")
  }

  const state = { warnings: 0 }
  const lines = []
  const cwd = process.cwd()
  const nodePath = process.execPath
  const gitPath = findCommand("git")
  const piPath = findCommand("pi")

  lines.push("pi-light-ce doctor")
  lines.push("")
  lines.push("Runtime")
  lines.push(formatDoctorLine("ok", "node", `${process.version} (${nodePath})`))

  if (gitPath) {
    const gitVersion = run(gitPath, ["--version"])
    const detail = gitVersion.error || gitVersion.status !== 0
      ? gitPath
      : `${gitVersion.stdout.trim()} (${gitPath})`
    appendDoctorCheck(lines, "git", !(gitVersion.error || gitVersion.status !== 0), detail, state)
  } else {
    appendDoctorCheck(lines, "git", false, "command not found", state)
  }

  let piListResult = null
  if (piPath) {
    piListResult = run(piPath, ["list"])
    const ok = !piListResult.error && piListResult.status === 0
    const detail = ok ? piPath : ((piListResult.stderr || piListResult.stdout || "").trim() || piPath)
    appendDoctorCheck(lines, "pi", ok, detail, state)
  } else {
    appendDoctorCheck(lines, "pi", false, "command not found", state)
  }

  lines.push("")
  lines.push("Recommended Pi packages")
  if (piListResult && !piListResult.error && piListResult.status === 0) {
    for (const packageName of RECOMMENDED_PI_PACKAGES) {
      appendDoctorCheck(lines, packageName, piListResult.stdout.includes(packageName), piListResult.stdout.includes(packageName) ? "installed" : "not installed", state)
    }
  } else {
    for (const packageName of RECOMMENDED_PI_PACKAGES) {
      appendDoctorCheck(lines, packageName, false, "unable to inspect because `pi list` is unavailable", state)
    }
  }

  lines.push("")
  lines.push(`Project (${cwd})`)
  for (const relativePath of PROJECT_CHECKS) {
    const fullPath = path.join(cwd, relativePath)
    appendDoctorCheck(lines, relativePath, fs.existsSync(fullPath), fs.existsSync(fullPath) ? "present" : "missing", state)
  }

  lines.push("")
  lines.push("Notes")
  lines.push(formatDoctorLine("info", "project trust", "project-local `.pi/prompts/*.md` is discovered only after Pi trusts the project"))
  lines.push(formatDoctorLine("info", "session reload", "run `/reload` or reopen Pi after `pi-l-ce init` if prompts were added mid-session"))

  lines.push("")
  lines.push(`Summary: doctor complete with ${state.warnings === 0 ? "no warnings" : `${state.warnings} warning(s)`}.`)
  process.stdout.write(`${lines.join("\n")}\n`)
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

  if (command === "doctor") {
    runDoctor(commandArgs)
    return
  }

  if (command === "version" || command === "-v" || command === "--version") {
    if (commandArgs.length > 0) {
      fail("version does not accept extra arguments.")
    }

    printVersion()
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
