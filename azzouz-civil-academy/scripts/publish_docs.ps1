param(
  [string]$IncomingPath = "content/_incoming",
  [string]$LibraryPath = "content/library",
  [switch]$SkipIndex
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Prompt-Default {
  param(
    [string]$Message,
    [string]$Default
  )
  $input = Read-Host "${Message} [$Default]"
  if ([string]::IsNullOrWhiteSpace($input)) { return $Default }
  return $input
}

function Prompt-Choice {
  param(
    [string]$Message,
    [string[]]$Choices,
    [string]$Default
  )
  while ($true) {
    $answer = Read-Host "${Message} [$($Choices -join '/')] (défaut : $Default)"
    if ([string]::IsNullOrWhiteSpace($answer)) { return $Default }
    if ($Choices -contains $answer) { return $answer }
    Write-Host "Valeur invalide. Choix possibles : $($Choices -join ', ')." -ForegroundColor Yellow
  }
}

if (-not (Test-Path $IncomingPath)) {
  New-Item -ItemType Directory -Path $IncomingPath | Out-Null
}
if (-not (Test-Path $LibraryPath)) {
  New-Item -ItemType Directory -Path $LibraryPath | Out-Null
}

$archivePath = Join-Path $IncomingPath '_processed'
if (-not (Test-Path $archivePath)) {
  New-Item -ItemType Directory -Path $archivePath | Out-Null
}

try {
  Add-Type -AssemblyName System.Web | Out-Null
} catch {
  Write-Host 'Impossible de charger System.Web pour la détection MIME.' -ForegroundColor Yellow
}

$files = Get-ChildItem -Path $IncomingPath -File
if ($files.Count -eq 0) {
  Write-Host 'Aucun fichier à traiter dans content/_incoming.' -ForegroundColor Yellow
  return
}

foreach ($file in $files) {
  Write-Host "\n---" -ForegroundColor Cyan
  Write-Host "Traitement : $($file.Name)" -ForegroundColor Cyan

  $defaultId = ([System.IO.Path]::GetFileNameWithoutExtension($file.Name)).ToLower() -replace '[^a-z0-9-]', '-'
  $id = Prompt-Default 'Identifiant (slug unique)' $defaultId
  $title = Prompt-Default 'Titre du document' $file.BaseName
  $domain = Prompt-Choice 'Domaine (ba/acier/sismique/geotech/essais)' @('ba','acier','sismique','geotech','essais') 'ba'
  $jurisdiction = Prompt-Choice 'Juridiction (FR/DZ/INT)' @('FR','DZ','INT') 'FR'
  $publisher = Prompt-Default 'Éditeur' 'AZ-CIVIL-ACADEMY'
  $year = [int](Prompt-Default 'Année de publication' (Get-Date).Year.ToString())
  $rights = Prompt-Choice 'Statut des droits (own/licensed/public_domain/unclear)' @('own','licensed','public_domain','unclear') 'unclear'

  $distribution = if ($rights -eq 'unclear') { 'link_out' } else { 'host_file' }
  $officialUrl = ''
  if ($distribution -eq 'link_out') {
    $officialUrl = Prompt-Default 'URL officielle de référence' 'https://'
  }

  $summary = Prompt-Default 'Résumé (une ou deux phrases)' 'Résumé à compléter.'
  $tagsInput = Read-Host 'Tags (séparés par des virgules)'
  $tags = @()
  if (-not [string]::IsNullOrWhiteSpace($tagsInput)) {
    $tags = $tagsInput.Split(',').Trim() | Where-Object { $_ }
  }

  $hash = (Get-FileHash -Path $file.FullName -Algorithm SHA256).Hash.ToLower()
  $contentType = if ([System.Web.MimeMapping]::GetMimeMapping) {
    [System.Web.MimeMapping]::GetMimeMapping($file.FullName)
  } else {
    'application/octet-stream'
  }

  $storageKey = $null
  if ($distribution -eq 'host_file') {
    if (-not $env:BLOB_READ_WRITE_TOKEN) {
      throw "BLOB_READ_WRITE_TOKEN n'est pas défini."
    }
    $targetName = "documents/$id/$($file.Name)"
    $uploadOutput = node scripts/upload-file.mjs "$($file.FullName)" "$targetName" "$contentType"
    $uploadResult = $uploadOutput | ConvertFrom-Json
    $storageKey = $uploadResult.pathname
    Write-Host "Fichier uploadé sur Vercel Blob : $($uploadResult.url)" -ForegroundColor Green
  }

  $now = (Get-Date).ToUniversalTime().ToString('o')

  $metadata = [ordered]@{
    id = $id
    title = $title
    domain = $domain
    jurisdiction = $jurisdiction
    publisher = $publisher
    year = $year
    status = 'active'
    rights_status = $rights
    distribution_mode = $distribution
    source_official_url = if ($officialUrl) { $officialUrl } else { '' }
    file = [ordered]@{
      original_name = $file.Name
      mime = $contentType
      size_bytes = $file.Length
      sha256 = $hash
    }
    summary = $summary
    citations = @()
    tags = $tags
    created_at = $now
    updated_at = $now
  }

  if ($storageKey) {
    $metadata.file.storage_key = $storageKey
  }

  $metadataPath = Join-Path $LibraryPath "$id.json"
  $metadata | ConvertTo-Json -Depth 10 | Set-Content -Path $metadataPath -Encoding UTF8
  Write-Host "Métadonnée enregistrée : $metadataPath" -ForegroundColor Green

  $mdxPath = Join-Path $LibraryPath "$id.mdx"
  if (-not (Test-Path $mdxPath)) {
    $mdxContent = "---`nupdated_at: $now`n---`n`n## Résumé à compléter`n`nPréciser ici le contexte d'application, les références et remarques liées au document.`n"
    Set-Content -Path $mdxPath -Value $mdxContent -Encoding UTF8
  }

  Move-Item -Path $file.FullName -Destination (Join-Path $archivePath $file.Name) -Force
  Write-Host "Fichier original archivé dans $archivePath" -ForegroundColor DarkGray
}

if (-not $SkipIndex) {
  Write-Host "\nMise à jour de l'index de recherche..." -ForegroundColor Cyan
  npm run index | Out-Null
  Write-Host "Index mis à jour." -ForegroundColor Green
}

Write-Host "\nPipeline terminé." -ForegroundColor Cyan
