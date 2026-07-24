-- Migration 0005 added these two columns via ALTER TABLE ADD COLUMN, which
-- silently dropped the ON DELETE action from the foreign key (a drizzle-kit
-- gap for this operation, not a SQLite limitation -- SQLite supports ON
-- DELETE on ADD COLUMN just fine). Without it, deleting a plan that's set as
-- someone's active plan fails with "FOREIGN KEY constraint failed" instead of
-- clearing users.active_plan_id, and deleting a user would fail the same way
-- against plans.owner_id instead of cascading.
-- Preserve existing values across the drop/re-add (DROP COLUMN discards data).
ALTER TABLE `users` ADD `active_plan_id_tmp` integer;--> statement-breakpoint
UPDATE `users` SET `active_plan_id_tmp` = `active_plan_id`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `active_plan_id`;--> statement-breakpoint
ALTER TABLE `users` ADD `active_plan_id` integer REFERENCES plans(id) ON DELETE SET NULL;--> statement-breakpoint
UPDATE `users` SET `active_plan_id` = `active_plan_id_tmp`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `active_plan_id_tmp`;--> statement-breakpoint

ALTER TABLE `plans` ADD `owner_id_tmp` text;--> statement-breakpoint
UPDATE `plans` SET `owner_id_tmp` = `owner_id`;--> statement-breakpoint
ALTER TABLE `plans` DROP COLUMN `owner_id`;--> statement-breakpoint
ALTER TABLE `plans` ADD `owner_id` text REFERENCES users(id) ON DELETE CASCADE;--> statement-breakpoint
UPDATE `plans` SET `owner_id` = `owner_id_tmp`;--> statement-breakpoint
ALTER TABLE `plans` DROP COLUMN `owner_id_tmp`;