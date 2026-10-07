import React from 'react';
import { EyeOff, RotateCcw } from 'lucide-react';
import { Segmented, ToggleChip } from './ReaderParts';

/** How the reader is being used: plain reading, memorising (ḥifẓ) or checking comprehension. */
export type PracticeMode = 'read' | 'memorize' | 'understand';

export interface MemorizeSettings {
  from: number;
  to: number;
  /** Times each verse is played before moving on */
  repeats: number;
  /** Silence between repeats, for reciting along from memory */
  gapSec: number;
  speed: number;
  /** Cover the words, uncovering each as it is recited */
  hideText: boolean;
}

export const defaultMemorize = (totalAyahs: number): MemorizeSettings => ({
  from: 1,
  to: totalAyahs,
  repeats: 3,
  gapSec: 2,
  speed: 1,
  hideText: false
});

const fieldLabel = 'text-[11px] font-semibold uppercase tracking-[0.06em] text-stone-500 dark:text-stone-400';
const selectClass =
  'px-2.5 py-1.5 rounded-lg bg-white dark:bg-stone-900 ring-1 ring-stone-200 dark:ring-stone-700 text-xs font-semibold text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer tabular-nums';

export const MemorizePanel: React.FC<{
  settings: MemorizeSettings;
  totalAyahs: number;
  onChange: (next: MemorizeSettings) => void;
}> = ({ settings, totalAyahs, onChange }) => {
  const ayahs = Array.from({ length: totalAyahs }, (_, i) => i + 1);
  const set = (patch: Partial<MemorizeSettings>) => onChange({ ...settings, ...patch });
  return (
    <div className="card p-4 flex flex-wrap items-end gap-x-5 gap-y-3 animate-fadeIn">
      <label className="flex flex-col gap-1">
        <span className={fieldLabel}>Verses</span>
        <span className="flex items-center gap-1.5 text-xs text-stone-500">
          <select
            className={selectClass}
            value={settings.from}
            onChange={(e) => {
              const from = Number(e.target.value);
              set({ from, to: Math.max(from, settings.to) });
            }}
            aria-label="First verse"
          >
            {ayahs.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          to
          <select
            className={selectClass}
            value={settings.to}
            onChange={(e) => {
              const to = Number(e.target.value);
              set({ to, from: Math.min(to, settings.from) });
            }}
            aria-label="Last verse"
          >
            {ayahs.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </span>
      </label>
      <div className="flex flex-col gap-1">
        <span className={fieldLabel}>Repeat each</span>
        <Segmented
          value={String(settings.repeats)}
          onChange={(v) => set({ repeats: Number(v) })}
          options={[1, 3, 5, 10].map((n) => ({ id: String(n), label: `${n}×` }))}
        />
      </div>
      <div className="flex flex-col gap-1">
        <span className={fieldLabel}>Pause between</span>
        <Segmented
          value={String(settings.gapSec)}
          onChange={(v) => set({ gapSec: Number(v) })}
          options={[
            { id: '0', label: 'None' },
            { id: '2', label: '2 s' },
            { id: '5', label: '5 s' }
          ]}
        />
      </div>
      <div className="flex flex-col gap-1">
        <span className={fieldLabel}>Speed</span>
        <Segmented
          value={String(settings.speed)}
          onChange={(v) => set({ speed: Number(v) })}
          options={[0.75, 1, 1.25].map((n) => ({ id: String(n), label: `${n}×` }))}
        />
      </div>
      <ToggleChip
        active={settings.hideText}
        onClick={() => set({ hideText: !settings.hideText })}
        icon={EyeOff}
        label="Hide the words"
      />
      {settings.hideText && (
        <p className="basis-full text-[11px] text-stone-500 dark:text-stone-400">
          Each word appears as it is recited. Tap a verse to uncover it.
        </p>
      )}
    </div>
  );
};

export const UnderstandPanel: React.FC<{ understood: number; tested: number; total: number; onReset: () => void }> = ({
  understood,
  tested,
  total,
  onReset
}) => (
  <div className="card p-4 flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
    <p className="text-sm text-stone-600 dark:text-stone-400 max-w-xl">
      Read each verse and recall its meaning, then reveal the translation and mark whether you understood it.
    </p>
    <div className="flex items-center gap-3">
      <span className="text-sm tabular-nums text-stone-700 dark:text-stone-300">
        Understood <strong className="text-emerald-800 dark:text-emerald-300">{understood}</strong> of {total}
        {tested > understood && <span className="text-stone-500"> · {tested - understood} not yet</span>}
      </span>
      {tested > 0 && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Start over
        </button>
      )}
    </div>
  </div>
);
