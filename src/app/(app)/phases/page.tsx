import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getActivePlan } from "@/db/queries/plan";
import { getCurrentPhaseId } from "@/db/queries/today";
import { listPhaseSummaries } from "@/db/queries/phases";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default async function PhasesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const active = await getActivePlan();
  if (!active) {
    return <p className="text-muted-foreground">No practice plan found.</p>;
  }

  const [summaries, currentPhaseId] = await Promise.all([
    listPhaseSummaries(active.plan.id, session.user.id),
    getCurrentPhaseId(session.user.id, active.plan.id),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Phases</h1>
        <p className="text-sm text-muted-foreground">{active.plan.title}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {summaries.map(({ phase, total, done }) => (
          <Link key={phase.id} href={`/phases/${phase.id}`}>
            <Card className={phase.id === currentPhaseId ? "border-primary" : undefined}>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base">{phase.title}</CardTitle>
                  {phase.id === currentPhaseId && <Badge>Current</Badge>}
                </div>
                {phase.durationLabel && (
                  <p className="text-xs text-muted-foreground">{phase.durationLabel}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">{phase.goal}</p>
                <Progress value={total ? (done / total) * 100 : 0} />
                <p className="text-xs text-muted-foreground">
                  {done} / {total} items done
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
