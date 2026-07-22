"use client";

import { useTransition } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { setItemStatus } from "@/lib/actions/progress";
import type { ItemStatus } from "@/lib/types";

export function ItemStatusCheckbox({
  itemId,
  status,
}: {
  itemId: number;
  status: ItemStatus;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Checkbox
      checked={status === "done"}
      disabled={isPending}
      onCheckedChange={(checked) => {
        startTransition(() => {
          setItemStatus(itemId, checked ? "done" : "not_started");
        });
      }}
      className="mt-1"
    />
  );
}
