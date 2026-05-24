"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function setPassword(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("password_confirm") ?? "");
  if (password.length < 8) {
    redirect("/account?error=" + encodeURIComponent("비밀번호는 8자 이상이어야 합니다"));
  }
  if (password !== confirm) {
    redirect("/account?error=" + encodeURIComponent("두 번 입력한 값이 다릅니다"));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    redirect("/account?error=" + encodeURIComponent(error.message));
  }
  redirect("/account?saved=1");
}
