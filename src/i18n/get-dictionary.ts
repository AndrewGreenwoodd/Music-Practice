import type { Locale } from "./config";
import { en } from "./dictionaries/en";
import { uk } from "./dictionaries/uk";

export function getDictionary(locale: Locale) {
  return locale === "uk" ? uk : en;
}
