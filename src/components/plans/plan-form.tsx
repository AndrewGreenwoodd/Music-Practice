"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPlan, updatePlan } from "@/lib/actions/plans";
import type { Dictionary } from "@/i18n/dictionaries/en";

export function PlanForm({
  mode,
  planId,
  initialMarkdown = "",
  initialInstrumentName = "",
  dict,
}: {
  mode: "create" | "edit";
  planId?: number;
  initialMarkdown?: string;
  initialInstrumentName?: string;
  dict: Dictionary["plans"];
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [markdown, setMarkdown] = useState(initialMarkdown);
  const [instrumentName, setInstrumentName] = useState(initialInstrumentName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setMarkdown(String(reader.result ?? ""));
    reader.readAsText(file);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const result =
        mode === "create"
          ? await createPlan({ markdown, instrumentName })
          : planId
            ? await updatePlan(planId, { markdown, instrumentName })
            : undefined;

      if (result?.error) {
        setError(result.error);
        setIsSubmitting(false);
        return;
      }

      router.push("/plans");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-1">
        <Label htmlFor="instrumentName">{dict.instrumentLabel}</Label>
        <Input
          id="instrumentName"
          value={instrumentName}
          onChange={(e) => setInstrumentName(e.target.value)}
          placeholder={dict.instrumentPlaceholder}
          className="max-w-sm"
          required
        />
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="markdown">{dict.markdownLabel}</Label>
          <div className="flex items-center gap-2">
            <Label htmlFor="markdownFile" className="text-xs font-normal text-muted-foreground">
              {dict.fileUploadLabel}
            </Label>
            <input
              ref={fileInputRef}
              id="markdownFile"
              type="file"
              accept=".md,.markdown,text/markdown"
              onChange={handleFile}
              className="text-xs"
            />
          </div>
        </div>
        <Textarea
          id="markdown"
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          className="min-h-96 font-mono text-xs"
          required
        />
      </div>

      <details className="rounded-lg border border-border p-3 text-sm">
        <summary className="cursor-pointer font-medium">{dict.formatGuideTitle}</summary>
        <p className="mt-2 text-muted-foreground">{dict.formatGuideBody}</p>
        <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-3 text-xs whitespace-pre-wrap">
          {dict.formatGuideExample}
        </pre>
      </details>

      {mode === "edit" && (
        <p className="text-sm text-muted-foreground">{dict.editResetsProgressNote}</p>
      )}

      {error && (
        <p className="text-sm text-destructive">
          {dict.parseErrorPrefix} {error}
        </p>
      )}

      <div className="flex items-center gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? dict.saving : dict.save}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/plans")}>
          {dict.cancel}
        </Button>
      </div>
    </form>
  );
}
