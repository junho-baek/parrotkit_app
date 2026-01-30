CREATE TABLE IF NOT EXISTS "mvp_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"username" varchar(100) NOT NULL,
	"password" varchar(255) NOT NULL,
	"interests" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"subscription_id" varchar(255),
	"subscription_status" varchar(50) DEFAULT 'free',
	"plan_type" varchar(20) DEFAULT 'free',
	"subscription_ends_at" timestamp,
	CONSTRAINT "mvp_users_email_unique" UNIQUE("email"),
	CONSTRAINT "mvp_users_username_unique" UNIQUE("username")
);
