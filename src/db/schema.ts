import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  sqliteTable,
  text,
  unique,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const instruments = sqliteTable("instruments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  nameUk: text("name_uk"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const plans = sqliteTable("plans", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  instrumentId: integer("instrument_id")
    .notNull()
    .references(() => instruments.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  titleUk: text("title_uk"),
  description: text("description"),
  descriptionUk: text("description_uk"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const phases = sqliteTable(
  "phases",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    planId: integer("plan_id")
      .notNull()
      .references(() => plans.id, { onDelete: "cascade" }),
    orderIndex: integer("order_index").notNull(),
    isOngoing: integer("is_ongoing", { mode: "boolean" })
      .notNull()
      .default(false),
    title: text("title").notNull(),
    titleUk: text("title_uk"),
    goal: text("goal").notNull(),
    goalUk: text("goal_uk"),
    durationLabel: text("duration_label"),
  },
  (table) => [unique().on(table.planId, table.orderIndex)],
);

export const milestones = sqliteTable("milestones", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  phaseId: integer("phase_id")
    .notNull()
    .unique()
    .references(() => phases.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
});

export const categories = sqliteTable(
  "categories",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    phaseId: integer("phase_id")
      .notNull()
      .references(() => phases.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    nameUk: text("name_uk"),
    orderIndex: integer("order_index").notNull(),
    dailyMinMinutes: integer("daily_min_minutes"),
    dailyMaxMinutes: integer("daily_max_minutes"),
  },
  (table) => [unique().on(table.phaseId, table.slug)],
);

export const items = sqliteTable(
  "items",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    titleUk: text("title_uk"),
    description: text("description"),
    descriptionUk: text("description_uk"),
    longDescription: text("long_description"),
    longDescriptionUk: text("long_description_uk"),
    orderIndex: integer("order_index").notNull(),
  },
  (table) => [unique().on(table.categoryId, table.title)],
);

export const userPlanProgress = sqliteTable(
  "user_plan_progress",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    planId: integer("plan_id")
      .notNull()
      .references(() => plans.id, { onDelete: "cascade" }),
    currentPhaseId: integer("current_phase_id").references(() => phases.id, {
      onDelete: "set null",
    }),
    startedAt: integer("started_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [unique().on(table.userId, table.planId)],
);

export const practiceSessions = sqliteTable("practice_sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  date: text("date").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  win: text("win"),
  struggle: text("struggle"),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const practiceSessionItems = sqliteTable("practice_session_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sessionId: integer("session_id")
    .notNull()
    .references(() => practiceSessions.id, { onDelete: "cascade" }),
  itemId: integer("item_id")
    .notNull()
    .references(() => items.id, { onDelete: "cascade" }),
  note: text("note"),
});

export const itemProgress = sqliteTable(
  "item_progress",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    itemId: integer("item_id")
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),
    status: text("status", {
      enum: ["not_started", "in_progress", "done"],
    })
      .notNull()
      .default("not_started"),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [unique().on(table.userId, table.itemId)],
);

export const earTrainingRounds = sqliteTable(
  "ear_training_rounds",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    mode: text("mode", { enum: ["note", "scale_degree"] }).notNull(),
    scaleRoot: text("scale_root"),
    promptNote: text("prompt_note").notNull(),
    correctAnswer: text("correct_answer").notNull(),
    userAnswer: text("user_answer").notNull(),
    isCorrect: integer("is_correct", { mode: "boolean" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [
    index("ear_training_rounds_user_created_idx").on(table.userId, table.createdAt),
  ],
);

export const usersRelations = relations(users, ({ many }) => ({
  planProgress: many(userPlanProgress),
  practiceSessions: many(practiceSessions),
  itemProgress: many(itemProgress),
  earTrainingRounds: many(earTrainingRounds),
}));

export const earTrainingRoundsRelations = relations(earTrainingRounds, ({ one }) => ({
  user: one(users, { fields: [earTrainingRounds.userId], references: [users.id] }),
}));

export const instrumentsRelations = relations(instruments, ({ many }) => ({
  plans: many(plans),
}));

export const plansRelations = relations(plans, ({ one, many }) => ({
  instrument: one(instruments, {
    fields: [plans.instrumentId],
    references: [instruments.id],
  }),
  phases: many(phases),
  userProgress: many(userPlanProgress),
}));

export const phasesRelations = relations(phases, ({ one, many }) => ({
  plan: one(plans, { fields: [phases.planId], references: [plans.id] }),
  milestone: one(milestones, {
    fields: [phases.id],
    references: [milestones.phaseId],
  }),
  categories: many(categories),
}));

export const milestonesRelations = relations(milestones, ({ one }) => ({
  phase: one(phases, { fields: [milestones.phaseId], references: [phases.id] }),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  phase: one(phases, { fields: [categories.phaseId], references: [phases.id] }),
  items: many(items),
}));

export const itemsRelations = relations(items, ({ one, many }) => ({
  category: one(categories, {
    fields: [items.categoryId],
    references: [categories.id],
  }),
  sessionLinks: many(practiceSessionItems),
  progress: many(itemProgress),
}));

export const userPlanProgressRelations = relations(userPlanProgress, ({ one }) => ({
  user: one(users, { fields: [userPlanProgress.userId], references: [users.id] }),
  plan: one(plans, { fields: [userPlanProgress.planId], references: [plans.id] }),
  currentPhase: one(phases, {
    fields: [userPlanProgress.currentPhaseId],
    references: [phases.id],
  }),
}));

export const practiceSessionsRelations = relations(
  practiceSessions,
  ({ one, many }) => ({
    user: one(users, {
      fields: [practiceSessions.userId],
      references: [users.id],
    }),
    items: many(practiceSessionItems),
  }),
);

export const practiceSessionItemsRelations = relations(
  practiceSessionItems,
  ({ one }) => ({
    session: one(practiceSessions, {
      fields: [practiceSessionItems.sessionId],
      references: [practiceSessions.id],
    }),
    item: one(items, {
      fields: [practiceSessionItems.itemId],
      references: [items.id],
    }),
  }),
);

export const itemProgressRelations = relations(itemProgress, ({ one }) => ({
  user: one(users, { fields: [itemProgress.userId], references: [users.id] }),
  item: one(items, { fields: [itemProgress.itemId], references: [items.id] }),
}));
