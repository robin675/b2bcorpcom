"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { CONFIG_KEYS } from "@b2bcorpcom/db";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function saveDiscoveryKeywords(formData: FormData) {
  const raw = String(formData.get("keywords") ?? "");
  const keywords = raw
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (keywords.length === 0) {
    redirect("/config?error=" + encodeURIComponent("키워드를 최소 1개 입력하세요"));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("config")
    .upsert(
      { key: CONFIG_KEYS.DiscoveryKeywords, value: keywords, updated_at: new Date().toISOString() },
      { onConflict: "key" },
    );

  if (error) redirect("/config?error=" + encodeURIComponent(error.message));
  revalidatePath("/config");
  redirect("/config?saved=1");
}

export async function saveDiscoverySettings(formData: FormData) {
  const max = Number(formData.get("max_results_per_query") ?? "30");
  if (!Number.isInteger(max) || max < 1 || max > 100) {
    redirect("/config?error=" + encodeURIComponent("max_results_per_query는 1~100 정수"));
  }

  const settings = { max_results_per_query: max, search_engine: "naver" as const };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("config")
    .upsert(
      { key: CONFIG_KEYS.DiscoverySettings, value: settings, updated_at: new Date().toISOString() },
      { onConflict: "key" },
    );

  if (error) redirect("/config?error=" + encodeURIComponent(error.message));
  revalidatePath("/config");
  redirect("/config?saved=1");
}
