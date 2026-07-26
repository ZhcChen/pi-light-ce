#!/usr/bin/env node

const childProcess = require("node:child_process")
const fs = require("node:fs")
const os = require("node:os")
const path = require("node:path")

const repoRoot = path.resolve(__dirname, "..")
const nodeCommand = process.execPath
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm"
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "pi-light-ce-smoke-"))
const targetDir = path.join(tempRoot, "project")

function cleanup(packFile) {
  fs.rmSync(tempRoot, { recursive: true, force: true })
  if (packFile) {
    fs.rmSync(packFile, { force: true })
  }
}

function fail(message, packFile) {
  cleanup(packFile)
  process.stderr.write(`${message}\n`)
  process.exit(1)
}

function run(command, args, options = {}) {
  const result = childProcess.spawnSync(command, args, {
    cwd: options.cwd || repoRoot,
    encoding: "utf8",
    stdio: options.stdio || "pipe",
  })

  if (result.error) {
    throw result.error
  }

  return result
}

function runChecked(command, args, options = {}, failureMessage, packFile) {
  let result
  try {
    result = run(command, args, options)
  } catch (error) {
    fail(`${failureMessage}: ${error.message}`, packFile)
  }

  if (result.status !== 0) {
    const details = (result.stderr || result.stdout || "").trim()
    fail(details ? `${failureMessage}: ${details}` : failureMessage, packFile)
  }

  return result
}

let packFile = ""

try {
  const expectedVersion = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8")).version
  const actualVersion = runChecked(nodeCommand, [path.join(repoRoot, "bin", "pi-l-ce"), "--version"], {}, "Failed to read pi-l-ce version").stdout.trim()
  if (actualVersion !== expectedVersion) {
    fail(`Version mismatch: expected ${expectedVersion}, got ${actualVersion}`)
  }

  runChecked(nodeCommand, [path.join(repoRoot, "bin", "pi-l-ce"), "--help"], {}, "Failed to show pi-l-ce help")
  runChecked(nodeCommand, [path.join(repoRoot, "bin", "pi-l-ce"), "init", targetDir], {}, "Failed to initialize target project")

  const requiredFiles = [
    path.join(targetDir, "AGENTS.md"),
    path.join(targetDir, ".pi", "prompts", "brainstorm.md"),
    path.join(targetDir, ".pi", "prompts", "plan.md"),
    path.join(targetDir, ".pi", "prompts", "execute.md"),
    path.join(targetDir, ".pi", "prompts", "review.md"),
    path.join(targetDir, ".pi", "prompts", "compound.md"),
    path.join(targetDir, "docs", "brainstorms", "TEMPLATE.md"),
    path.join(targetDir, "docs", "plans", "TEMPLATE.md"),
    path.join(targetDir, "docs", "solutions", "TEMPLATE.md"),
  ]

  for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
      fail(`Missing expected file: ${file}`)
    }
  }

  const doctorOutput = runChecked(nodeCommand, [path.join(repoRoot, "bin", "pi-l-ce"), "doctor"], { cwd: targetDir }, "Failed to run pi-l-ce doctor").stdout
  const doctorChecks = [
    "[ok] AGENTS.md - present",
    "[ok] .pi/prompts/brainstorm.md - present",
    "[ok] .pi/prompts/execute.md - present",
    "[ok] docs/plans/TEMPLATE.md - present",
    "Summary: doctor complete with no warnings.",
  ]
  for (const snippet of doctorChecks) {
    if (!doctorOutput.includes(snippet)) {
      fail(`Doctor output did not contain expected snippet: ${snippet}`)
    }
  }

  const packResult = runChecked(npmCommand, ["pack", "--json"], {}, "npm pack failed")
  let packInfo
  try {
    packInfo = JSON.parse(packResult.stdout)
  } catch (error) {
    fail(`Failed to parse npm pack output: ${error.message}`)
  }

  if (!Array.isArray(packInfo) || packInfo.length === 0 || !packInfo[0].filename || !Array.isArray(packInfo[0].files)) {
    fail("npm pack output did not include package metadata")
  }

  packFile = path.join(repoRoot, packInfo[0].filename)
  if (!fs.existsSync(packFile)) {
    fail(`npm pack did not produce ${packFile}`)
  }

  const packageEntries = new Set(packInfo[0].files.map((entry) => `package/${entry.path}`))
  const expectedEntries = [
    "package/bin/pi-l-ce",
    "package/lib/cli.js",
    "package/templates/project/.pi/prompts/brainstorm.md",
    "package/templates/project/.pi/prompts/plan.md",
    "package/templates/project/.pi/prompts/execute.md",
    "package/templates/project/.pi/prompts/review.md",
    "package/templates/project/.pi/prompts/compound.md",
    "package/templates/project/PLCE_AGENTS.md",
    "package/templates/project/docs/brainstorms/TEMPLATE.md",
    "package/templates/project/docs/plans/TEMPLATE.md",
    "package/templates/project/docs/solutions/TEMPLATE.md",
  ]
  const unexpectedEntries = [
    "package/scripts/smoke-test.sh",
    "package/scripts/smoke-test.js",
    "package/scripts/install-macos.sh",
    "package/scripts/install-linux.sh",
    "package/scripts/install-windows.ps1",
  ]

  for (const entry of expectedEntries) {
    if (!packageEntries.has(entry)) {
      fail(`Missing expected package entry: ${entry}`, packFile)
    }
  }

  for (const entry of unexpectedEntries) {
    if (packageEntries.has(entry)) {
      fail(`Unexpected package entry: ${entry}`, packFile)
    }
  }

  cleanup(packFile)
  process.stdout.write("smoke test passed\n")
} catch (error) {
  fail(error.message, packFile)
}
