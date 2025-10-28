import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";

import {essaiSchema} from "@/lib/schemas";
import type {Essai, EssaiMetadata} from "@/lib/types";

const ESSAIS_DIR = path.join(process.cwd(), "content", "essais");
const MDX_EXT = ".mdx";

function normalizeEssaiFrontMatter(data: Record<string, unknown>) {
  if (data.updated_at instanceof Date) {
    return {...data, updated_at: data.updated_at.toISOString()};
  }
  return data;
}

async function listEssaiFiles() {
  const entries = await fs.readdir(ESSAIS_DIR, {withFileTypes: true}).catch(() => []);
  return entries.filter((entry) => entry.isFile() && entry.name.endsWith(MDX_EXT));
}

export async function getAllEssais(): Promise<Essai[]> {
  const files = await listEssaiFiles();

  const essais: Essai[] = [];

  for (const file of files) {
    const fullPath = path.join(ESSAIS_DIR, file.name);
    const raw = await fs.readFile(fullPath, "utf-8");
    const {data, content} = matter(raw);
    const normalized = normalizeEssaiFrontMatter(data);
    const metadata = essaiSchema.parse(normalized) as EssaiMetadata;
    essais.push({...metadata, body: content.trim()});
  }

  return essais.sort((a, b) => b.updated_at.localeCompare(a.updated_at));
}

export async function getEssaiById(id: string): Promise<Essai | null> {
  const filePath = path.join(ESSAIS_DIR, `${id}${MDX_EXT}`);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const {data, content} = matter(raw);
    const normalized = normalizeEssaiFrontMatter(data);
    const metadata = essaiSchema.parse(normalized) as EssaiMetadata;
    return {...metadata, body: content.trim()};
  } catch {
    return null;
  }
}
