-- Practice session history should survive deletion of the plan/items it referenced.
-- Add a title snapshot so a session-item row remains readable even after its item is gone,
-- and change item_id from ON DELETE CASCADE to ON DELETE SET NULL so the row itself
-- (and its snapshot) survives instead of being cascade-deleted along with the item.
--
-- item_id carries a live FOREIGN KEY constraint, and SQLite refuses a plain
-- ALTER TABLE ... DROP COLUMN against a column that's part of one, so this uses
-- the standard SQLite table-rebuild procedure instead of the ADD/DROP trick used
-- in 0006 (which only worked there because that FK had already been silently
-- dropped by an earlier migration).
PRAGMA foreign_keys=OFF;--> statement-breakpoint

CREATE TABLE `practice_session_items_new` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session_id` integer NOT NULL,
	`item_id` integer,
	`item_title` text,
	`item_title_uk` text,
	`note` text,
	FOREIGN KEY (`session_id`) REFERENCES `practice_sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON UPDATE no action ON DELETE set null
);--> statement-breakpoint

INSERT INTO `practice_session_items_new` (`id`, `session_id`, `item_id`, `item_title`, `item_title_uk`, `note`)
SELECT
	`practice_session_items`.`id`,
	`practice_session_items`.`session_id`,
	`practice_session_items`.`item_id`,
	`items`.`title`,
	`items`.`title_uk`,
	`practice_session_items`.`note`
FROM `practice_session_items`
LEFT JOIN `items` ON `items`.`id` = `practice_session_items`.`item_id`;--> statement-breakpoint

DROP TABLE `practice_session_items`;--> statement-breakpoint
ALTER TABLE `practice_session_items_new` RENAME TO `practice_session_items`;--> statement-breakpoint

PRAGMA foreign_keys=ON;
