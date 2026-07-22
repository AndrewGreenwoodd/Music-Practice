"use client";

import { useTransition } from "react";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setLocale } from "@/lib/actions/locale";
import type { Locale } from "@/i18n/config";

// Language names are always shown in their own language, regardless of the
// current UI language — the standard convention for language pickers.
const OPTIONS: { locale: Locale; label: string }[] = [
  { locale: "en", label: "English" },
  { locale: "uk", label: "Українська" },
];

export function LanguageToggle({ locale, toggleLabel }: { locale: Locale; toggleLabel: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            aria-label={toggleLabel}
            disabled={isPending}
          >
            <Languages className="size-4" />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        {OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.locale}
            onClick={() => startTransition(() => setLocale(option.locale))}
            className={locale === option.locale ? "font-semibold" : undefined}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
