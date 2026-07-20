export type OptionType = "bool" | "string" | "int" | "enum" | "path" | "unknown";

export interface RuntimeOption {
  name: string;
  description: string;
  type: OptionType;
  values?: string[];
  source: string;
}

export interface RuntimeOptionView extends RuntimeOption {
  unique: boolean;
}

export interface Variant {
  id: string;
  displayName: string;
  repoUrl: string;
  readmeUrl: string;
  options: RuntimeOption[];
  scrapedAt: string;
  etag?: string;
  lastModified?: string;
  release?: string;
  releaseDate?: string;
}

export interface VariantRef {
  id: string;
  displayName: string;
  repoUrl: string;
  readmeUrl: string;
  releaseUrl?: string;
}
