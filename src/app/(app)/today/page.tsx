import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getActivePlan } from "@/db/queries/plan";
import { getTodayData } from "@/db/queries/today";
import { listPhases } from "@/db/queries/phases";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ItemStatusCheckbox } from "@/components/items/item-status-checkbox";
import { PhaseSelector } from "@/components/phases/phase-selector";

export default async function TodayPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const active = await getActivePlan();
  if (!active) {
    return <p className="text-muted-foreground">No practice plan found. Run the seed script.</p>;
  }

  const [data, allPhases] = await Promise.all([
    getTodayData(session.user.id, active.plan.id),
    listPhases(active.plan.id),
  ]);
  if (!data) {
    return <p className="text-muted-foreground">No current phase set.</p>;
  }

  const { phase, categories, progress } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Today &middot; {active.instrument.name}</p>
          <h1 className="text-2xl font-semibold">{phase.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{phase.goal}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <PhaseSelector planId={active.plan.id} currentPhaseId={phase.id} phases={allPhases} />
          <Button
            nativeButton={false}
            render={<Link href="/sessions/new">Log today&apos;s session</Link>}
          />
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {progress.done} / {progress.total} items marked done in this phase
      </p>

      <div className="space-y-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{category.name}</CardTitle>
                {category.dailyMinMinutes && (
                  <Badge variant="secondary">
                    {category.dailyMinMinutes}
                    {category.dailyMaxMinutes && category.dailyMaxMinutes !== category.dailyMinMinutes
                      ? `-${category.dailyMaxMinutes}`
                      : ""}{" "}
                    min
                  </Badge>
                )}
              </div>
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
