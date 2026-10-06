import React from 'react';
import { AlertTriangle, RotateCw } from 'lucide-react';

const RELOAD_KEY = 'ayah-words-update-reload';

// Each deploy replaces the hashed chunk files, so a page opened before it can no longer load a tab it
// hasn't opened yet. Browsers word the failure differently.
const isChunkLoadError = (error: unknown) =>
  error instanceof Error &&
  /dynamically imported module|Importing a module script failed|Unable to preload CSS/i.test(error.message);

/** Reloads once to pick up the new version; a second failure within a minute shows the message instead. */
const reloadForUpdate = (): boolean => {
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY));
    if (Date.now() - last < 60_000) return false;
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  } catch {
    return false;
  }
  window.location.reload();
  return true;
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  failed: boolean;
  update: boolean;
}

/** Shows a way out instead of a blank page when something below it throws while rendering. */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { failed: false, update: false };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { failed: true, update: isChunkLoadError(error) };
  }

  componentDidCatch(error: unknown) {
    if (isChunkLoadError(error) && reloadForUpdate()) return;
    console.error(error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    const { update } = this.state;

    return (
      <div className="card p-10 text-center space-y-4 max-w-md mx-auto my-10">
        <div className="w-14 h-14 bg-amber-50 dark:bg-amber-950/20 ring-1 ring-amber-200 dark:ring-amber-900/60 text-amber-700 dark:text-amber-300 rounded-2xl flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
          {update ? 'A new version is available' : 'Something went wrong'}
        </h3>
        <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
          {update
            ? 'Ayah Words was updated since you opened it. Reload to continue; your progress is kept.'
            : 'This page hit an error. Your progress is saved in this browser and is not affected.'}
        </p>
        <div className="flex items-center justify-center gap-2">
          {!update && (
            <button
              onClick={() => this.setState({ failed: false, update: false })}
              className="px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-sm font-semibold cursor-pointer"
            >
              Try again
            </button>
          )}
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-sm font-semibold cursor-pointer"
          >
            <RotateCw className="w-4 h-4" /> Reload
          </button>
        </div>
      </div>
    );
  }
}
