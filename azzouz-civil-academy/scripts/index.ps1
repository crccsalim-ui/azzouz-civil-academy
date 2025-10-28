$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $root

Write-Host 'Génération de search/index.json...' -ForegroundColor Cyan
npm run index
