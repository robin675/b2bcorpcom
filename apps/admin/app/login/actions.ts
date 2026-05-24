"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { env, isAllowed } from "@/lib/env";

export async function sendMagicLink(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) redirect("/login?tab=magic&error=" + encodeURIComponent("이메일을 입력해 주세요"));

  if (!isAllowed(email)) {
    redirect("/login?tab=magic&error=" + encodeURIComponent("허용되지 않은 이메일입니다"));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${env.SITE_URL()}/auth/callback` },
  });
  if (error) redirect("/login?tab=magic&error=" + encodeURIComponent(error.message));

  redirect("/login?tab=magic&sent=1");
}

export async function signInWithPassword(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) {
    redirect("/login?error=" + encodeURIComponent("이메일과 비밀번호를 입력해 주세요"));
  }
  if (!isAllowed(email)) {
    redirect("/login?error=" + encodeURIComponent("허용되지 않은 이메일입니다"));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect("/login?error=" + encodeURIComponent(error.message));
  }
  redirect("/");
}
