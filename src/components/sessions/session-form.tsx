"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { createSession } from "@/lib/actions/sessions";

type PhaseWithItems = {
  phase: { id: number; title: string; isOngoing: boolean };
  categories: { id: number; name: string; items: { id: number; title: string }[] }[];
};

export function SessionForm({
  phases,
  currentPhaseId,
}: {
  phases: PhaseWithItems[];
  currentPhaseId: number | null;
}) {
  const [date, setDate] = useState<Date>(new Date());
  const [duration, setDuration] = useState("30");
  const [selectedItemIds, setSelectedItemIds] = useState<Set<number>>(new Set());
  const [win, setWin] = useState("");
  const [struggle, setStruggle] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultTab = String(
    phases.find((p) => p.phase.id === currentPhaseId)?.phase.id ?? phases[0]?.phase.id ?? "",
  );

  const toggleItem = (id: number) => {
    setSelectedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const durationNum = Number(duration);
    if (!durationNum || durationNum <= 0) {
      setError("Enter a valid duration in minutes.");
      return;
    }
    setIsSubmitting(true);
    await createSession({
      date: format(date, "yyyy-MM-dd"),
      durationMinutes: durationNum,
      itemIds: Array.from(selectedItemIds),
      win: win || undefined,
      struggle: struggle || undefined,
      notes: notes || undefined,
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <div className="space-y-1">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger
              render={
                <Button type="button" variant="outline" className="w-40 justify-start">
                  <CalendarIcon className="mr-2 size-4" />
                  {format(date, "MMM d, yyyy")}
                </Button>
              }
            />
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-1">
          <Label htmlFor="duration">Duration (min)</Label>
          <Input
            id="duration"
            type="number"
            className="w-32"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Items covered</Label>
        <Tabs defaultValue={defaultTab}>
          <TabsList>
            {phases.map((p) => (
              <TabsTrigger key={p.phase.id} value={String(p.phase.id)}>
                {p.phase.isOngoing ? "Habits" : p.phase.title}
              </TabsTrigger>
            ))}
          </TabsList>
          {phases.map((p) => (
            <TabsContent key={p.phase.id} value={String(p.phase.id)} className="space-y-4 pt-2">
              {p.categories.map((category) => (
                <div key={category.id} className="space-y-2">
                  <p className="text-sm font-medium">{category.name}</p>
                  <div className="space-y-1.5 pl-1">
                    {category.items.map((item) => (
                      <label key={item.id} className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={selectedItemIds.has(item.id)}
                          onCheckedChange={() => toggleItem(item.id)}
                        />
                        {item.title}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="win">One win</Label>
          <Textarea id="win" value={win} onChange={(e) => setWin(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="struggle">One struggle</Label>
          <Textarea
            id="struggle"
            value={struggle}
            onChange={(e) => setStruggle(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Log session"}
      </Button>
    </form>
  );
}
