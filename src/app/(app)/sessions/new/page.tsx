import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getActivePlan } from "@/db/queries/plan";
import { getCurrentPhaseId } from "@/db/queries/practice";
import { getSessionFormItems } from "@/db/queries/sessions";
import { SessionForm } from "@/components/sessions/session-form";
import { getLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/get-dictionary";

export default async function NewSessionPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const locale = await getLocale();
  const dict = getDictionary(locale);

  const active = await getActivePlan(session.user.id, locale);
  if (!active) {
    return <p className="text-muted-foreground">{dict.sessionForm.noPlan}</p>;
  }

  const [phaseRows, currentPhaseId] = await Promise.all([
    getSessionFormItems(active.plan.id, locale),
    getCurrentPhaseId(session.user.id, active.plan.id),
  ]);
  const phases = phaseRows.map(({ categories, ...phase }) => ({ phase, categories }));

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{dict.sessionForm.title}</h1>
        <p className="text-sm text-muted-foreground">{active.plan.title}</p>
      </div>
      <SessionForm
        phases={phases}
        currentPhaseId={currentPhaseId}
        locale={locale}
        dict={dict.sessionForm}
      />
    </div>
  );
}
