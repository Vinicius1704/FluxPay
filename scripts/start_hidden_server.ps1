[CmdletBinding()]
param(
  [Parameter(Mandatory)]
  [string]$NodePath,

  [Parameter(Mandatory)]
  [string]$WorkingDirectory,

  [Parameter(Mandatory)]
  [string]$LogPath,

  [Parameter(Mandatory)]
  [string]$ErrorLogPath
)

$ErrorActionPreference = 'Stop'

$server = Start-Process `
  -FilePath $NodePath `
  -ArgumentList @('ace.js', 'serve', '--hmr') `
  -WorkingDirectory $WorkingDirectory `
  -RedirectStandardOutput $LogPath `
  -RedirectStandardError $ErrorLogPath `
  -WindowStyle Hidden `
  -PassThru

[Console]::Out.Write($server.Id)
exit 0
