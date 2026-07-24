"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loginAsUsername } from "@/lib/actions/auth";
import type { Dictionary } from "@/i18n/dictionaries/en";

export function LoginForm({ dict }: { dict: Dictionary["login"] }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError(dict.usernameRequired);
      return;
    }
    setError(null);
    setIsSubmitting(true);
    await loginAsUsername(username);
  };

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{dict.title}</CardTitle>
          <CardDescription>{dict.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">{dict.username}</Label>
              <Input
                id="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? dict.signingIn : dict.signIn}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
