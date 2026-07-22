import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getItemDetail } from "@/db/queries/items";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ItemStatusSelect } from "@/components/items/item-status-select";
import { LongDescription } from "@/components/theory/long-description";

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

  const data = await getItemDetail(itemIdNum, session.user.id);
  if (!data) notFound();

  const { item, status, recentSessions } = data;
  const phase = item.category.phase;

  return (
    <div className="space-y-6">
      <div>
        <Link href={`/phases/${phase.id}`} className="text-sm text-muted-foreground hover:underline">
          &larr; {phase.title}
        </Link>
        <div className="mt-2 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{item.title}</h1>
            <p className="text-sm text-muted-foreground">{item.category.name}</p>
          </div>
          <ItemStatusSelect itemId={item.id} status={status} />
        </div>
        {item.description && (
          <p className="mt-3 text-sm text-muted-foreground">{item.description}</p>
        )}
      </div>

      {item.longDescription && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">In depth</CardTitle>
          </CardHeader>
          <CardContent>
            <LongDescription text={item.longDescription} />
          </CardContent>
        </Card>
      )}

      {recentSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent sessions covering this</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentSessions.map((s) => (
              <Link
                key={s.id}
                href="/sessions"
                className="block text-sm hover:underline"
              >
                {s.date} &middot; {s.durationMinutes} min
                {s.win ? ` — ${s.win}` : ""}
              </Link>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
