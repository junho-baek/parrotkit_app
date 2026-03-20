ALTER TABLE "recipes" ADD COLUMN "analysis_metadata" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "script_source" text DEFAULT 'default' NOT NULL;--> statement-breakpoint
ALTER TABLE "references" ADD COLUMN "transcript" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "references" ADD COLUMN "transcript_source" text DEFAULT 'none' NOT NULL;--> statement-breakpoint
ALTER TABLE "references" ADD COLUMN "transcript_language" text;--> statement-breakpoint
ALTER TABLE "references" ADD COLUMN "source_metadata" jsonb DEFAULT '{}'::jsonb NOT NULL;