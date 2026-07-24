-- Replaces email + password_hash with a single unique `username` column.
-- SQLite's ALTER TABLE can't add a NOT NULL UNIQUE column derived from
-- existing data in one step, so this rebuilds the table (official SQLite
-- "recreate" procedure). Existing `id` values are preserved untouched, so
-- every other table's `... REFERENCES users(id)` (practice_sessions,
-- item_progress, ear_training_rounds, user_plan_progress, plans.owner_id)
-- stays valid with no changes needed on their side.
PRAGMA foreign_keys=OFF;--> statement-breakpoint

CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`name` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`active_plan_id` integer REFERENCES plans(id) ON DELETE SET NULL
);--> statement-breakpoint

INSERT INTO `__new_users` (`id`, `username`, `name`, `created_at`, `active_plan_id`)
SELECT `id`, substr(`email`, 1, instr(`email`, '@') - 1), `name`, `created_at`, `active_plan_id`
FROM `users`;--> statement-breakpoint

DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint

PRAGMA foreign_keys=ON;