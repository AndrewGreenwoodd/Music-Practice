"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addBpmLog } from "@/lib/actions/bpm";

const formSchema = z.object({
  bpm: z
    .string()
    .regex(/^\d+$/, "Enter a whole number")
    .refine((v) => Number(v) > 0 && Number(v) <= 400, "1-400"),
  note: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function BpmLogForm({ itemId }: { itemId: number }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      await addBpmLog({ itemId, bpm: Number(values.bpm), note: values.note });
      toast.success(`Logged ${values.bpm} BPM`);
      reset();
    } catch {
      toast.error("Failed to log BPM");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap items-end gap-3">
      <div className="space-y-1">
        <Label htmlFor="bpm">BPM</Label>
        <Input id="bpm" type="number" className="w-24" {...register("bpm")} />
        {errors.bpm && <p className="text-xs text-destructive">{errors.bpm.message}</p>}
      </div>
      <div className="min-w-40 flex-1 space-y-1">
        <Label htmlFor="note">Note (optional)</Label>
        <Input id="note" {...register("note")} />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Logging..." : "Log BPM"}
      </Button>
    </form>
  );
}
