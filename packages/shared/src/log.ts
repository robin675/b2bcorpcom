type Level = "info" | "warn" | "error";

export function log(level: Level, msg: string, fields?: Record<string, unknown>): void {
  const line = { ts: new Date().toISOString(), level, msg, ...(fields ?? {}) };
  // Workers and Node both honor console.log; structured JSON keeps logs greppable.
  const out = level === "error" ? console.error : level === "warn" ? console.warn : console.log;
  out(JSON.stringify(line));
}
