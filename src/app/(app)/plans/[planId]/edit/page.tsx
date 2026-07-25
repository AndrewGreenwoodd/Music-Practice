import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getPlanForEdit } from "@/db/queries/plans";
import { PlanForm } from "@/components/plans/plan-form";
import { getLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/get-dictionary";

export default async function EditPlanPage({
  params,
}: {
  params: Promise<{ planId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { planId } = await params;
  const planIdNum = Number(planId);
  if (Number.isNaN(planIdNum)) notFound();

  const locale = await getLocale();
  const dict = getDictionary(locale);

  const plan = await getPlanForEdit(planIdNum);
  if (!plan) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link href="/plans" className="text-sm text-muted-foreground hover:underline">
          &larr; {dict.plans.back}
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">{dict.plans.editTitle}</h1>
        <p className="text-sm text-muted-foreground">{plan.title}</p>
      </div>
      <PlanForm
        mode="edit"
        planId={plan.id}
        initialMarkdown={plan.sourceMarkdown}
        initialInstrumentName={plan.instrumentName}
        isOwnedByUser={plan.ownerId === session.user.id}
        dict={dict.plans}
      />
    </div>
  );
}
