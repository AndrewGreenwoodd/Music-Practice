"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Dictionary } from "@/i18n/dictionaries/en";

export function ThemeToggle({ dict }: { dict: Dictionary["theme"] }) {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="icon" aria-label={dict.toggle}>
            <Sun className="size-4 dark:hidden" />
            <Moon className="hidden size-4 dark:block" />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>{dict.light}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>{dict.dark}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>{dict.system}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
