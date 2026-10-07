import { describe, expect, it } from 'vitest';
import { planStatus, portionOf, MUSHAF_PAGE_COUNT, PLAN_LENGTHS } from './readingPlan';

describe('reading plan portions', () => {
  it('reads a juz a day on the 30-day plan', () => {
    expect(portionOf(30, 1)).toEqual({ day: 1, from: 1, to: 21 });
    expect(portionOf(30, 2)).toEqual({ day: 2, from: 22, to: 41 });
    expect(portionOf(30, 30)).toEqual({ day: 30, from: 582, to: 604 });
  });

  it('covers every page exactly once on every plan', () => {
    for (const days of PLAN_LENGTHS) {
      let expected = 1;
      for (let d = 1; d <= days; d++) {
        const p = portionOf(days, d);
        expect(p.from).toBe(expected);
        expect(p.to).toBeGreaterThanOrEqual(p.from);
        expected = p.to + 1;
      }
      expect(expected - 1).toBe(MUSHAF_PAGE_COUNT);
    }
  });
});

describe('plan status', () => {
  it('offers the first unread day, and counts days fallen behind', () => {
    const plan = { days: 30, startDate: '2026-10-01', done: [1, 2] };
    const status = planStatus(plan, '2026-10-06'); // day 6: days 1–5 should be read
    expect(status.next?.day).toBe(3);
    expect(status.behind).toBe(3);
    expect(status.finished).toBe(false);
  });

  it('is finished once every day is read', () => {
    const plan = { days: 7, startDate: '2026-10-01', done: [1, 2, 3, 4, 5, 6, 7] };
    expect(planStatus(plan, '2026-10-20')).toMatchObject({ finished: true, next: undefined, behind: 0 });
  });
});
