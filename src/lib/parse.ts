import type { OptionType, RuntimeOption } from "./types";

const TYPE_HINTS: Array<[RegExp, OptionType]> = [
  [/bool|boolean|toggle|enable|disable|on\/off/i, "bool"],
  [/integer|int\b|\bcount\b|number/i, "int"],
  [/\bpath\b|directory|folder|file\b/i, "path"],
  [/enum|one of|comma[- ]separated list|list of/i, "enum"],
];

const BOOL_NAME =
  /^(PROTON_)?(NO_|USE_|ENABLE_|DISABLE_|HIDE_|SET_|FORCE_|PREFER_|EMULATE_|ALLOW_|REQUIRE_|UPGRADE|RDNA3_|DLSS|NVAPI|OPTISCALER)/;

function inferType(name: string, description: string): OptionType {
  const text = `${name} ${description}`;
  for (const [re, type] of TYPE_HINTS) {
    if (re.test(text)) return type;
  }
  if (/set to `?(1|0|true|false)`?|=1\b|=0\b|when set|if set|if enabled/i.test(text)) return "bool";
  if (BOOL_NAME.test(name)) return "bool";
  if (/^PROTON_/.test(name)) return "bool";
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

  const envRe = /\b[A-Z][A-Z0-9_]{2,}\b/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (isTableSeparator(line)) continue;

    const name = extractName(line);
    if (!name || seen.has(name)) continue;
    if (!envRe.test(name)) continue;

    const description = collectDescription(lines, i, line, name);
    if (!name) continue;

    seen.add(name);
    const type = inferType(name, description);
    const values = type === "enum" ? extractValues(description) : undefined;

    options.push({
      name,
      description: description.trim(),
      type,
      values,
      source,
    });
  }

  return options.sort((a, b) => a.name.localeCompare(b.name));
}

function isTableSeparator(line: string): boolean {
  return /^\s*\|?[\s:|-]+\|?\s*$/.test(line) && line.includes("-");
}

function extractName(line: string): string | undefined {
  if (isTableRow(line)) {
    const cells = line.split("|").map((c) => c.trim());
    for (const cell of cells) {
      const m = cell.match(/`([A-Z][A-Z0-9_]{2,})`/) || cell.match(/\*\*([A-Z][A-Z0-9_]{2,})\*\*/);
      if (m) return m[1];
    }
    return undefined;
  }
  const m = line.match(/`([A-Z][A-Z0-9_]{2,})`/) || line.match(/\*\*([A-Z][A-Z0-9_]{2,})\*\*/);
  return m?.[1];
}

function isTableRow(line: string): boolean {
  return line.trim().startsWith("|") && line.includes("|", 1);
}

function collectDescription(lines: string[], i: number, line: string, name: string): string {
  if (isTableRow(line)) {
    const cells = line
      .split("|")
      .map((c) => c.trim())
      .filter(Boolean);
    const last = cells[cells.length - 1] ?? "";
    const cleaned = stripMarkdown(last);
    if (!cleaned || cleaned === name) return "";
    return cleaned;
  }

  const parts: string[] = [];
  for (let j = i; j < Math.min(i + 6, lines.length); j++) {
    if (isTableRow(lines[j]) || isTableSeparator(lines[j])) continue;
    const text = stripMarkdown(lines[j]).trim();
    if (text) parts.push(text);
  }
  return parts.join(" ").replace(/\s+/g, " ");
}

function stripMarkdown(text: string): string {
  return text
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .trim();
}
