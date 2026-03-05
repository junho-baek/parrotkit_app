CREATE TABLE IF NOT EXISTS "event_logs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"event_name" text NOT NULL,
	"page" text,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"username" text NOT NULL,
	"interests" text[] DEFAULT '{}'::text[] NOT NULL,
	"onboarding_completed" boolean DEFAULT false NOT NULL,
	"subscription_id" text,
	"subscription_status" text DEFAULT 'free' NOT NULL,
	"plan_type" text DEFAULT 'free' NOT NULL,
	"subscription_ends_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_email_unique" UNIQUE("email"),
	CONSTRAINT "profiles_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recipe_captures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipe_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"scene_id" integer NOT NULL,
	"storage_path" text NOT NULL,
	"mime_type" text,
	"size_bytes" bigint,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recipes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"reference_id" uuid,
	"video_url" text NOT NULL,
	"scenes" jsonb NOT NULL,
	"total_scenes" integer DEFAULT 0 NOT NULL,
	"captured_scene_ids" integer[] DEFAULT '{}'::integer[] NOT NULL,
	"match_results" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"captured_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "references" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"source_url" text NOT NULL,
	"platform" text,
	"video_id" text,
	"niche" text,
	"goal" text,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_event_logs_created_at" ON "event_logs" ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "recipe_captures_recipe_scene_key" ON "recipe_captures" ("recipe_id","scene_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_recipe_captures_user_created_at" ON "recipe_captures" ("user_id","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_recipes_user_created_at" ON "recipes" ("user_id","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_references_user_created_at" ON "references" ("user_id","created_at");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_logs" ADD CONSTRAINT "event_logs_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recipe_captures" ADD CONSTRAINT "recipe_captures_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recipe_captures" ADD CONSTRAINT "recipe_captures_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recipes" ADD CONSTRAINT "recipes_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recipes" ADD CONSTRAINT "recipes_reference_id_references_id_fk" FOREIGN KEY ("reference_id") REFERENCES "references"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "references" ADD CONSTRAINT "references_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
