import React, { useState } from 'react';
import {
  Bookmark,
  Trash2,
  Layers,
  FolderPlus,
  ChevronRight
} from 'lucide-react';
import { StudyList, QuranWord, DifficultyLevel, Language } from '../types';
import { StorageService } from '../services/storage';

interface SavedListsManagerProps {
  studyLists: StudyList[];
  savedWordIds: string[];
  allWords: QuranWord[];
  level: DifficultyLevel;
  language: Language;
  onUpdateLists: () => void;
  onStartFlashcardsWithList?: (listId: string) => void;
  onSelectWord?: (wordId: string) => void;
}

export const SavedListsManager: React.FC<SavedListsManagerProps> = ({
  studyLists,
  savedWordIds,
  allWords,
  level,
  language,
  onUpdateLists,
  onStartFlashcardsWithList,
  onSelectWord
}) => {
  const [activeListId, setActiveListId] = useState<string>(studyLists[0]?.id || 'all-saved');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [newListDesc, setNewListDesc] = useState('');

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;

    StorageService.createStudyList(newListTitle.trim(), newListDesc.trim());
    setNewListTitle('');
    setNewListDesc('');
    setShowCreateModal(false);
    onUpdateLists();
  };

  const handleDeleteList = (listId: string) => {
    if (window.confirm('Are you sure you want to delete this study list?')) {
      StorageService.deleteStudyList(listId);
      onUpdateLists();
      setActiveListId(studyLists[0]?.id || 'all-saved');
    }
  };

  const handleRemoveWordFromList = (listId: string, wordId: string) => {
    StorageService.toggleWordInList(listId, wordId);
    onUpdateLists();
  };

  const activeList = studyLists.find((l) => l.id === activeListId);

  // Determine active words
  const activeWords: QuranWord[] =
    activeListId === 'all-saved'
      ? allWords.filter((w) => savedWordIds.includes(w.id))
      : activeList
      ? allWords.filter((w) => activeList.wordIds.includes(w.id))
      : [];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="card p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 rounded-2xl bg-amber-100 dark:bg-amber-900/25 text-amber-900 dark:text-amber-200 flex items-center justify-center">
            <Bookmark className="w-5 h-5 fill-amber-700 text-amber-700 dark:text-amber-300" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-200">Personal Study Lists &amp; Bookmarks</h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Organize vocabulary into focused thematic sets for targeted spaced repetition.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
        >
          <FolderPlus className="w-4 h-4" />
          <span>Create New Study List</span>
        </button>
      </div>

      {/* Main Grid: Lists sidebar + Words detail */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar Lists */}
        <div className="card p-4 space-y-2 h-fit">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400 px-2 block">
            Your Collections
          </span>

          {/* All Bookmarked */}
          <button
            onClick={() => setActiveListId('all-saved')}
            className={`w-full text-left p-3 rounded-2xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
              activeListId === 'all-saved'
                ? 'bg-amber-100/80 dark:bg-amber-900/25 text-amber-950 dark:text-amber-100 font-bold border border-amber-300 dark:border-amber-900/60'
                : 'hover:bg-stone-50 dark:hover:bg-stone-900 text-stone-700 dark:text-stone-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-600 dark:text-amber-400 fill-amber-600" />
              <span>All Bookmarked Words</span>
            </div>
            <span className="bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 text-[11px] px-2 py-0.5 rounded-full border border-stone-200 dark:border-stone-700">
              {savedWordIds.length}
            </span>
          </button>

          {/* Curated and User Lists */}
          {studyLists.map((list) => {
            const isSelected = activeListId === list.id;
            return (
              <div
                key={list.id}
                onClick={() => setActiveListId(list.id)}
                className={`p-3 rounded-2xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-950 dark:text-emerald-100 font-bold border border-emerald-300 dark:border-emerald-700'
                    : 'hover:bg-stone-50 dark:hover:bg-stone-900 text-stone-700 dark:text-stone-300'
                }`}
              >
                <div className="space-y-0.5 pe-2">
                  <div className="font-semibold">{list.title}</div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-300 line-clamp-1">{list.description}</div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 text-[11px] px-2 py-0.5 rounded-full border border-stone-200 dark:border-stone-700">
                    {list.wordIds.length}
                  </span>
                  {!list.isDefault && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteList(list.id);
                      }}
                      className="text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 cursor-pointer"
                      title="Delete study list"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Word Details in Active List */}
        <div className="md:col-span-2 space-y-4">
          <div className="card p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-stone-800 dark:text-stone-200">
                  {activeListId === 'all-saved' ? 'All Bookmarked Words' : activeList?.title}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {activeListId === 'all-saved'
                    ? 'Words you have quick-bookmarked across lessons.'
                    : activeList?.description}
                </p>
              </div>

              {activeWords.length > 0 && onStartFlashcardsWithList && (
                <button
                  onClick={() => onStartFlashcardsWithList(activeListId)}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Review in Flashcards</span>
                </button>
              )}
            </div>

            {/* Word List */}
            {activeWords.length === 0 ? (
              <div className="text-center py-10 text-stone-500 dark:text-stone-400 text-xs space-y-2">
                <Bookmark className="w-8 h-8 text-stone-300 dark:text-stone-600 mx-auto" />
                <p>No words in this list yet.</p>
                <p className="text-stone-400">Click the bookmark icon on any lesson card to add words here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeWords.map((word) => {
                  const meaning =
                    word.explanations[level]?.[language]?.meaning ||
                    word.explanations[level]?.en?.meaning ||
                    word.explanations.beginner.en?.meaning;

                  return (
                    <div
                      key={word.id}
                      className="p-4 rounded-2xl bg-amber-50/30 dark:bg-amber-950/20 border border-stone-200/80 dark:border-stone-700/80 hover:border-emerald-700/40 transition-all flex items-center justify-between gap-3"
                    >
                      <div
                        onClick={() => onSelectWord && onSelectWord(word.id)}
                        className="cursor-pointer space-y-1 flex-1"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-quran-amiri text-2xl font-bold text-emerald-950 dark:text-emerald-100">
                            {word.arabic}
                          </span>
                          <span className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                            {word.transliteration}
                          </span>
                          <span className="text-xs text-stone-400">
                            ({word.rootArabic})
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-1">{meaning}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {activeList && !activeList.isDefault && (
                          <button
                            onClick={() => handleRemoveWordFromList(activeList.id, word.id)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                            title="Remove from this list"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        {onSelectWord && (
                          <button
                            onClick={() => onSelectWord(word.id)}
                            className="p-1.5 text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-emerald-100 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 cursor-pointer"
                            title="Open full lesson"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create List Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-stone-950/50 backdrop-blur-sm animate-fadeIn z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-md w-full p-6 shadow-2xl animate-scale-in space-y-4">
            <h3 className="text-lg font-bold text-stone-800 dark:text-stone-200">Create New Study List</h3>

            <form onSubmit={handleCreateList} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">List Title:</label>
                <input
                  type="text"
                  required
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  placeholder="e.g. Surah Al-Mulk Vocabulary, Ramadan Duas"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-600 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">Description (Optional):</label>
                <textarea
                  value={newListDesc}
                  onChange={(e) => setNewListDesc(e.target.value)}
                  placeholder="Brief note on what this list focuses on..."
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-600 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Create List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
