import React from 'react';
import { HardDriveDownload, Trash2 } from 'lucide-react';
import { removeDownload, storageUsed, useDownloads } from '../services/offline';
import { useAsync } from './QuranWordBits';

const megabytes = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(bytes < 10 * 1024 * 1024 ? 1 : 0)} MB`;

/** The surahs and juz saved for offline use, with the space they take and a way to remove each. */
export const OfflineDownloads: React.FC<{ onOpen?: (id: string) => void }> = ({ onOpen }) => {
  const downloads = Object.values(useDownloads()).sort((a, b) => a.savedAt.localeCompare(b.savedAt));
  const { data: used } = useAsync(storageUsed, [downloads.length]);

  return (
    <section className="card p-5 sm:p-6 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <HardDriveDownload className="w-4 h-4 text-emerald-700 dark:text-emerald-300" /> Offline downloads
          <span className="text-xs font-normal text-stone-500 dark:text-stone-400 tabular-nums">{downloads.length}</span>
        </h3>
        {used !== undefined && (
          <span className="text-xs text-stone-500 dark:text-stone-400 tabular-nums">{megabytes(used)} used on this device</span>
        )}
      </div>
      {downloads.length === 0 ? (
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Use “Download for offline” on any surah or juz in the Surah Reader to read and listen to it without internet.
        </p>
      ) : (
        <ul className="divide-y divide-stone-100 dark:divide-stone-800">
          {downloads.map((d) => (
            <li key={d.id} className="py-2.5 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => onOpen?.(d.id)}
                className="text-left text-sm text-stone-800 dark:text-stone-200 hover:text-emerald-800 dark:hover:text-emerald-300 cursor-pointer"
              >
                <strong>{d.title}</strong>{' '}
                <span className="text-stone-500 dark:text-stone-400">
                  · {d.verses} verses · {d.reciter}
                </span>
              </button>
              <button
                onClick={() => removeDownload(d.id)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-rose-600 cursor-pointer"
                aria-label={`Remove ${d.title} from this device`}
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
