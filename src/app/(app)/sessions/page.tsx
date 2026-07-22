import Link from "next/link";
import { redirect } from "next/navigation";
import { format, parseISO } from "date-fns";
import { auth } from "@/lib/auth";
import { listSessions } from "@/db/queries/sessions";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function SessionsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const sessions = await listSessions(session.user.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Practice history</h1>
        <Button nativeButton={false} render={<Link href="/sessions/new">Log session</Link>} />
      </div>

      {sessions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No sessions logged yet.</p>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => (
            <Card key={s.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <p className="font-medium">{format(parseISO(s.date), "EEEE, MMM d, yyyy")}</p>
                <Badge variant="secondary">{s.durationMinutes} min</Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                {s.items.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {s.items.map((link) => (
                      <Link key={link.id} href={`/items/${link.item.id}`}>
                        <Badge variant="outline">{link.item.title}</Badge>
                      </Link>
                    ))}
                  </div>
                )}
                {s.win && (
                  <p className="text-sm">
                    <span className="text-muted-foreground">Win:</span> {s.win}
                  </p>
                )}
                {s.struggle && (
                  <p className="text-sm">
                    <span className="text-muted-foreground">Struggle:</span> {s.struggle}
                  </p>
                )}
                {s.notes && <p className="text-sm text-muted-foreground">{s.notes}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
