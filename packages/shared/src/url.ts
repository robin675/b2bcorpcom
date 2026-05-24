const KR_SECOND_LEVELS = new Set([
  "co", "or", "ne", "go", "re", "pe", "ac", "hs", "ms", "es", "sc", "kg",
]);

export function normalizeUrl(raw: string): string | null {
  try {
    const u = new URL(raw.trim());
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    u.hash = "";
    for (const k of [...u.searchParams.keys()]) {
      if (k.startsWith("utm_") || k === "fbclid" || k === "gclid") {
        u.searchParams.delete(k);
      }
    }
    return u.toString();
  } catch {
    return null;
  }
}

export function extractDomain(raw: string): string | null {
  let host: string;
  try {
    host = new URL(raw).hostname.toLowerCase();
  } catch {
    return null;
  }
  if (host.startsWith("www.")) host = host.slice(4);
  const parts = host.split(".");
  if (parts.length < 2) return null;
  // Korean .co.kr / .or.kr style: keep last 3 labels (companyname.co.kr).
  if (
    parts.length >= 3 &&
    parts[parts.length - 1] === "kr" &&
    KR_SECOND_LEVELS.has(parts[parts.length - 2] ?? "")
  ) {
    return parts.slice(-3).join(".");
  }
  return parts.slice(-2).join(".");
}
