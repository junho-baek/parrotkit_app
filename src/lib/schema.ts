import { pgTable, serial, varchar, timestamp, text } from 'drizzle-orm/pg-core';

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

export type User = typeof mvpUsers.$inferSelect;
export type NewUser = typeof mvpUsers.$inferInsert;
