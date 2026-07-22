CREATE TABLE `ear_training_rounds` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`mode` text NOT NULL,
	`scale_root` text,
	`prompt_note` text NOT NULL,
	`correct_answer` text NOT NULL,
	`user_answer` text NOT NULL,
	`is_correct` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `ear_training_rounds_user_created_idx` ON `ear_training_rounds` (`user_id`,`created_at`);