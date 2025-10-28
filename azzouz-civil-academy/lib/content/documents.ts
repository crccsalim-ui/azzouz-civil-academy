import fs from "node:fs/promises";
import path from "node:path";

import {documentSchema} from "@/lib/schemas";
import type {DocumentMetadata, DocumentWithContent} from "@/lib/types";

const LIBRARY_DIR = path.join(process.cwd(), "content", "library");
const SAMPLES_DIR = path.join(process.cwd(), "content", "samples");
const JSON_EXT = ".json";
const MDX_EXT = ".mdx";

async function pathExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function loadMetadataFromFile(filePath: string) {
  const raw = await fs.readFile(filePath, "utf-8");
  const parsed = JSON.parse(raw);
  return documentSchema.parse(parsed);
}

async function loadDocumentPair(dir: string, basename: string): Promise<DocumentWithContent> {
  const jsonPath = path.join(dir, `${basename}${JSON_EXT}`);
  const metadata = await loadMetadataFromFile(jsonPath);
  const mdxPath = path.join(dir, `${basename}${MDX_EXT}`);

  let body: string | undefined;
  if (await pathExists(mdxPath)) {
    body = await fs.readFile(mdxPath, "utf-8");
  }

  return {...metadata, body};
}

async function listBasenames(dir: string) {
  const entries = await fs.readdir(dir, {withFileTypes: true}).catch(() => []);
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(JSON_EXT))
    .map((entry) => entry.name.replace(JSON_EXT, ""));
}

export async function getAllDocuments(options?: {includeSamples?: boolean; includeBody?: boolean}) {
  const {includeSamples = true, includeBody = false} = options ?? {};
  const dirs = [LIBRARY_DIR];
  if (includeSamples) {
    dirs.push(SAMPLES_DIR);
  }

  const documents: DocumentWithContent[] = [];

  for (const dir of dirs) {
    const basenames = await listBasenames(dir);
    for (const basename of basenames) {
      const document = await loadDocumentPair(dir, basename);
      documents.push(document);
    }
  }

  if (!includeBody) {
    return documents.map((doc) => {
      const metadata = {...doc} as Partial<DocumentWithContent>;
      delete metadata.body;
      return metadata as DocumentMetadata;
    });
  }

  return documents;
}

export async function getDocumentById(id: string): Promise<DocumentWithContent | null> {
  for (const dir of [LIBRARY_DIR, SAMPLES_DIR]) {
    const jsonPath = path.join(dir, `${id}${JSON_EXT}`);
    if (await pathExists(jsonPath)) {
      return loadDocumentPair(dir, id);
    }
  }

  return null;
}

export async function listDocumentIds(): Promise<string[]> {
  const basenames = new Set<string>();

  for (const dir of [LIBRARY_DIR, SAMPLES_DIR]) {
    const names = await listBasenames(dir);
    names.forEach((name) => basenames.add(name));
  }

  return Array.from(basenames);
}





