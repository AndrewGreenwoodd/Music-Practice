"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { setCurrentPhase } from "@/lib/actions/progress";

export function SetCurrentPhaseButton({
  planId,
  phaseId,
}: {
  planId: number;
  phaseId: number;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      disabled={isPending}
      onClick={() => startTransition(() => setCurrentPhase(planId, phaseId))}
    >
      Set as current phase
    </Button>
  );
}
