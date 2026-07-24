"use client";

import { Button } from "@/components/ui/button";
import { logout } from "@/lib/actions/auth";

export function SignOutButton({ label }: { label: string }) {
  return (
    <Button variant="outline" size="sm" onClick={() => logout()}>
      {label}
    </Button>
  );
}
