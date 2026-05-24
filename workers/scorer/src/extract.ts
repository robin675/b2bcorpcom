// Lightweight HTML → text extraction for Scorer input.
// Crawler week will produce the canonical normalizer; for v0 scoring this
// homepage-only stripper is enough.

const MAX_TEXT_LEN = 6000;

export function extractTitle(html: string): string | null {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!m || !m[1]) return null;
  return decodeEntities(m[1]).trim().slice(0, 300) || null;
}

export function extractText(html: string): string {
  const stripped = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ");

  return decodeEntities(stripped).replace(/\s+/g, " ").trim().slice(0, MAX_TEXT_LEN);
}

const ENTITY_MAP: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

function decodeEntities(s: string): string {
  return s.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (_, ent: string) => {
    if (ent.startsWith("#x") || ent.startsWith("#X")) {
      const cp = parseInt(ent.slice(2), 16);
      return Number.isFinite(cp) ? String.fromCodePoint(cp) : "";
    }
    if (ent.startsWith("#")) {
      const cp = parseInt(ent.slice(1), 10);
      return Number.isFinite(cp) ? String.fromCodePoint(cp) : "";
    }
    return ENTITY_MAP[ent.toLowerCase()] ?? "";
  });
}
