import React, { useState } from 'react';
import {
  X,
  Settings,
  Type,
  Download,
  Upload,
  Trash2,
  ShieldCheck,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { AppSettings } from '../types';
import { StorageService, getTodayDateString } from '../services/storage';
import { useModalBehavior } from '../hooks/useModalBehavior';
import { useTheme, ThemePreference } from '../hooks/useTheme';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onDataReset: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onDataReset
}) => {
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useModalBehavior(isOpen, onClose);
  const [theme, setTheme] = useTheme();

  if (!isOpen) return null;

  const handleExport = () => {
    const jsonStr = StorageService.exportAllUserDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ayah-words-backup-${getTodayDateString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!importJsonText.trim()) return;
    const success = StorageService.importUserDataJson(importJsonText.trim());
    if (success) {
      setImportStatus('Data imported successfully!');
      onDataReset(); // re-read state in App
      setTimeout(() => {
        setImportStatus(null);
        setImportJsonText('');
      }, 2500);
    } else {
      setImportStatus("Error: This isn't a valid Ayah Words backup. Nothing was changed.");
    }
  };

  const handleDeleteAll = () => {
    StorageService.clearAllUserData();
    setShowDeleteConfirm(false);
    onDataReset();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-stone-950/50 backdrop-blur-sm animate-fadeIn z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-stone-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-stone-800 dark:text-stone-200">App Preferences &amp; Privacy</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 cursor-pointer"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Appearance */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300" />
            <span>Appearance</span>
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {([
              { id: 'system', label: 'System', icon: Monitor },
              { id: 'light', label: 'Light', icon: Sun },
              { id: 'dark', label: 'Dark', icon: Moon }
            ] as { id: ThemePreference; label: string; icon: typeof Sun }[]).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTheme(id)}
                aria-pressed={theme === id}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-semibold ring-1 transition-all cursor-pointer ${
                  theme === id
                    ? 'bg-emerald-800 text-white ring-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-200 dark:shadow-none dark:ring-1 dark:ring-emerald-400/20'
                    : 'bg-stone-50 dark:bg-stone-900 ring-stone-200 dark:ring-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Section 1: Typography & Arabic Text Size */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300" />
            <span>Arabic Typography &amp; Sizing</span>
          </h3>

          {/* Size choices */}
          <div>
            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-2">
              Arabic Script Font Size:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['md', 'lg', 'xl', '2xl'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => onUpdateSettings({ ...settings, arabicFontSize: size })}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    settings.arabicFontSize === size
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs dark:bg-emerald-400/10 dark:text-emerald-200 dark:shadow-none dark:ring-1 dark:ring-emerald-400/20'
                      : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  {size === 'md' ? 'Medium' : size === 'lg' ? 'Large' : size === 'xl' ? 'X-Large' : 'Huge'}
                </button>
              ))}
            </div>
          </div>

          {/* Font choice */}
          <div>
            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-2">
              Arabic Font Style:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onUpdateSettings({ ...settings, arabicFontFamily: 'amiri' })}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  settings.arabicFontFamily === 'amiri'
                    ? 'bg-emerald-50 dark:bg-emerald-950/25 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-bold'
                    : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <div className="text-xs font-semibold">Amiri Calligraphic</div>
                <div className="font-sample-amiri text-lg text-emerald-900 dark:text-emerald-200 mt-1">بِسْمِ ٱللَّهِ</div>
              </button>

              <button
                onClick={() => onUpdateSettings({ ...settings, arabicFontFamily: 'scheherazade' })}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  settings.arabicFontFamily === 'scheherazade'
                    ? 'bg-emerald-50 dark:bg-emerald-950/25 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-bold'
                    : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <div className="text-xs font-semibold">Scheherazade Script</div>
                <div className="font-sample-scheherazade text-lg text-emerald-900 dark:text-emerald-200 mt-1">بِسْمِ ٱللَّهِ</div>
              </button>
            </div>
          </div>

          {/* Transliteration Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
            <div>
              <div className="text-xs font-semibold text-stone-800 dark:text-stone-200">Show Latin Transliteration</div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400">Phonetic pronunciation guide underneath Arabic text</div>
            </div>
            <input
              type="checkbox"
              checked={settings.showTransliteration}
              onChange={(e) => onUpdateSettings({ ...settings, showTransliteration: e.target.checked })}
              className="w-4 h-4 text-emerald-800 dark:text-emerald-300 rounded focus:ring-emerald-700 cursor-pointer"
            />
          </div>
        </div>

        {/* Section 2: Privacy & Data Management */}
        <div className="space-y-3 pt-2 border-t border-stone-100 dark:border-stone-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300" />
            <span>Privacy &amp; Data Storage</span>
          </h3>

          <div className="bg-emerald-50/70 dark:bg-emerald-950/25 p-3.5 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/80 text-xs text-stone-700 dark:text-stone-300 space-y-1.5 leading-relaxed">
            <strong className="text-emerald-950 dark:text-emerald-100 block">Browser-Local Storage:</strong>
            <p>
              Your vocabulary study history, flashcard ratings, and custom study lists are saved directly in your device’s local browser storage. They are never sent to external tracking servers.
            </p>
            <p className="text-stone-500 dark:text-stone-400 text-[11px]">
              *Note: Local storage does not automatically sync across different browsers or separate devices. Use JSON Backup below to transfer your progress.
            </p>
          </div>

          {/* Backup & Export Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleExport}
              className="flex-1 py-2.5 px-3 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-semibold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Backup (JSON)</span>
            </button>
          </div>

          {/* Import Section */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300">
              Restore Data from JSON:
            </label>
            <textarea
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Paste exported JSON here..."
              rows={2}
              className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
            {importJsonText && (
              <button
                onClick={handleImport}
                className="px-3.5 py-1.5 bg-emerald-800 text-white rounded-lg text-xs font-bold hover:bg-emerald-900 cursor-pointer flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Apply Restored Data</span>
              </button>
            )}
            {importStatus && (
              <p
                className={`text-xs font-semibold ${
                  importStatus.startsWith('Error') ? 'text-rose-700 dark:text-rose-400' : 'text-emerald-800 dark:text-emerald-300'
                }`}
              >
                {importStatus}
              </p>
            )}
          </div>

          {/* Reset / Delete Study History */}
          <div className="pt-3 border-t border-stone-100 dark:border-stone-800">
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-xs text-rose-700 dark:text-rose-300 hover:text-rose-900 dark:hover:text-rose-200 font-medium hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset / Wipe All Local Study Data</span>
              </button>
            ) : (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl space-y-2">
                <p className="text-xs text-rose-950 dark:text-rose-100 font-semibold">
                  Are you sure you want to permanently erase all flashcard SRS progress and saved lists?
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDeleteAll}
                    className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Yes, Erase Everything
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-3 py-1.5 bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-300 text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
