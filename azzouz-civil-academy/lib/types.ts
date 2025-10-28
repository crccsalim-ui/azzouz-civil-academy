export type Domain = 'ba' | 'acier' | 'sismique' | 'geotech' | 'essais';

export type Jurisdiction = 'FR' | 'DZ' | 'INT';

export type RightsStatus = 'own' | 'licensed' | 'public_domain' | 'unclear';

export type DistributionMode = 'host_file' | 'link_out';

export type DocumentStatus = 'active' | 'withdrawn' | 'draft' | 'unknown';

export type Citation = {
  quote: string;
  page: string;
  ref: string;
};

export type FileDescriptor = {
  original_name: string;
  mime: string;
  size_bytes: number;
  sha256: string;
  storage_key?: string;
};

export type DocumentMetadata = {
  id: string;
  title: string;
  domain: Domain;
  jurisdiction: Jurisdiction;
  publisher: string;
  year: number;
  status: DocumentStatus;
  rights_status: RightsStatus;
  distribution_mode: DistributionMode;
  source_official_url: string;
  file?: FileDescriptor;
  summary: string;
  citations: Citation[];
  tags: string[];
  created_at: string;
  updated_at: string;
};

export type DocumentWithContent = DocumentMetadata & {
  body?: string;
};

export type SearchableDocument = Pick<
  DocumentMetadata,
  'id' | 'title' | 'domain' | 'jurisdiction' | 'year' | 'tags' | 'summary'
> & {status: DocumentStatus; rights_status: RightsStatus};

export type EssaiMetadata = {
  id: string;
  title: string;
  category: string;
  summary: string;
  tags: string[];
  updated_at: string;
};

export type Essai = EssaiMetadata & {
  body: string;
};

