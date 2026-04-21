import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  jsonb,
  varchar,
  boolean,
  real,
  uniqueIndex,
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
    variant: varchar('variant', { length: 4 }).notNull().default('a'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: index('waitlist_email_idx').on(table.email),
    createdAtIdx: index('waitlist_created_at_idx').on(table.createdAt),
    variantIdx: index('waitlist_variant_idx').on(table.variant),
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
export const variantSchema = z.enum(['a', 'b']);

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
  variant: variantSchema.optional(),
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

// ─── Reddit / multi-agent research pipeline ──────────────────────────────
// Feeds the Escucha Activa panel in the Streamlit portal, plus the daily
// /api/insights endpoint that powers build-in-public posts.

/**
 * reddit_posts — raw posts fetched from Apify (trudax/reddit-scraper).
 * Deduplicated by (subreddit, postId).
 */
export const redditPosts = pgTable(
  'reddit_posts',
  {
    id: serial('id').primaryKey(),
    postId: text('post_id').notNull(),
    subreddit: text('subreddit').notNull(),
    title: text('title').notNull(),
    body: text('body'),
    author: text('author'),
    url: text('url').notNull(),
    upvotes: integer('upvotes').default(0),
    numComments: integer('num_comments').default(0),
    postedAt: timestamp('posted_at', { withTimezone: true }),
    fetchedAt: timestamp('fetched_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    uniq: uniqueIndex('reddit_posts_uniq').on(t.subreddit, t.postId),
    subIdx: index('reddit_posts_sub_idx').on(t.subreddit),
    fetchedIdx: index('reddit_posts_fetched_idx').on(t.fetchedAt),
  }),
);

/**
 * reddit_classifications — per-post tags from the Classifier Agent (Haiku).
 * One-to-one with reddit_posts via postRef.
 */
export const redditClassifications = pgTable(
  'reddit_classifications',
  {
    id: serial('id').primaryKey(),
    postRef: integer('post_ref')
      .notNull()
      .references(() => redditPosts.id, { onDelete: 'cascade' }),
    contaminantType: text('contaminant_type'), // e.g. "hydrocarbons" | "pfas" | "plastics" | "soil_ag" | "mining" | "water_treatment" | "none"
    region: text('region'), // "USA" | "LATAM" | "EU" | "APAC" | "global"
    severity: integer('severity').default(0), // 1-5
    painIntensity: integer('pain_intensity').default(0), // 1-5
    avatarMatch: text('avatar_match'), // "remediation_pm_usa" | "hseq_latam" | "compliance_eu" | "apac" | "none"
    bannedPhraseHits: jsonb('banned_phrase_hits').$type<string[]>().default([]),
    classifierModel: text('classifier_model'),
    classifiedAt: timestamp('classified_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    uniq: uniqueIndex('reddit_classifications_uniq').on(t.postRef),
    avatarIdx: index('reddit_classifications_avatar_idx').on(t.avatarMatch),
    painIdx: index('reddit_classifications_pain_idx').on(t.painIntensity),
  }),
);

/**
 * pain_synthesis — weekly roll-up from the Pain Synthesizer Agent (Sonnet).
 * Each row is a snapshot of the top N themes for a given week.
 */
export const painSynthesis = pgTable(
  'pain_synthesis',
  {
    id: serial('id').primaryKey(),
    windowStart: timestamp('window_start', { withTimezone: true }).notNull(),
    windowEnd: timestamp('window_end', { withTimezone: true }).notNull(),
    themes: jsonb('themes')
      .$type<
        Array<{
          theme: string;
          avatarMatch: string;
          quoteCount: number;
          topQuotes: Array<{ quote: string; url: string; subreddit: string }>;
        }>
      >()
      .notNull()
      .default([]),
    sourcePostsCount: integer('source_posts_count').default(0),
    synthesizerModel: text('synthesizer_model'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    windowIdx: index('pain_synthesis_window_idx').on(t.windowEnd),
  }),
);

/**
 * competitor_mentions — detected references to competitors
 * (Carbios, Novozymes, Veolia, AECOM, Genomatica, Pivot Bio, Aquatech…).
 */
export const competitorMentions = pgTable(
  'competitor_mentions',
  {
    id: serial('id').primaryKey(),
    postRef: integer('post_ref')
      .notNull()
      .references(() => redditPosts.id, { onDelete: 'cascade' }),
    competitor: text('competitor').notNull(),
    context: text('context'),
    sentiment: real('sentiment'), // -1..1
    detectedAt: timestamp('detected_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    compIdx: index('competitor_mentions_comp_idx').on(t.competitor),
  }),
);

/**
 * agent_drafts — human-approval queue for the Pitch Feeder Agent.
 * Drafts include slide quotes, tweet drafts, newsletter snippets.
 * Never auto-posted; humans review, set `approved=true`, then publish.
 */
export const agentDrafts = pgTable(
  'agent_drafts',
  {
    id: serial('id').primaryKey(),
    kind: text('kind').notNull(), // "slide_quote" | "tweet" | "newsletter"
    content: text('content').notNull(),
    sources: jsonb('sources').$type<string[]>().default([]),
    bannedPhraseHits: jsonb('banned_phrase_hits').$type<string[]>().default([]),
    approved: boolean('approved').default(false),
    rejected: boolean('rejected').default(false),
    reviewerNotes: text('reviewer_notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    kindIdx: index('agent_drafts_kind_idx').on(t.kind),
    approvedIdx: index('agent_drafts_approved_idx').on(t.approved),
  }),
);

export type RedditPostRow = typeof redditPosts.$inferSelect;
export type RedditClassificationRow = typeof redditClassifications.$inferSelect;
export type PainSynthesisRow = typeof painSynthesis.$inferSelect;
export type CompetitorMentionRow = typeof competitorMentions.$inferSelect;
export type AgentDraftRow = typeof agentDrafts.$inferSelect;
