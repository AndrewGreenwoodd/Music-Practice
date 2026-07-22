"use client";

import { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setCurrentPhase } from "@/lib/actions/progress";

export function PhaseSelector({
  planId,
  currentPhaseId,
  phases,
}: {
  planId: number;
  currentPhaseId: number;
  phases: { id: number; title: string }[];
}) {
  const [isPending, startTransition] = useTransition();
  const titleById = new Map(phases.map((p) => [String(p.id), p.title]));

  return (
    <Select
      value={String(currentPhaseId)}
      disabled={isPending}
      onValueChange={(value) => {
        if (value) startTransition(() => setCurrentPhase(planId, Number(value)));
      }}
    >
      <SelectTrigger className="min-w-64 max-w-full">
        <SelectValue>{(value: string) => titleById.get(value) ?? value}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {phases.map((phase) => (
          <SelectItem key={phase.id} value={String(phase.id)}>
            {phase.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
