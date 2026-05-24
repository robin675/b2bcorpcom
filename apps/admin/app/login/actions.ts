"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { env, isAllowed } from "@/lib/env";

export async function sendMagicLink(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) redirect("/login?error=" + encodeURIComponent("이메일을 입력해 주세요"));

  if (!isAllowed(email)) {
    redirect("/login?error=" + encodeURIComponent("허용되지 않은 이메일입니다"));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${env.SITE_URL()}/auth/callback` },
  });
  if (error) redirect("/login?error=" + encodeURIComponent(error.message));

  redirect("/login?sent=1");
}
