import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getActivePlan } from "@/db/queries/plan";
import { getCurrentPhaseId } from "@/db/queries/today";
import { getPhaseWithItems } from "@/db/queries/phases";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ItemStatusCheckbox } from "@/components/items/item-status-checkbox";
import { SetCurrentPhaseButton } from "@/components/phases/set-current-phase-button";

export default async function PhaseDetailPage({
  params,
}: {
  params: Promise<{ phaseId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { phaseId } = await params;
  const phaseIdNum = Number(phaseId);
  if (Number.isNaN(phaseIdNum)) notFound();

  const active = await getActivePlan();
  if (!active) notFound();

  const [data, currentPhaseId] = await Promise.all([
    getPhaseWithItems(phaseIdNum, session.user.id),
    getCurrentPhaseId(session.user.id, active.plan.id),
  ]);
  if (!data) notFound();

  const { phase, categories, progress } = data;
  const isCurrent = phase.id === currentPhaseId;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/phases" className="text-sm text-muted-foreground hover:underline">
          &larr; All phases
        </Link>
        <div className="mt-2 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold">{phase.title}</h1>
              {isCurrent && <Badge>Current</Badge>}
            </div>
            {phase.durationLabel && (
              <p className="text-sm text-muted-foreground">{phase.durationLabel}</p>
            )}
            <p className="mt-2 text-sm text-muted-foreground">{phase.goal}</p>
          </div>
          {!isCurrent && !phase.isOngoing && (
            <SetCurrentPhaseButton planId={active.plan.id} phaseId={phase.id} />
          )}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {progress.done} / {progress.total} items done
        </p>
      </div>

      {phase.milestone && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Milestone</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{phase.milestone.description}</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {category.items.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <ItemStatusCheckbox itemId={item.id} status={item.status} />
                  <div className="min-w-0">
                    <Link
                      href={`/items/${item.id}`}
                      className="text-sm font-medium hover:underline"
                    >
                      {item.title}
                    </Link>
                    {item.description && (
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
