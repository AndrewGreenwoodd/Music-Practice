"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { setItemStatus } from "@/lib/actions/progress";
import type { ItemStatus } from "@/lib/types";

export function ItemChecklistRow({
  itemId,
  title,
  description,
  status,
}: {
  itemId: number;
  title: string;
  description: string | null;
  status: ItemStatus;
}) {
  const [isPending, startTransition] = useTransition();
  const checked = status === "done";

  const toggle = () => {
    startTransition(() => {
      setItemStatus(itemId, checked ? "not_started" : "done");
    });
  };

  return (
    <div className="flex items-start gap-3">
      <Checkbox checked={checked} disabled={isPending} onCheckedChange={toggle} className="mt-1" />
      <div className="min-w-0">
        <Link href={`/items/${itemId}`} className="text-sm font-medium hover:underline">
          {title}
        </Link>
        {description && (
          <p
            className="cursor-pointer text-sm text-muted-foreground"
            onClick={toggle}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
