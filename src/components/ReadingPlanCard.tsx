import React, { useState } from 'react';
import { BookOpenCheck, Check, Download, Loader2 } from 'lucide-react';
import { PLAN_LENGTHS, planStatus, portionOf, readingPlanStore, useReadingPlan } from '../services/readingPlan';
import { fetchMushafPage } from '../services/quranCom';
import { canDownload } from '../services/offline';

const action =
  'shrink-0 inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl font-bold bg-emerald-800 hover:bg-emerald-900 text-white cursor-pointer';
const quiet =
  'shrink-0 inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 cursor-pointer disabled:opacity-50';

/** A plan to read the whole Quran over a number of days, with today's portion and its progress. */
export const ReadingPlanCard: React.FC<{ onOpenPage: (page: number) => void }> = ({ onOpenPage }) => {
  const plan = useReadingPlan();
  const [saving, setSaving] = useState<'idle' | 'saving' | 'saved'>('idle');

  if (!plan) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 py-3">
        <p className="text-sm text-stone-700 dark:text-stone-300 min-w-0">Read the whole Quran with a daily portion. Finish in:</p>
        <span className="flex flex-wrap gap-1.5">
          {PLAN_LENGTHS.map((days) => (
            <button key={days} onClick={() => readingPlanStore.start(days)} className={quiet}>
              {days} days
            </button>
          ))}
        </span>
      </div>
    );
  }

  const status = planStatus(plan);
  const pct = Math.round((status.doneCount / plan.days) * 100);

  // The next three portions, saved through the service worker for reading without internet
  const saveAhead = async () => {
    if (!status.next) return;
    setSaving('saving');
    const last = portionOf(plan.days, Math.min(plan.days, status.next.day + 2)).to;
    const pages = Array.from({ length: last - status.next.from + 1 }, (_, i) => status.next!.from + i);
    await Promise.allSettled(pages.map((p) => fetchMushafPage(p)));
    setSaving('saved');
  };

  return (
    <div className="py-3 space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-stone-700 dark:text-stone-300 min-w-0">
          {status.finished ? (
            <>
              You finished the Quran in your {plan.days}-day plan. <strong>Mā shāʾ Allāh.</strong>
            </>
          ) : (
            <>
              Reading plan, day <strong className="tabular-nums">{status.next!.day}</strong> of {plan.days}: pages{' '}
              <strong className="tabular-nums">
                {status.next!.from}–{status.next!.to}
              </strong>
              {status.behind > 0 && (
                <span className="text-amber-700 dark:text-amber-300">
                  {' '}
                  · {status.behind} {status.behind === 1 ? 'day' : 'days'} behind
                </span>
              )}
            </>
          )}
        </p>
        <span className="flex flex-wrap gap-2">
          {status.next ? (
            <>
              <button onClick={() => onOpenPage(status.next!.from)} className={action}>
                <BookOpenCheck className="w-3.5 h-3.5" /> Read
              </button>
              <button onClick={() => readingPlanStore.markRead(status.next!.day)} className={quiet}>
                <Check className="w-3.5 h-3.5" /> Mark as read
              </button>
            </>
          ) : (
            <button onClick={() => readingPlanStore.stop()} className={quiet}>
              Start a new plan
            </button>
          )}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[8rem] h-1.5 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden" aria-hidden>
          <div className="h-full bg-emerald-600 transition-all" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs tabular-nums text-stone-500 dark:text-stone-400">
          {status.doneCount}/{plan.days} days
        </span>
        {status.next && canDownload() && (
          <button onClick={saveAhead} disabled={saving !== 'idle'} className={quiet}>
            {saving === 'saving' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            {saving === 'saved' ? 'Next 3 days saved offline' : 'Save the next 3 days offline'}
          </button>
        )}
        {!status.finished && (
          <button
            onClick={() => readingPlanStore.stop()}
            className="text-xs text-stone-400 hover:text-rose-600 cursor-pointer"
            title="Stop this plan"
          >
            Stop plan
          </button>
        )}
      </div>
    </div>
  );
};
