import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getActivePlan } from "@/db/queries/plan";
import { getCurrentPhaseId } from "@/db/queries/today";
import { getSessionFormItems } from "@/db/queries/sessions";
import { SessionForm } from "@/components/sessions/session-form";

export default async function NewSessionPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const active = await getActivePlan();
  if (!active) {
    return <p className="text-muted-foreground">No practice plan found.</p>;
  }

  const [phaseRows, currentPhaseId] = await Promise.all([
    getSessionFormItems(active.plan.id),
    getCurrentPhaseId(session.user.id, active.plan.id),
  ]);
  const phases = phaseRows.map(({ categories, ...phase }) => ({ phase, categories }));

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Log a practice session</h1>
        <p className="text-sm text-muted-foreground">{active.plan.title}</p>
      </div>
      <SessionForm phases={phases} currentPhaseId={currentPhaseId} />
    </div>
  );
}
