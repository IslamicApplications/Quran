/**
 * Reading plans: the 604 pages of the Madinah Mushaf divided over a number of days. The 30-day plan reads a juz a
 * day, as juz 2 to 30 begin on pages 22, 42, … 582 of this Mushaf; other plans divide the pages evenly. A day's
 * portion is done when the reader marks it read, so falling behind never skips any of it.
 */
import { useSyncExternalStore } from 'react';
import { getTodayDateString, toLocalDateString } from './storage';

export const MUSHAF_PAGE_COUNT = 604;
export const PLAN_LENGTHS = [7, 15, 30, 60, 120];

export interface ReadingPlan {
  days: number;
  startDate: string; // YYYY-MM-DD
  /** Days marked read, 1-based */
  done: number[];
}

export interface Portion {
  day: number;
  from: number;
  to: number;
}

/** First page of each juz in the Madinah Mushaf: page 1, then every 20 pages from page 22 */
const juzStart = (juz: number) => (juz === 1 ? 1 : 2 + (juz - 1) * 20);

/** The pages read on `day` of a plan of `days` days. */
export const portionOf = (days: number, day: number): Portion => {
  if (days === 30) return { day, from: juzStart(day), to: day === 30 ? MUSHAF_PAGE_COUNT : juzStart(day + 1) - 1 };
  const from = Math.floor(((day - 1) * MUSHAF_PAGE_COUNT) / days) + 1;
  const to = Math.floor((day * MUSHAF_PAGE_COUNT) / days);
  return { day, from, to };
};

/** Days since the plan began, counting the start day as day 1. */
const calendarDay = (plan: ReadingPlan, today = getTodayDateString()) => {
  const ms = new Date(`${today}T00:00:00`).getTime() - new Date(`${plan.startDate}T00:00:00`).getTime();
  // Rounded: a day that changes the clocks for daylight saving is 23 or 25 hours long
  return Math.round(ms / 86_400_000) + 1;
};

export interface PlanStatus {
  /** The first portion not yet read, or undefined when the plan is finished */
  next?: Portion;
  doneCount: number;
  /** Portions the calendar says should be read by now but are not */
  behind: number;
  finished: boolean;
}

export const planStatus = (plan: ReadingPlan, today?: string): PlanStatus => {
  const done = new Set(plan.done);
  let nextDay = 1;
  while (nextDay <= plan.days && done.has(nextDay)) nextDay++;
  const shouldHave = Math.min(plan.days, calendarDay(plan, today));
  return {
    next: nextDay <= plan.days ? portionOf(plan.days, nextDay) : undefined,
    doneCount: done.size,
    behind: Math.max(0, shouldHave - done.size - 1),
    finished: nextDay > plan.days
  };
};

// ---------- the plan, remembered on this device (and in the backup) ----------

export const PLAN_KEY = 'ayah_words_reading_plan_v1';

const load = (): ReadingPlan | null => {
  try {
    const raw = localStorage.getItem(PLAN_KEY);
    return raw ? (JSON.parse(raw) as ReadingPlan) : null;
  } catch {
    return null;
  }
};

let plan = load();
const listeners = new Set<() => void>();
const save = (next: ReadingPlan | null) => {
  plan = next;
  try {
    if (next) localStorage.setItem(PLAN_KEY, JSON.stringify(next));
    else localStorage.removeItem(PLAN_KEY);
  } catch {
    /* storage unavailable: keep the plan for this session */
  }
  listeners.forEach((l) => l());
};

export const readingPlanStore = {
  get: () => plan,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  start: (days: number) => save({ days, startDate: toLocalDateString(new Date()), done: [] }),
  markRead: (day: number) => plan && !plan.done.includes(day) && save({ ...plan, done: [...plan.done, day] }),
  stop: () => save(null),
  /** Re-read from storage after a backup import or data reset. */
  reload: () => {
    plan = load();
    listeners.forEach((l) => l());
  }
};

export const useReadingPlan = (): ReadingPlan | null => useSyncExternalStore(readingPlanStore.subscribe, readingPlanStore.get);
