'use server';

import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';
import { db, isMockMode } from '@/lib/db';
import {
  waitlist,
  waitlistResponses,
  insertWaitlistSchema,
  insertResponseSchema,
  type WaitlistInput,
  type ResponseInput,
} from '@/drizzle/schema';
import { computeScore } from '@/lib/scoring';

// ─────────────────────────────────────────────────────────────────
// Hero / Final-CTA email opt-in
// ─────────────────────────────────────────────────────────────────

export type HeroSignupResult =
  | { ok: true; alreadySignedUp: boolean }
  | { ok: false; error: 'invalid_email' | 'db_error' };

export async function signupForWaitlist(input: WaitlistInput): Promise<HeroSignupResult> {
  const parsed = insertWaitlistSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'invalid_email' };

  if (isMockMode) {
    // eslint-disable-next-line no-console
    console.log('[mock] signupForWaitlist', {
      email: parsed.data.email,
      locale: parsed.data.locale,
      variant: parsed.data.variant,
    });
    return { ok: true, alreadySignedUp: false };
  }

  const ua = headers().get('user-agent') ?? undefined;

  try {
    const existing = await db
      .select({ id: waitlist.id })
      .from(waitlist)
      .where(eq(waitlist.email, parsed.data.email))
      .limit(1);

    if (existing.length > 0) return { ok: true, alreadySignedUp: true };

    await db.insert(waitlist).values({
      email: parsed.data.email,
      locale: parsed.data.locale,
      country: parsed.data.country ?? null,
      referrer: parsed.data.referrer ?? null,
      utmSource: parsed.data.utmSource ?? null,
      utmMedium: parsed.data.utmMedium ?? null,
      utmCampaign: parsed.data.utmCampaign ?? null,
      utmContent: parsed.data.utmContent ?? null,
      userAgent: ua ?? null,
      variant: parsed.data.variant ?? 'a',
    });
    return { ok: true, alreadySignedUp: false };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[waitlist signup] db error:', err);
    return { ok: false, error: 'db_error' };
  }
}

// ─────────────────────────────────────────────────────────────────
// Thank-you page form submission
// ─────────────────────────────────────────────────────────────────

export type ResponseSubmitResult =
  | { ok: true; tier: 'green' | 'yellow' | 'red'; score: number }
  | { ok: false; error: 'invalid_input' | 'db_error' };

export async function submitWaitlistResponse(
  input: ResponseInput,
): Promise<ResponseSubmitResult> {
  const parsed = insertResponseSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'invalid_input' };

  const { score, tier } = computeScore({
    role: parsed.data.role,
    pain: parsed.data.pain,
    pastMethods: parsed.data.pastMethods,
    timeline: parsed.data.timeline,
    callIntent: parsed.data.callIntent,
  });

  if (isMockMode) {
    // eslint-disable-next-line no-console
    console.log('[mock] submitWaitlistResponse', {
      email: parsed.data.email,
      role: parsed.data.role,
      score,
      tier,
    });
    return { ok: true, tier, score };
  }

  try {
    await db.insert(waitlistResponses).values({
      email: parsed.data.email,
      role: parsed.data.role ?? null,
      sector: parsed.data.sector ?? null,
      pain: parsed.data.pain ?? null,
      pastMethods: parsed.data.pastMethods,
      timeline: parsed.data.timeline ?? null,
      callIntent: parsed.data.callIntent ?? null,
      score,
      tier,
    });
    return { ok: true, tier, score };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[waitlist response] db error:', err);
    return { ok: false, error: 'db_error' };
  }
}

// ─────────────────────────────────────────────────────────────────
// Public counter (Hero + Final CTA)
// ─────────────────────────────────────────────────────────────────

/**
 * Returns total waitlist count + distinct country count.
 * In mock mode returns zeros — the Hero/FinalCta components apply
 * a baseline (max(value, 25)) so the counter never shows "0".
 */
export async function getWaitlistCount(): Promise<{ total: number; countries: number }> {
  if (isMockMode) return { total: 0, countries: 0 };
  try {
    const rows = await db.select({ country: waitlist.country }).from(waitlist);
    const total = rows.length;
    const countries = new Set(rows.map((r) => r.country).filter(Boolean)).size;
    return { total, countries };
  } catch {
    return { total: 0, countries: 0 };
  }
}
