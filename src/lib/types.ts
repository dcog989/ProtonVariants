export type OptionType = "bool" | "string" | "int" | "enum" | "path" | "unknown";

export interface RuntimeOption {
  name: string;
  description: string;
  type: OptionType;
  default?: string;
  values?: string[];
  source: string;
  unique?: boolean;
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
}

export interface VariantRef {
  id: string;
  displayName: string;
  repoUrl: string;
  readmeUrl: string;
}
