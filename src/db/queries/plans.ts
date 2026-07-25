import { eq } from "drizzle-orm";
import { db } from "@/db";
import { plans, users } from "@/db/schema";
import type { Locale } from "@/i18n/config";
import { localized } from "./localize";

export async function listPlansForUser(userId: string, locale: Locale) {
  const [user, allPlans] = await Promise.all([
    db.query.users.findFirst({ where: eq(users.id, userId) }),
    db.query.plans.findMany({ with: { instrument: true } }),
  ]);

  return allPlans
    .map((plan) => ({
      id: plan.id,
      title: localized(plan.title, plan.titleUk, locale),
      description: plan.description
        ? localized(plan.description, plan.descriptionUk, locale)
        : plan.description,
      instrumentSlug: plan.instrument.slug,
      instrumentName: localized(plan.instrument.name, plan.instrument.nameUk, locale),
      isOwnedByUser: plan.ownerId === userId,
      isActive: plan.id === user?.activePlanId,
      createdAt: plan.createdAt,
    }))
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}

export async function getPlanForEdit(planId: number, userId: string) {
  const plan = await db.query.plans.findFirst({
    where: eq(plans.id, planId),
    with: { instrument: true },
  });
  if (!plan || plan.ownerId !== userId) return null;

  return {
    id: plan.id,
    title: plan.title,
    instrumentName: plan.instrument.name,
    sourceMarkdown: plan.sourceMarkdown ?? "",
  };
}
