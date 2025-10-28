# AZ-CIVIL-ACADEMY

Plateforme documentaire multilingue (FR/EN/AR) pour centraliser normes, fiches et cours de génie civil.

## 1. Pré-requis
- Node.js 18+ et npm
- PowerShell (Windows 10/11)
- Compte Vercel (pour le déploiement et Vercel Blob)

## 2. Installation rapide
```powershell
# Depuis le dossier du projet
scripts\dev.ps1 -Install
```
La commande installe les dépendances puis lance `npm run dev` sur http://localhost:3000.

## 3. Structure utile
- `app/` : pages Next.js (App Router) avec routage par langue `fr/en/ar`
- `components/` : Navbar, recherche, cartes documentaires…
- `content/` :
  - `_incoming/` : déposer vos fichiers bruts (PDF, DOCX…)
  - `library/` : métadonnées JSON + résumés MDX publiés
  - `samples/` : 3 exemples (BA, acier, parasismique)
  - `essais/` : fiches d’essais in situ (2 exemples)
- `scripts/` : automatisations PowerShell + `upload-file.mjs` (upload Vercel Blob)
- `search/` : index MiniSearch (`build_index.mjs`, `index.json`)
- `lib/` : helpers (i18n, Blob, recherche, chargement de contenu)

## 4. Ajouter un document
1. Placez vos fichiers dans `content/_incoming/`.
2. Lancez `scripts\publish_docs.ps1`.
3. Pour chaque fichier :
   - renseignez slug, titre, domaine, juridiction, éditeur…
   - saisissez le statut de droits :
     - `own/licensed/public_domain` → upload vers Vercel Blob (clé `BLOB_READ_WRITE_TOKEN` requise)
     - `unclear` → pas d’upload, on vous demande l’URL officielle
   - un fichier JSON est créé dans `content/library/`, un squelette MDX est généré
   - le fichier d’origine est archivé dans `content/_incoming/_processed`
4. L’index de recherche est reconstruit automatiquement (`npm run index`).

> Astuce : le script utilise `scripts/upload-file.mjs` pour envoyer les fichiers sur Vercel Blob.

## 5. Mise à jour manuelle de l’index
```powershell
scripts\index.ps1
```
Génère `search/index.json` avec MiniSearch (titres, résumés, tags, domaines…)

## 6. Déploiement Vercel
1. Installez le CLI Vercel : `npm install -g vercel`
2. Lancez `scripts\deploy.ps1`
   - `vercel login`
   - `vercel link --project az-civil-academy`
   - ajoutez `BLOB_READ_WRITE_TOKEN` dans Vercel (Project Settings → Environment Variables)
   - `vercel deploy --prod`
3. Le site est disponible sur `https://az-civil-academy.vercel.app`

## 7. Configuration environnement
- Copiez `.env.template` en `.env.local`
- Renseignez `BLOB_READ_WRITE_TOKEN` (depuis Vercel > Storage > Blob)
- `NEXT_PUBLIC_SITE_URL` peut être ajusté selon votre domaine

## 8. Scripts utiles
| Script | Rôle |
| --- | --- |
| `scripts/dev.ps1 -Install` | installe les dépendances puis `npm run dev` |
| `scripts/build.ps1` | `npm run build` |
| `scripts/index.ps1` | reconstruit l’index de recherche |
| `scripts/publish_docs.ps1` | pipeline d’ingestion (hash, upload, métadonnées) |
| `scripts/deploy.ps1` | guide de déploiement Vercel |

## 9. Notes UX & i18n
- `next-intl` gère les trois locales. L’arabe active automatiquement le mode RTL.
- `LangSwitch` (navbar) bascule de langue et de direction (`dir="rtl"`).
- `ThemeToggle` fournit le mode sombre (stockage localStorage).

Bon travail sur AZ-CIVIL-ACADEMY !
