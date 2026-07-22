import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getActivePlan } from "@/db/queries/plan";
import { getOngoingPhase, getPhaseWithItems } from "@/db/queries/phases";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function HabitsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const active = await getActivePlan();
  if (!active) {
    return <p className="text-muted-foreground">No practice plan found.</p>;
  }

  const ongoingPhase = await getOngoingPhase(active.plan.id);
  if (!ongoingPhase) {
    return <p className="text-muted-foreground">No ongoing habits found.</p>;
  }

  const data = await getPhaseWithItems(ongoingPhase.id, session.user.id);
  if (!data) {
    return <p className="text-muted-foreground">No ongoing habits found.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Ongoing Habits</h1>
        <p className="text-sm text-muted-foreground">{data.phase.goal}</p>
      </div>

      <div className="space-y-4">
        {data.categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="text-base">{category.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {category.items.map((item) => (
                <div key={item.id}>
                  <p className="text-sm font-medium">{item.title}</p>
                  {item.description && (
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
