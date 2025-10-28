$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $root

Write-Host '--- Déploiement sur Vercel ---' -ForegroundColor Cyan

if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
  Write-Host 'Le CLI Vercel n''est pas installé. Exécutez: npm install -g vercel' -ForegroundColor Yellow
  return
}

vercel --version | Out-Null

Write-Host "1) Connexion à Vercel" -ForegroundColor Cyan
vercel login

Write-Host "2) Liaison du projet local" -ForegroundColor Cyan
vercel link --project "az-civil-academy"

Write-Host "3) Configuration des variables d'environnement" -ForegroundColor Cyan
Write-Host "   - Ajoutez BLOB_READ_WRITE_TOKEN dans le tableau de bord Vercel." -ForegroundColor Green
Write-Host "   - Vous pouvez également synchroniser un fichier .env.local via vercel env pull." -ForegroundColor Green

Write-Host "4) Déploiement" -ForegroundColor Cyan
vercel deploy --prod

Write-Host 'Déploiement terminé.' -ForegroundColor Cyan

