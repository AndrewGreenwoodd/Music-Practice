import { eq } from "drizzle-orm";
import { db } from "@/db";
import { instruments, plans } from "@/db/schema";
import type { Locale } from "@/i18n/config";
import { localized } from "./localize";

/**
 * MVP only seeds a single instrument/plan (guitar). This is the one place
 * that assumption lives, so adding a second instrument later means adding
 * a picker here instead of touching every page.
 */
export async function getActivePlan(locale: Locale) {
  const instrument = await db.query.instruments.findFirst({
    where: eq(instruments.slug, "guitar"),
  });
  if (!instrument) return null;

  const plan = await db.query.plans.findFirst({
    where: eq(plans.instrumentId, instrument.id),
  });
  if (!plan) return null;

  return {
    instrument: {
      ...instrument,
      name: localized(instrument.name, instrument.nameUk, locale),
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
