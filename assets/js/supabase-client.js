import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const inlineConfig = window.SUPABASE_CONFIG || {};
const metaConfig = {
  projectUrl: document.querySelector('meta[name="supabase-project-url"]')?.content || "",
  publishableKey: document.querySelector('meta[name="supabase-publishable-key"]')?.content || ""
};
const config = {
  projectUrl: inlineConfig.projectUrl || metaConfig.projectUrl,
  publishableKey: inlineConfig.publishableKey || metaConfig.publishableKey
};
export const isSupabaseConfigured = Boolean(config.projectUrl && config.publishableKey);
export const supabase = isSupabaseConfigured
  ? createClient(config.projectUrl, config.publishableKey)
  : null;

export function configurationMessage() {
  return "Supabase 尚未配置：请在 _config.yml 中填写 supabase.project_url 和 supabase.publishable_key。";
}

export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function formatSupabaseError(error) {
  return error?.message || "Supabase 请求失败，请检查项目配置和 RLS 策略。";
}
