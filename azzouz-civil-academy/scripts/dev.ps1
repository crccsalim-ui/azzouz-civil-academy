param([switch]$Install)

$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $root

if ($Install -or -not (Test-Path 'node_modules')) {
  Write-Host 'Installation des dépendances...' -ForegroundColor Cyan
  npm install | Out-Null
}

Write-Host 'Lancement du serveur de développement (npm run dev)...' -ForegroundColor Cyan
npm run dev
