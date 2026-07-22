import Link from "next/link";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/layout/sign-out-button";

const NAV_LINKS = [
  { href: "/today", label: "Today" },
  { href: "/phases", label: "Phases" },
  { href: "/theory", label: "Theory" },
  { href: "/sessions", label: "History" },
  { href: "/habits", label: "Habits" },
  { href: "/ear-training", label: "Ear Training" },
];

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 p-4">
          <nav className="flex items-center gap-4">
            <Link href="/today" className="font-semibold">
              Music Practice
            </Link>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {session?.user?.email && (
              <span className="text-sm text-muted-foreground">
                {session.user.email}
              </span>
            )}
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-4xl flex-1 p-4">{children}</main>
    </div>
  );
}
