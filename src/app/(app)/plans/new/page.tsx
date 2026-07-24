import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { PlanForm } from "@/components/plans/plan-form";
import { getLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/get-dictionary";

export default async function NewPlanPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link href="/plans" className="text-sm text-muted-foreground hover:underline">
          &larr; {dict.plans.back}
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">{dict.plans.newTitle}</h1>
      </div>
      <PlanForm mode="create" dict={dict.plans} />
    </div>
  );
}
