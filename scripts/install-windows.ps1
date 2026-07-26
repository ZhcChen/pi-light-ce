$ErrorActionPreference = 'Stop'

$RepoUrl = if ($env:PI_L_CE_REPO_URL) { $env:PI_L_CE_REPO_URL } else { 'https://github.com/ZhcChen/pi-light-ce.git' }
$InstallRoot = Join-Path $HOME '.pi-l-ce'
$RepoDir = Join-Path $InstallRoot 'repo'
$UserBin = Join-Path $InstallRoot 'bin'
$PrimaryWrapperCmd = Join-Path $UserBin 'pi-l-ce.cmd'
$CompatWrapperCmd = Join-Path $UserBin 'pi-l-ce-init.cmd'

function Write-Step {
  param([string]$Message)
  Write-Host "==> $Message" -ForegroundColor Cyan
}

function Ensure-WingetPackage {
  param(
    [string]$CommandName,
    [string]$WingetId,
    [string]$DisplayName
  )

  if (Get-Command $CommandName -ErrorAction SilentlyContinue) {
    return
  }

  if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
    throw "winget is required to install $DisplayName automatically. Install winget or install $DisplayName manually, then rerun this script."
  }

  Write-Step "Installing $DisplayName via winget"
  winget install --id $WingetId -e --accept-package-agreements --accept-source-agreements
}

function Refresh-CommonPathHints {
  $possible = @(
    'C:\Program Files\Git\cmd',
    'C:\Program Files\Git\bin',
    'C:\Program Files\nodejs',
    (Join-Path $env:APPDATA 'npm')
  )

  foreach ($entry in $possible) {
    if ((Test-Path $entry) -and ($env:Path -notlike "*$entry*")) {
      $env:Path = "$entry;$env:Path"
    }
  }
}

function Ensure-Pi {
  if (Get-Command pi -ErrorAction SilentlyContinue) {
    return
  }

  Refresh-CommonPathHints

  Write-Step 'Installing pi-coding-agent via npm'
  npm install -g @earendil-works/pi-coding-agent
  Refresh-CommonPathHints
}

function Clone-Or-UpdateRepo {
  New-Item -ItemType Directory -Force -Path $InstallRoot | Out-Null

  if (Test-Path (Join-Path $RepoDir '.git')) {
    Write-Step "Updating existing repository in $RepoDir"
    git -C $RepoDir pull --ff-only
    return
  }

  if (Test-Path $RepoDir) {
    Remove-Item -Recurse -Force $RepoDir
  }

  Write-Step "Cloning repository into $RepoDir"
  git clone $RepoUrl $RepoDir
}

function Create-Wrappers {
  New-Item -ItemType Directory -Force -Path $UserBin | Out-Null

  @"
@echo off
node "%USERPROFILE%\.pi-l-ce\repo\bin\pi-l-ce" %*
"@ | Set-Content -Path $PrimaryWrapperCmd -Encoding Ascii

  @"
@echo off
node "%USERPROFILE%\.pi-l-ce\repo\bin\pi-l-ce-init" %*
"@ | Set-Content -Path $CompatWrapperCmd -Encoding Ascii

  Write-Step "Installed command wrappers at $UserBin"
}

function Ensure-UserPath {
  $pathsToAdd = @(
    $UserBin,
    (Join-Path $env:APPDATA 'npm')
  )

  $currentUserPath = [Environment]::GetEnvironmentVariable('Path', 'User')
  if (-not $currentUserPath) {
    $currentUserPath = ''
  }

  $parts = @($currentUserPath -split ';' | Where-Object { $_ -ne '' })
  $updated = $false

  foreach ($pathEntry in $pathsToAdd) {
    if (-not (Test-Path $pathEntry)) {
      continue
    }

    if ($parts -contains $pathEntry) {
      if ($env:Path -notlike "*$pathEntry*") {
        $env:Path = "$pathEntry;$env:Path"
      }
      continue
    }

    $parts = @($pathEntry) + $parts
    $env:Path = "$pathEntry;$env:Path"
    $updated = $true
    Write-Step "Added $pathEntry to user PATH"
  }

  if ($updated) {
    $newUserPath = ($parts -join ';')
    [Environment]::SetEnvironmentVariable('Path', $newUserPath, 'User')
    Write-Step 'Open a new terminal after this script finishes.'
  }
}

Ensure-WingetPackage -CommandName git -WingetId 'Git.Git' -DisplayName 'Git'
Ensure-WingetPackage -CommandName node -WingetId 'OpenJS.NodeJS.LTS' -DisplayName 'Node.js LTS'
Refresh-CommonPathHints
Ensure-Pi
Clone-Or-UpdateRepo
Create-Wrappers
Ensure-UserPath

Write-Step 'Done'
Write-Step 'Verify with: pi-l-ce --help'
Write-Step 'Initialize with: pi-l-ce init .'
Write-Step 'Update later with: pi-l-ce self-update'
