import { sql } from 'drizzle-orm';
import {
  bigserial,
  bigint,
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue | undefined }
  | JsonValue[];

export const mvpUsers = pgTable('mvp_users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  interests: text('interests').array(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  
  // Subscription fields
  subscriptionId: varchar('subscription_id', { length: 255 }),
  subscriptionStatus: varchar('subscription_status', { length: 50 }).default('free'),
  planType: varchar('plan_type', { length: 20 }).default('free'),
  subscriptionEndsAt: timestamp('subscription_ends_at'),
});

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
  username: text('username').notNull().unique(),
  interests: text('interests').array().notNull().default(sql`'{}'::text[]`),
  onboardingCompleted: boolean('onboarding_completed').notNull().default(false),
  subscriptionId: text('subscription_id'),
  subscriptionStatus: text('subscription_status').notNull().default('free'),
  planType: text('plan_type').notNull().default('free'),
  subscriptionEndsAt: timestamp('subscription_ends_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const references = pgTable(
  'references',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    sourceUrl: text('source_url').notNull(),
    platform: text('platform'),
    videoId: text('video_id'),
    niche: text('niche'),
    goal: text('goal'),
    description: text('description'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userCreatedIdx: index('idx_references_user_created_at').on(table.userId, table.createdAt),
  })
);

export const recipes = pgTable(
  'recipes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    referenceId: uuid('reference_id').references(() => references.id, {
      onDelete: 'set null',
    }),
    videoUrl: text('video_url').notNull(),
    scenes: jsonb('scenes').$type<JsonValue>().notNull(),
    totalScenes: integer('total_scenes').notNull().default(0),
    capturedSceneIds: integer('captured_scene_ids')
      .array()
      .notNull()
      .default(sql`'{}'::integer[]`),
    matchResults: jsonb('match_results').$type<JsonValue>().notNull().default(sql`'{}'::jsonb`),
    capturedCount: integer('captured_count').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userCreatedIdx: index('idx_recipes_user_created_at').on(table.userId, table.createdAt),
  })
);

export const recipeCaptures = pgTable(
  'recipe_captures',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    recipeId: uuid('recipe_id')
      .notNull()
      .references(() => recipes.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    sceneId: integer('scene_id').notNull(),
    storagePath: text('storage_path').notNull(),
    mimeType: text('mime_type'),
    sizeBytes: bigint('size_bytes', { mode: 'number' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    recipeSceneUnique: uniqueIndex('recipe_captures_recipe_scene_key').on(
      table.recipeId,
      table.sceneId
    ),
    userCreatedIdx: index('idx_recipe_captures_user_created_at').on(table.userId, table.createdAt),
  })
);

export const eventLogs = pgTable(
  'event_logs',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    userId: uuid('user_id').references(() => profiles.id, { onDelete: 'set null' }),
    eventName: text('event_name').notNull(),
    page: text('page'),
    payload: jsonb('payload').$type<JsonValue>().notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    createdIdx: index('idx_event_logs_created_at').on(table.createdAt),
  })
);

export type User = typeof mvpUsers.$inferSelect;
export type NewUser = typeof mvpUsers.$inferInsert;
