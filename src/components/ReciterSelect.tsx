import React from 'react';
import { Mic, ChevronDown } from 'lucide-react';
import { RECITERS, ReciterId, hasWordTimings, reciterStore, useReciter } from '../services/reciters';

/**
 * Chooses the reciter for every verse player. `onChange` runs once the new reciter is stored, so a player can
 * restart the verse it is playing in the new voice.
 */
export const ReciterSelect: React.FC<{ onChange?: () => void; className?: string }> = ({ onChange, className = '' }) => {
  const reciter = useReciter();
  const estimated = !hasWordTimings(reciter);
  return (
    <span className={`inline-flex items-center gap-2 shrink-0 ${className}`}>
      <label
        className="relative inline-flex items-center"
        title={estimated ? 'No word timings exist for this reciter: the highlighted word is estimated' : undefined}
      >
        <Mic className="absolute start-2.5 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
        <select
          value={reciter}
          onChange={(e) => {
            reciterStore.set(Number(e.target.value) as ReciterId);
            onChange?.();
          }}
          aria-label="Reciter"
          className="appearance-none ps-7 pe-7 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 ring-1 ring-stone-200/70 dark:ring-stone-700/70 text-xs font-semibold text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
        >
          {RECITERS.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute end-2.5 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
      </label>
      {estimated && (
        <span className="text-[11px] text-stone-500 dark:text-stone-400 whitespace-nowrap">Approximate highlighting</span>
      )}
    </span>
  );
};
