import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { SESSION_COOKIE_NAME } from "@/lib/session-cookie";

export async function auth() {
  const cookieStore = await cookies();
  const userId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!userId) return null;

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  if (!user) return null;

  return { user: { id: user.id, username: user.username } };
}
