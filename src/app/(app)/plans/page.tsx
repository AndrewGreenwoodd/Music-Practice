import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { listPlansForUser } from "@/db/queries/plans";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlanActions } from "@/components/plans/plan-actions";
import { getLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/get-dictionary";

export default async function PlansPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const locale = await getLocale();
  const dict = getDictionary(locale);

  const planRows = await listPlansForUser(session.user.id, locale);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{dict.plans.title}</h1>
          <p className="text-sm text-muted-foreground">{dict.plans.subtitle}</p>
        </div>
        <Button nativeButton={false} render={<Link href="/plans/new">{dict.plans.uploadNew}</Link>} />
      </div>

      {planRows.length === 0 ? (
        <p className="text-muted-foreground">{dict.plans.noPlans}</p>
      ) : (
        <div className="space-y-3">
          {planRows.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle>{plan.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{plan.instrumentName}</p>
                  </div>
                  <PlanActions
                    planId={plan.id}
                    isActive={plan.isActive}
                    isOwnedByUser={plan.isOwnedByUser}
                    dict={dict.plans}
                  />
                </div>
              </CardHeader>
              {plan.description && (
                <CardContent>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
