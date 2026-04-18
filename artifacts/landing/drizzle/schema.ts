import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  jsonb,
  varchar,
  index,
} from 'drizzle-orm/pg-core';
import { z } from 'zod';

/**
 * waitlist — primary opt-in capture from the hero CTA.
 * Captures email + minimal demographic + UTM at the moment of signup.
 */
export const waitlist = pgTable(
  'waitlist',
  {
    id: serial('id').primaryKey(),
    email: text('email').notNull().unique(),
    locale: varchar('locale', { length: 4 }).notNull().default('es'),
    country: text('country'),
    referrer: text('referrer'),
    utmSource: text('utm_source'),
    utmMedium: text('utm_medium'),
    utmCampaign: text('utm_campaign'),
    utmContent: text('utm_content'),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: index('waitlist_email_idx').on(table.email),
    createdAtIdx: index('waitlist_created_at_idx').on(table.createdAt),
  }),
);

/**
 * waitlist_responses — thank-you page survey responses.
 * Linked to waitlist via email (not foreign key) so users may complete
 * the form later from a different session.
 */
export const waitlistResponses = pgTable(
  'waitlist_responses',
  {
    id: serial('id').primaryKey(),
    email: text('email').notNull(),
    role: text('role'),
    sector: text('sector'),
    pain: text('pain'),
    pastMethods: jsonb('past_methods').$type<string[]>().default([]),
    timeline: text('timeline'),
    callIntent: text('call_intent'),
    score: integer('score').notNull().default(0),
    tier: varchar('tier', { length: 16 }).notNull().default('yellow'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: index('responses_email_idx').on(table.email),
    tierIdx: index('responses_tier_idx').on(table.tier),
    scoreIdx: index('responses_score_idx').on(table.score),
  }),
);

// ─── Zod validators (hand-rolled — avoids drizzle-zod version drift) ───────

export const localeSchema = z.enum(['es', 'en']);

export const insertWaitlistSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  locale: localeSchema,
  country: z.string().optional(),
  referrer: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmContent: z.string().optional(),
  userAgent: z.string().optional(),
});

export const roleEnum = z.enum([
  'hseq_manager',
  'env_engineer',
  'remediation_pm',
  'sustainability_director',
  'env_consultant',
  'researcher',
  'founder',
  'other',
]);

export const sectorEnum = z.enum([
  'oil_gas',
  'chemicals',
  'mining',
  'water_utilities',
  'manufacturing',
  'agriculture',
  'textile',
  'defense',
  'consulting',
  'government',
  'academia',
  'other',
]);

export const timelineEnum = z.enum([
  'this_week',
  'three_months',
  'six_to_twelve',
  'next_year',
  'no_timeline',
]);

export const callIntentEnum = z.enum([
  'yes_now',
  'yes_next_week',
  'keep_posted',
  'wait_early_access',
]);

export const insertResponseSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  role: roleEnum.optional(),
  sector: sectorEnum.optional(),
  pain: z.string().min(1).max(500).optional(),
  pastMethods: z.array(z.string()).default([]),
  timeline: timelineEnum.optional(),
  callIntent: callIntentEnum.optional(),
});

export type Role = z.infer<typeof roleEnum>;
export type Sector = z.infer<typeof sectorEnum>;
export type Timeline = z.infer<typeof timelineEnum>;
export type CallIntent = z.infer<typeof callIntentEnum>;
export type WaitlistInput = z.infer<typeof insertWaitlistSchema>;
export type ResponseInput = z.infer<typeof insertResponseSchema>;

export type WaitlistRow = typeof waitlist.$inferSelect;
export type ResponseRow = typeof waitlistResponses.$inferSelect;
