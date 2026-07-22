import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getItemDetail } from "@/db/queries/items";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LongDescription } from "@/components/theory/long-description";
import { getLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/get-dictionary";

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ itemId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { itemId } = await params;
  const itemIdNum = Number(itemId);
  if (Number.isNaN(itemIdNum)) notFound();

  const locale = await getLocale();
  const dict = getDictionary(locale);

  const data = await getItemDetail(itemIdNum, locale);
  if (!data) notFound();

  const { item } = data;
  const phase = item.category.phase;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/practice" className="text-sm text-muted-foreground hover:underline">
          &larr; {dict.itemDetail.back}
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">{item.title}</h1>
        <p className="text-sm text-muted-foreground">
          {phase.title} &middot; {item.category.name}
        </p>
        {item.description && (
          <p className="mt-3 text-sm text-muted-foreground">{item.description}</p>
        )}
      </div>

      {item.longDescription && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{dict.itemDetail.inDepth}</CardTitle>
          </CardHeader>
          <CardContent>
            <LongDescription text={item.longDescription} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
