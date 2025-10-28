/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from "node:fs/promises";
import path from "node:path";

import MiniSearch from "minisearch";

const ROOT = process.cwd();
const SOURCES = ["content/library", "content/samples"];
const OUTPUT = path.join(ROOT, "search", "index.json");

async function loadDocuments() {
  const documents = [];

  for (const source of SOURCES) {
    const dir = path.join(ROOT, source);
    let entries = [];
    try {
      entries = await fs.readdir(dir, {withFileTypes: true});
    } catch (error) {
      continue;
    }

    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.json')) {
        const filePath = path.join(dir, entry.name);
        const raw = await fs.readFile(filePath, 'utf-8');
        const safe = raw.replace(/^\uFEFF/, '');
        const data = JSON.parse(safe);
        documents.push({
          id: data.id,
          title: data.title,
          domain: data.domain,
          jurisdiction: data.jurisdiction,
          year: data.year,
          summary: data.summary,
          tags: data.tags ?? [],
          rights_status: data.rights_status,
          status: data.status,
        });
      }
    }
  }

  return documents;
}

async function buildIndex() {
  const documents = await loadDocuments();
  const search = new MiniSearch({
    fields: ['title', 'summary', 'tags', 'domain', 'jurisdiction'],
    storeFields: ['id', 'title', 'summary', 'domain', 'jurisdiction', 'year', 'tags', 'rights_status', 'status'],
    searchOptions: {
      prefix: true,
      fuzzy: 0.2,
    },
  });

  search.addAll(documents);

  await fs.writeFile(OUTPUT, JSON.stringify(search.toJSON(), null, 2), 'utf-8');
  console.log(`Index generated (${documents.length} documents)`);
}

buildIndex().catch((error) => {
  console.error('Failed to build search index', error);
  process.exit(1);
});

