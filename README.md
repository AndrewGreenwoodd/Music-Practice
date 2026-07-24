# Music Practice

A personal practice tracker for structured instrument-learning plans (guitar to start). Tracks a phased curriculum (technique / theory / applied / ear-training items per phase), lets you log practice sessions, and includes a note ear-training tool. Supports English and Ukrainian.

Local-only app: SQLite on disk, single machine, no external services required.

## Requirements

- Node.js 20+
- npm

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create your environment file**

   Create `.env.local` in the project root with the following variable:

   ```bash
   DATABASE_PATH=./data/musicpractice.db
   ```

   - `DATABASE_PATH` — where the SQLite file will live. The default above is fine; the directory is created automatically if it doesn't exist.

   There's no password or secret to configure — see "Signing in" below.

3. **Run database migrations**

   ```bash
   npm run db:migrate
   ```

4. **Seed the database**

   ```bash
   npm run db:seed
   ```

   This populates the guitar practice plan content (phases, categories, items, theory explanations in both languages). It's safe to re-run after editing `src/db/seed.ts` — it upserts content rather than deleting and recreating it, so it won't wipe your logged progress or sessions.

## Running the app

**Development** (hot reload):

```bash
npm run dev
```

**Production**:

```bash
npm run build
npm start
```

Either way, open [http://localhost:3000](http://localhost:3000).

## Signing in

This is a local, single-machine app with no real authentication — "signing in" just picks whose data you're looking at. Type any username at `/login`; if it doesn't exist yet, it's created on the spot, with its own isolated practice history, item progress, and plans. There's no password.

> Note: after any code change, a production server (`npm start`) needs a fresh `npm run build` — unlike `npm run dev`, it does not pick up changes automatically.

## Other useful scripts

| Command | Purpose |
|---|---|
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate a new Drizzle migration after changing `src/db/schema.ts` |
| `npm run db:migrate` | Apply pending migrations |
| `npm run db:studio` | Open Drizzle Studio to browse/edit the database directly |

## Tech stack

- Next.js (App Router) + TypeScript
- SQLite via Drizzle ORM (`better-sqlite3`)
- Username-only session via a plain cookie, no password/auth provider
- Tailwind CSS + shadcn/ui (Base UI primitives)
- Cookie-based i18n (English / Ukrainian)
