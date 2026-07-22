import { enUS, uk } from "date-fns/locale";
import type { Locale } from "./config";

export function getDateFnsLocale(locale: Locale) {
  return locale === "uk" ? uk : enUS;
}
