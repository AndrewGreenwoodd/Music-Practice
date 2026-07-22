import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getActivePlan } from "@/db/queries/plan";
import { getTheoryConcepts } from "@/db/queries/theory";
import { Card, CardContent } from "@/components/ui/card";
import { getLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/get-dictionary";

export default async function TheoryPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const locale = await getLocale();
  const dict = getDictionary(locale);

  const active = await getActivePlan(locale);
  if (!active) {
    return <p className="text-muted-foreground">{dict.theory.noPlan}</p>;
  }

  const phaseConcepts = await getTheoryConcepts(active.plan.id, locale);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{dict.theory.title}</h1>
        <p className="text-sm text-muted-foreground">
          {dict.theory.subtitle.replace("{plan}", active.plan.title)}
        </p>
      </div>

      <div className="space-y-6">
        {phaseConcepts.map(({ phase, items: theoryItems }) => (
          <section key={phase.id} className="space-y-2">
            <h2 className="text-lg font-semibold">{phase.title}</h2>

            <Card>
              <CardContent className="divide-y divide-border p-0">
                {theoryItems.map((item) => (
                  <Link
                    key={item.id}
                    href={`/items/${item.id}`}
                    className="block px-4 py-3 text-sm font-medium hover:bg-muted"
                  >
                    {item.title}
                  </Link>
                ))}
              </CardContent>
            </Card>
          </section>
        ))}
      </div>
    </div>
  );
}
