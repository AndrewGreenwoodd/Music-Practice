import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { phases, practiceSessions } from "@/db/schema";
import type { Locale } from "@/i18n/config";
import { localized } from "./localize";

export async function listSessions(userId: string, locale: Locale) {
  const rows = await db.query.practiceSessions.findMany({
    where: eq(practiceSessions.userId, userId),
    orderBy: [desc(practiceSessions.date), desc(practiceSessions.createdAt)],
    with: {
      items: { with: { item: true } },
    },
  });

  return rows.map((session) => ({
    ...session,
    items: session.items.map((link) => ({
      ...link,
      item: { ...link.item, title: localized(link.item.title, link.item.titleUk, locale) },
    })),
  }));
}

export async function getSessionFormItems(planId: number, locale: Locale) {
  const rows = await db.query.phases.findMany({
    where: eq(phases.planId, planId),
    with: {
      categories: {
        orderBy: (c, { asc }) => asc(c.orderIndex),
        with: { items: { orderBy: (i, { asc }) => asc(i.orderIndex) } },
      },
    },
    orderBy: (p, { asc }) => asc(p.orderIndex),
  });

  return rows.map((phase) => ({
    ...phase,
    title: localized(phase.title, phase.titleUk, locale),
    categories: phase.categories.map((category) => ({
      ...category,
      name: localized(category.name, category.nameUk, locale),
      items: category.items.map((item) => ({
        ...item,
        title: localized(item.title, item.titleUk, locale),
      })),
    })),
  }));
}
