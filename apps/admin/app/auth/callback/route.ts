import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (code) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.exchangeCodeForSession(code);
  }
  // Magic-link users land on /account to set a password — one-time friction
  // that buys them password-only logins from then on. They can skip by
  // clicking the "← 대시보드" link in the nav.
  return NextResponse.redirect(new URL("/account?first=1", url));
}
