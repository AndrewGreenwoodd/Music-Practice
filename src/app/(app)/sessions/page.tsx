import Link from "next/link";
import { redirect } from "next/navigation";
import { format, parseISO } from "date-fns";
import { auth } from "@/lib/auth";
import { listSessions } from "@/db/queries/sessions";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/get-dictionary";
import { getDateFnsLocale } from "@/i18n/date-locale";

export default async function SessionsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const locale = await getLocale();
  const dict = getDictionary(locale);
  const dateFnsLocale = getDateFnsLocale(locale);

  const sessions = await listSessions(session.user.id, locale);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{dict.sessions.title}</h1>
        <Button
          nativeButton={false}
          render={<Link href="/sessions/new">{dict.sessions.logSession}</Link>}
        />
      </div>

      {sessions.length === 0 ? (
        <p className="text-sm text-muted-foreground">{dict.sessions.noSessions}</p>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => (
            <Card key={s.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <p className="font-medium">
                  {format(parseISO(s.date), "EEEE, MMM d, yyyy", { locale: dateFnsLocale })}
                </p>
                <Badge variant="secondary">
                  {s.durationMinutes} {dict.common.min}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                {s.items.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {s.items.map((link) =>
                      link.item ? (
                        <Link key={link.id} href={`/items/${link.item.id}`}>
                          <Badge variant="outline">{link.title}</Badge>
                        </Link>
                      ) : (
                        <Badge key={link.id} variant="outline" className="opacity-60">
                          {link.title}
                        </Badge>
                      ),
                    )}
                  </div>
                )}
                {s.win && (
                  <p className="text-sm">
                    <span className="text-muted-foreground">{dict.sessions.win}</span> {s.win}
                  </p>
                )}
                {s.struggle && (
                  <p className="text-sm">
                    <span className="text-muted-foreground">{dict.sessions.struggle}</span>{" "}
                    {s.struggle}
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
