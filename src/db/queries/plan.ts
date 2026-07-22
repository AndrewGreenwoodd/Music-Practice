import { eq } from "drizzle-orm";
import { db } from "@/db";
import { instruments, plans } from "@/db/schema";

/**
 * MVP only seeds a single instrument/plan (guitar). This is the one place
 * that assumption lives, so adding a second instrument later means adding
 * a picker here instead of touching every page.
 */
export async function getActivePlan() {
  const instrument = await db.query.instruments.findFirst({
    where: eq(instruments.slug, "guitar"),
  });
  if (!instrument) return null;

  const plan = await db.query.plans.findFirst({
    where: eq(plans.instrumentId, instrument.id),
  });
  if (!plan) return null;

  return { instrument, plan };
}
