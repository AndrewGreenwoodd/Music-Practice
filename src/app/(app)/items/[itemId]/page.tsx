import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { format } from "date-fns";
import { auth } from "@/lib/auth";
import { getItemDetail } from "@/db/queries/items";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ItemStatusSelect } from "@/components/items/item-status-select";
import { BpmLogForm } from "@/components/items/bpm-log-form";
import { BpmChart } from "@/components/items/bpm-chart";
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

  const { item, status, bpmHistory, recentSessions } = data;
  const phase = item.category.phase;

  const chartData = [...bpmHistory]
    .reverse()
    .map((log) => ({ date: format(log.recordedAt, "MMM d"), bpm: log.bpm }));

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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Metronome BPM history</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <BpmLogForm itemId={item.id} />

          {bpmHistory.length > 0 ? (
            <>
              <BpmChart data={chartData} />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>BPM</TableHead>
                    <TableHead>Note</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bpmHistory.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{format(log.recordedAt, "MMM d, yyyy")}</TableCell>
                      <TableCell>{log.bpm}</TableCell>
                      <TableCell className="text-muted-foreground">{log.note}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No BPM logged yet.</p>
          )}
        </CardContent>
      </Card>

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
