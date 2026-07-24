ALTER TABLE `plans` ADD `owner_id` text REFERENCES users(id);--> statement-breakpoint
ALTER TABLE `plans` ADD `source_markdown` text;--> statement-breakpoint
ALTER TABLE `users` ADD `active_plan_id` integer REFERENCES plans(id);