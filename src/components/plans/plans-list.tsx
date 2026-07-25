"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlanActions } from "@/components/plans/plan-actions";
import type { Dictionary } from "@/i18n/dictionaries/en";

type PlanRow = {
  id: number;
  title: string;
  description: string | null;
  instrumentSlug: string;
  instrumentName: string;
  isOwnedByUser: boolean;
  isActive: boolean;
};

const ALL_INSTRUMENTS = "all";

export function PlansList({ plans, dict }: { plans: PlanRow[]; dict: Dictionary["plans"] }) {
  const instruments = useMemo(() => {
    const map = new Map<string, string>();
    for (const plan of plans) map.set(plan.instrumentSlug, plan.instrumentName);
    return Array.from(map, ([slug, name]) => ({ slug, name })).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [plans]);

  const [instrument, setInstrument] = useState(ALL_INSTRUMENTS);

  const visiblePlans =
    instrument === ALL_INSTRUMENTS
      ? plans
      : plans.filter((plan) => plan.instrumentSlug === instrument);

  return (
    <div className="space-y-4">
      {instruments.length > 1 && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{dict.filterByInstrument}</span>
          <Select
            value={instrument}
            onValueChange={(value) => {
              if (value) setInstrument(value as string);
            }}
          >
            <SelectTrigger>
              <SelectValue>
                {(value: string) =>
                  value === ALL_INSTRUMENTS
                    ? dict.allInstruments
                    : (instruments.find((i) => i.slug === value)?.name ?? value)
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_INSTRUMENTS}>{dict.allInstruments}</SelectItem>
              {instruments.map(({ slug, name }) => (
                <SelectItem key={slug} value={slug}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {visiblePlans.length === 0 ? (
        <p className="text-muted-foreground">{dict.noPlans}</p>
      ) : (
        <div className="space-y-3">
          {visiblePlans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle>{plan.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{plan.instrumentName}</p>
                  </div>
                  <PlanActions
                    planId={plan.id}
                    isActive={plan.isActive}
                    isOwnedByUser={plan.isOwnedByUser}
                    dict={dict}
                  />
                </div>
              </CardHeader>
              {plan.description && (
                <CardContent>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
