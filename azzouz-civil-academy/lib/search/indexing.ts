"use client";

import MiniSearch, {type SearchOptions} from "minisearch";

import type {SearchableDocument} from "@/lib/types";

const SEARCH_INDEX_URL = "/search/index.json";

let searchPromise: Promise<MiniSearch<SearchableDocument>> | null = null;

const options: SearchOptions = {
  prefix: true,
  fuzzy: 0.2,
  boost: {title: 4, tags: 2},
};

async function fetchIndex() {
  const response = await fetch(SEARCH_INDEX_URL, {cache: "force-cache"});
  if (!response.ok) {
    throw new Error(`Unable to fetch search index (${response.status})`);
  }

  const json = await response.json();
  return MiniSearch.loadJSON<SearchableDocument>(json, {
    fields: ['title', 'summary', 'domain', 'jurisdiction', 'tags'],
    storeFields: ['id', 'title', 'summary', 'domain', 'jurisdiction', 'year', 'tags', 'rights_status', 'status'],
  });
}

export async function getSearchEngine() {
  if (!searchPromise) {
    searchPromise = fetchIndex();
  }

  return searchPromise;
}

export async function searchDocuments(query: string) {
  if (!query.trim()) return [];
  const engine = await getSearchEngine();
  return engine.search(query, options);
}

