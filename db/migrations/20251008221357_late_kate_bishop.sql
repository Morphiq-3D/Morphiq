ALTER TABLE "addresses" ALTER COLUMN "floor" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "addresses" ALTER COLUMN "apartment" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "addresses" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_at" timestamp;