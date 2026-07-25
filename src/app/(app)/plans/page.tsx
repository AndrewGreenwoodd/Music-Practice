import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { listPlansForUser } from "@/db/queries/plans";
import { Button } from "@/components/ui/button";
import { PlansList } from "@/components/plans/plans-list";
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

      <PlansList plans={planRows} dict={dict.plans} />
    </div>
  );
}
