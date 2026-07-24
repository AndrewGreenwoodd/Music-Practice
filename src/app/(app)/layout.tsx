import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { getLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/get-dictionary";
import { MusicNoteIcon } from "@/components/icons/music-note-icon";
import { MetronomeWidget } from "@/components/metronome/metronome-widget";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, locale] = await Promise.all([auth(), getLocale()]);
  const dict = getDictionary(locale);

  const navLinks = [
    { href: "/practice", label: dict.nav.practice },
    { href: "/theory", label: dict.nav.theory },
    { href: "/sessions", label: dict.nav.history },
    { href: "/plans", label: dict.nav.managePlans },
  ];

  const extraLinks = [
    { href: "/ear-training", label: dict.nav.earTraining },
    { href: "/sheet-reading", label: dict.nav.sheetReading },
    { href: "/famous-licks", label: dict.nav.famousLicks },
  ];

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 p-4">
          <nav className="flex items-center gap-4">
            <Link href="/practice" aria-label={dict.app.name}>
              <MusicNoteIcon className="size-6" />
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm text-muted-foreground outline-none hover:text-foreground data-popup-open:text-foreground">
                {dict.nav.extra}
                <ChevronDown className="size-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {extraLinks.map((link) => (
                  <DropdownMenuItem key={link.href} render={<Link href={link.href} />}>
                    {link.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
          <div className="flex items-center gap-3">
            {session?.user?.username && (
              <span className="text-sm text-muted-foreground">
                {session.user.username}
              </span>
            )}
            <LanguageToggle locale={locale} toggleLabel={dict.language.toggle} />
            <ThemeToggle dict={dict.theme} />
            <SignOutButton label={dict.nav.signOut} />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-4xl flex-1 p-4">{children}</main>
      <MetronomeWidget dict={dict.metronome} />
    </div>
  );
}
