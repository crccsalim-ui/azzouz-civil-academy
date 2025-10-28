import {z} from 'zod';

export const documentSchema = z.object({
  id: z.string(),
  title: z.string(),
  domain: z.enum(['ba', 'acier', 'sismique', 'geotech', 'essais']),
  jurisdiction: z.enum(['FR', 'DZ', 'INT']),
  publisher: z.string(),
  year: z.number(),
  status: z.enum(['active', 'withdrawn', 'draft', 'unknown']).default('unknown'),
  rights_status: z.enum(['own', 'licensed', 'public_domain', 'unclear']),
  distribution_mode: z.enum(['host_file', 'link_out']),
  source_official_url: z.string().url().or(z.literal('')),
  file: z
    .object({
      original_name: z.string(),
      mime: z.string(),
      size_bytes: z.number().nonnegative(),
      sha256: z.string(),
      storage_key: z.string().optional(),
    })
    .optional(),
  summary: z.string().default(''),
  citations: z
    .array(
      z.object({
        quote: z.string(),
        page: z.string(),
        ref: z.string(),
      }),
    )
    .default([]),
  tags: z.array(z.string()).default([]),
  created_at: z.string(),
  updated_at: z.string(),
});

export const essaiSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  summary: z.string(),
  tags: z.array(z.string()).default([]),
  updated_at: z.string(),
});
