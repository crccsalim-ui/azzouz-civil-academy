$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $root

if (-not (Test-Path 'node_modules')) {
  Write-Host 'Dépendances manquantes : exécution de npm install...' -ForegroundColor Cyan
  npm install | Out-Null
}

Write-Host 'Compilation du projet (npm run build)...' -ForegroundColor Cyan
npm run build
