import { eq } from "drizzle-orm";
import { db } from "@/db";
import { instruments, plans, users } from "@/db/schema";
import type { Locale } from "@/i18n/config";
import { localized } from "./localize";

async function loadPlanWithInstrument(planId: number, locale: Locale) {
  const plan = await db.query.plans.findFirst({
    where: eq(plans.id, planId),
    with: { instrument: true },
  });
  if (!plan) return null;

  return {
    instrument: {
      ...plan.instrument,
      name: localized(plan.instrument.name, plan.instrument.nameUk, locale),
    },
    plan: {
      ...plan,
      title: localized(plan.title, plan.titleUk, locale),
      description: plan.description
        ? localized(plan.description, plan.descriptionUk, locale)
        : plan.description,
    },
  };
}

/**
 * Resolves the user's active plan: whatever they've explicitly picked via
 * `/plans` (users.activePlanId), or — if they haven't picked one yet — the
 * originally-seeded guitar plan, so existing users see no change in behavior
 * until they visit the plans page.
 */
export async function getActivePlan(userId: string, locale: Locale) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (user?.activePlanId) {
    const active = await loadPlanWithInstrument(user.activePlanId, locale);
    if (active) return active;
  }

  const instrument = await db.query.instruments.findFirst({
    where: eq(instruments.slug, "guitar"),
  });
  if (!instrument) return null;

  const fallbackPlan = await db.query.plans.findFirst({
    where: eq(plans.instrumentId, instrument.id),
  });
  if (!fallbackPlan) return null;

  return loadPlanWithInstrument(fallbackPlan.id, locale);
}
