import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getActivePlan } from "@/db/queries/plan";
import { getTheoryConcepts } from "@/db/queries/theory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LongDescription } from "@/components/theory/long-description";

export default async function TheoryPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const active = await getActivePlan();
  if (!active) {
    return <p className="text-muted-foreground">No practice plan found.</p>;
  }

  const phaseConcepts = await getTheoryConcepts(active.plan.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Music Theory</h1>
        <p className="text-sm text-muted-foreground">
          Every theory concept from {active.plan.title}, explained in more depth than the
          practice checklist.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 text-sm">
        {phaseConcepts.map(({ phase }) => (
          <a key={phase.id} href={`#phase-${phase.id}`} className="text-primary hover:underline">
            {phase.title}
          </a>
        ))}
      </div>

      <div className="space-y-8">
        {phaseConcepts.map(({ phase, items: theoryItems }) => (
          <section key={phase.id} id={`phase-${phase.id}`} className="scroll-mt-4 space-y-4">
            <div>
              <h2 className="text-lg font-semibold">{phase.title}</h2>
              {phase.durationLabel && (
                <p className="text-xs text-muted-foreground">{phase.durationLabel}</p>
              )}
            </div>

            <div className="space-y-4">
              {theoryItems.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <CardTitle className="text-base">
                      <Link href={`/items/${item.id}`} className="hover:underline">
                        {item.title}
                      </Link>
                    </CardTitle>
                    {item.description && (
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    )}
                  </CardHeader>
                  <CardContent>
                    {item.longDescription ? (
                      <LongDescription text={item.longDescription} />
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        Detailed explanation coming soon.
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
