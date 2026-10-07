import React, { useEffect, useRef, useState } from 'react';
import { Download, CheckCircle2, X, Loader2, Trash2 } from 'lucide-react';
import { canDownload, removeDownload, useDownloads, type DownloadId, type Progress } from '../services/offline';

/**
 * Saves a surah or juz for offline use, with progress and a way to cancel; once saved, says so and offers to
 * remove it. Only the published app can save (it has the service worker that keeps the files).
 */
export const DownloadButton: React.FC<{
  id: DownloadId;
  download: (onProgress: (p: Progress) => void, signal: AbortSignal) => Promise<number>;
  className?: string;
}> = ({ id, download, className = '' }) => {
  const record = useDownloads()[id];
  const [progress, setProgress] = useState<Progress | null>(null);
  const [failed, setFailed] = useState(0);
  const abort = useRef<AbortController | null>(null);

  // Leaving the page stops a download in progress
  useEffect(() => () => abort.current?.abort(), []);

  const start = async () => {
    abort.current = new AbortController();
    setFailed(0);
    setProgress({ done: 0, total: 1 });
    try {
      const n = await download(setProgress, abort.current.signal);
      if (!abort.current.signal.aborted) setFailed(n);
    } catch {
      setFailed(1);
    }
    setProgress(null);
  };

  const quiet = 'inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl font-semibold cursor-pointer';

  if (progress) {
    const pct = Math.round((progress.done / Math.max(progress.total, 1)) * 100);
    return (
      <div className={`flex items-center gap-3 ${className}`} role="status" aria-live="polite">
        <Loader2 className="w-4 h-4 animate-spin text-emerald-700 dark:text-emerald-300 shrink-0" />
        <div className="w-40 h-1.5 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
          <div className="h-full bg-emerald-600 transition-all" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs tabular-nums text-stone-600 dark:text-stone-400">{pct}%</span>
        <button onClick={() => abort.current?.abort()} className={`${quiet} bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300`}>
          <X className="w-3.5 h-3.5" /> Cancel
        </button>
      </div>
    );
  }

  if (record && !failed) {
    return (
      <div className={`flex flex-wrap items-center gap-2 ${className}`}>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4" /> Available offline
          <span className="font-normal text-stone-500 dark:text-stone-400">· {record.reciter}</span>
        </span>
        <button onClick={() => removeDownload(id)} className={`${quiet} text-stone-500 hover:text-rose-600`} aria-label="Remove the offline copy">
          <Trash2 className="w-3.5 h-3.5" /> Remove
        </button>
      </div>
    );
  }

  const available = canDownload();
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <button
        onClick={start}
        disabled={!available}
        title={available ? 'Save the text, translation and recitation to use without internet' : undefined}
        className={`${quiet} bg-emerald-800 hover:bg-emerald-900 text-white disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <Download className="w-3.5 h-3.5" /> {failed ? 'Try the download again' : 'Download for offline'}
      </button>
      {failed > 0 && (
        <span className="text-xs text-amber-700 dark:text-amber-300">
          {failed} {failed === 1 ? 'file' : 'files'} could not be saved. Check your connection.
        </span>
      )}
      {!available && (
        <span className="text-xs text-stone-500 dark:text-stone-400">Works in the published app, after it has loaded once.</span>
      )}
    </div>
  );
};
