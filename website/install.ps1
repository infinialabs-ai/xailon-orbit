# XailonOrbit daemon installer: irm https://xailon-orbit.infinialabs.ai/install.ps1 | iex
# Options (environment): XAILON_ORBIT_VERSION=v0.4.0  XAILON_ORBIT_INSTALL_DIR=%LOCALAPPDATA%\Programs\xailon-orbitd
$ErrorActionPreference = 'Stop'

$repo = 'https://github.com/infinialabs-ai/xailon-orbit'
$dir = if ($env:XAILON_ORBIT_INSTALL_DIR) { $env:XAILON_ORBIT_INSTALL_DIR } else { Join-Path $env:LOCALAPPDATA 'Programs\xailon-orbitd' }
$base = if ($env:XAILON_ORBIT_VERSION) { "$repo/releases/download/$($env:XAILON_ORBIT_VERSION)" } else { "$repo/releases/latest/download" }
$asset = 'xailon-orbitd-x86_64-pc-windows-msvc.zip'

if (-not [Environment]::Is64BitOperatingSystem) { throw 'xailon-orbitd requires 64-bit Windows.' }

$tmp = Join-Path ([IO.Path]::GetTempPath()) ("xailon-orbitd-" + [Guid]::NewGuid())
New-Item -ItemType Directory -Path $tmp | Out-Null
try {
  Write-Host "Downloading $asset"
  Invoke-WebRequest "$base/$asset" -OutFile (Join-Path $tmp $asset) -UseBasicParsing
  $expected = (Invoke-WebRequest "$base/$asset.sha256" -UseBasicParsing).Content.Trim().Split(' ')[0].ToLower()
  $actual = (Get-FileHash (Join-Path $tmp $asset) -Algorithm SHA256).Hash.ToLower()
  if ($expected -ne $actual) { throw 'Checksum mismatch' }

  Expand-Archive (Join-Path $tmp $asset) -DestinationPath $tmp -Force
  New-Item -ItemType Directory -Path $dir -Force | Out-Null
  $exe = Join-Path $dir 'xailon-orbitd.exe'
  if (Test-Path $exe) { & $exe stop 2>$null | Out-Null }
  Copy-Item (Join-Path $tmp 'xailon-orbitd.exe') $exe -Force
  Write-Host "Installed $exe"

  $userPath = [Environment]::GetEnvironmentVariable('Path', 'User')
  if (-not ($userPath -split ';' | Where-Object { $_ -eq $dir })) {
    [Environment]::SetEnvironmentVariable('Path', "$userPath;$dir", 'User')
    Write-Host "Added $dir to your PATH. Open a new terminal to use it."
  }
  Write-Host ''
  Write-Host 'Next: run `xailon-orbitd start` and scan the QR code with the XailonOrbit app.'
  Write-Host 'Guide: https://xailon-orbit.infinialabs.ai/guide/'
} finally {
  Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
}
