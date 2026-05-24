function required(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
}

export const env = {
  SUPABASE_URL: () => required("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL),
  SUPABASE_ANON_KEY: () => required("NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  SITE_URL: () => process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ALLOWED_EMAILS: () =>
    (process.env.ADMIN_ALLOWED_EMAILS ?? "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
};

export function isAllowed(email: string | null | undefined): boolean {
  if (!email) return false;
  const list = env.ALLOWED_EMAILS();
  return list.length > 0 && list.includes(email.toLowerCase());
}
