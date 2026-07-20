import type { OptionType, RuntimeOption } from "./types";

const TYPE_HINTS: Array<[RegExp, OptionType]> = [
  [/bool|boolean|toggle|enable|disable|on\/off/i, "bool"],
  [/integer|int\b|\bcount\b|number/i, "int"],
  [/\bpath\b|directory|folder|file\b/i, "path"],
  [/enum|one of|comma[- ]separated list|list of/i, "enum"],
];

function inferType(text: string): OptionType {
  for (const [re, type] of TYPE_HINTS) {
    if (re.test(text)) return type;
  }
  if (/\b(true|false)\b/i.test(text)) return "bool";
  return "unknown";
}

function extractValues(description: string): string[] | undefined {
  const match = description.match(/one of[:\s]*([A-Za-z0-9_,\s/|-]+)/i);
  if (!match) return undefined;
  const values = match[1]
    .split(/[,\s|]+/)
    .map((v) => v.trim())
    .filter((v) => v.length > 0 && !/^(or|the|and)$/i.test(v));
  return values.length > 1 ? values : undefined;
}

export function parseEnvVars(markdown: string, source: string): RuntimeOption[] {
  const lines = markdown.split("\n");
  const options: RuntimeOption[] = [];
  const seen = new Set<string>();

  const envRe = /\b([A-Z][A-Z0-9_]{2,})\b/g;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const codeMatch = line.match(/`([A-Z][A-Z0-9_]{2,})`/) || line.match(/\*\*([A-Z][A-Z0-9_]{2,})\*\*/);
    const name = codeMatch?.[1];

    if (!name || seen.has(name)) continue;
    if (!envRe.test(name)) continue;

    const description = collectDescription(lines, i);
    if (!description) continue;

    seen.add(name);
    const type = inferType(`${name} ${description}`);
    const values = type === "enum" ? extractValues(description) : undefined;
    const def = extractDefault(description);

    options.push({
      name,
      description: description.trim(),
      type,
      default: def,
      values,
      source,
    });
  }

  return options.sort((a, b) => a.name.localeCompare(b.name));
}

function collectDescription(lines: string[], i: number): string {
  const parts: string[] = [];
  for (let j = i; j < Math.min(i + 6, lines.length); j++) {
    const text = lines[j]
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .trim();
    if (text) parts.push(text);
  }
  return parts.join(" ").replace(/\s+/g, " ");
}

function extractDefault(description: string): string | undefined {
  const match = description.match(/default(?:s to)?[:\s]+([`'"]?[\w./-]+['`"]?)/i);
  return match?.[1]?.replace(/[`'"]/g, "");
}
