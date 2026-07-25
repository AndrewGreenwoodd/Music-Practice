"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deletePlan, setActivePlan } from "@/lib/actions/plans";
import type { Dictionary } from "@/i18n/dictionaries/en";

export function PlanActions({
  planId,
  isActive,
  isOwnedByUser,
  dict,
}: {
  planId: number;
  isActive: boolean;
  isOwnedByUser: boolean;
  dict: Dictionary["plans"];
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isActive ? "secondary" : "outline"}
        size="sm"
        disabled={isActive || isPending}
        onClick={() => startTransition(() => setActivePlan(planId))}
      >
        {isActive ? dict.active : dict.setActive}
      </Button>
      <Button
        variant="outline"
        size="sm"
        nativeButton={false}
        render={<Link href={`/plans/${planId}/edit`}>{dict.edit}</Link>}
      />
      {isOwnedByUser && (
        <Dialog>
          <DialogTrigger render={<Button variant="destructive" size="sm" />}>
            {dict.delete}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dict.deleteDialogTitle}</DialogTitle>
              <DialogDescription>{dict.deleteDialogDescription}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>{dict.cancel}</DialogClose>
              <Button
                variant="destructive"
                disabled={isPending}
                onClick={() => startTransition(() => deletePlan(planId))}
              >
                {dict.confirmDelete}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
