import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getActivePlan } from "@/db/queries/plan";
import { getPracticeData } from "@/db/queries/practice";
import { listPhases } from "@/db/queries/phases";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ItemChecklistRow } from "@/components/items/item-checklist-row";
import { PhaseSelector } from "@/components/phases/phase-selector";
import { getLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/get-dictionary";

export default async function PracticePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const locale = await getLocale();
  const dict = getDictionary(locale);

  const active = await getActivePlan(session.user.id, locale);
  if (!active) {
    return <p className="text-muted-foreground">{dict.practice.noPlan}</p>;
  }

  const [data, allPhases] = await Promise.all([
    getPracticeData(session.user.id, active.plan.id, locale),
    listPhases(active.plan.id, locale),
  ]);
  if (!data) {
    return <p className="text-muted-foreground">{dict.practice.noPhase}</p>;
  }

  const { phase, categories, progress } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {dict.practice.subtitle} &middot; {active.instrument.name}
          </p>
          <h1 className="text-2xl font-semibold">{phase.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{phase.goal}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <PhaseSelector planId={active.plan.id} currentPhaseId={phase.id} phases={allPhases} />
          <Button
            nativeButton={false}
            render={<Link href="/sessions/new">{dict.practice.logSession}</Link>}
          />
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {progress.done} / {progress.total} {dict.practice.itemsDone}
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
                    {dict.common.min}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {category.items.map((item) => (
                <ItemChecklistRow
                  key={item.id}
                  itemId={item.id}
                  title={item.title}
                  description={item.description}
                  status={item.status}
                />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
