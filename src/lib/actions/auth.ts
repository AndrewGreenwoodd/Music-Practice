"use server";

import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { SESSION_COOKIE_NAME } from "@/lib/session-cookie";

const usernameSchema = z
  .string()
  .trim()
  .min(1, "Username is required.")
  .max(40, "Username is too long.");

const COOKIE_OPTIONS = {
  path: "/",
  httpOnly: true,
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 365,
};

export async function loginAsUsername(username: string) {
  const parsedUsername = usernameSchema.parse(username);

  let user = await db.query.users.findFirst({
    where: eq(users.username, parsedUsername),
  });
  if (!user) {
    [user] = await db.insert(users).values({ username: parsedUsername }).returning();
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, user.id, COOKIE_OPTIONS);

  redirect("/practice");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);

  redirect("/login");
}
