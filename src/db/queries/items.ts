import { eq } from "drizzle-orm";
import { db } from "@/db";
import { items } from "@/db/schema";
import type { Locale } from "@/i18n/config";
import { localized } from "./localize";

export async function getItemDetail(itemId: number, locale: Locale) {
  const item = await db.query.items.findFirst({
    where: eq(items.id, itemId),
    with: {
      category: { with: { phase: true } },
    },
  });
  if (!item) return null;

  return {
    item: {
      ...item,
      title: localized(item.title, item.titleUk, locale),
      description: item.description
        ? localized(item.description, item.descriptionUk, locale)
        : item.description,
      longDescription: item.longDescription
        ? localized(item.longDescription, item.longDescriptionUk, locale)
        : item.longDescription,
      category: {
        ...item.category,
        name: localized(item.category.name, item.category.nameUk, locale),
        phase: {
          ...item.category.phase,
          title: localized(item.category.phase.title, item.category.phase.titleUk, locale),
        },
      },
    },
  };
}
