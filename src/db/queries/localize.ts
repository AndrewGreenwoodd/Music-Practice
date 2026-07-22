import type { Locale } from "@/i18n/config";

export function localized(
  en: string,
  uk: string | null | undefined,
  locale: Locale,
): string {
  return locale === "uk" && uk ? uk : en;
}
