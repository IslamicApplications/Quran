import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Loader2, Play, Pause, ExternalLink } from 'lucide-react';
import { playAudio } from '../services/quranCom';

interface AudioPlayerProps {
  audioUrl?: string;
  reciter?: string;
  source?: string;
  compact?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  reciter = 'Mahmoud Khalil Al-Husary (Murattal)',
  source = 'EveryAyah / Tanzil Public Dataset',
  compact = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = () => {
    const audio = audioRef.current;
    audioRef.current = null;
    if (audio) {
      audio.onpause = audio.onended = audio.onerror = audio.onplaying = null;
      audio.pause();
    }
  };

  // Reset when the clip changes, and stop playback when the lesson closes
  useEffect(() => {
    setIsPlaying(false);
    setIsLoading(false);
    setHasError(false);
    return stop;
  }, [audioUrl]);

  if (!audioUrl) {
    return null;
  }

  const togglePlay = () => {
    if (isPlaying || isLoading) {
      stop();
      setIsPlaying(false);
      setIsLoading(false);
      return;
    }
    // Shared player: starting this clip stops any other audio in the app, and vice versa
    const audio = playAudio(audioUrl);
    audioRef.current = audio;
    setIsLoading(true);
    setHasError(false);
    audio.onplaying = () => {
      setIsLoading(false);
      setIsPlaying(true);
    };
    audio.onpause = audio.onended = () => {
      setIsLoading(false);
      setIsPlaying(false);
    };
    audio.onerror = () => {
      setIsLoading(false);
      setIsPlaying(false);
      setHasError(true);
    };
  };

  if (compact) {
    return (
      <button
        onClick={togglePlay}
        disabled={isLoading}
        title={hasError ? 'Audio unavailable. Click to try again' : `Listen: ${reciter}`}
        aria-label={isPlaying ? 'Pause recitation' : 'Play recitation audio'}
        className={`inline-flex items-center justify-center p-2 rounded-full transition-all cursor-pointer ${
          isPlaying
            ? 'bg-emerald-700 text-white shadow-sm ring-4 ring-emerald-500/20'
            : hasError
            ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
            : 'bg-emerald-50 dark:bg-emerald-950/25 ring-1 ring-emerald-200 dark:ring-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300'
        }`}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : hasError ? (
          <VolumeX className="w-4 h-4" />
        ) : isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Volume2 className="w-4 h-4" />
        )}
      </button>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-2 pr-4 rounded-2xl bg-white dark:bg-stone-900 ring-1 ring-stone-200/80 dark:ring-stone-700/80 text-xs">
      <div className="flex items-center gap-2.5">
        <button
          onClick={togglePlay}
          disabled={isLoading}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
            isPlaying
              ? 'bg-emerald-700 text-white shadow-sm'
              : hasError
              ? 'bg-stone-200 dark:bg-stone-700 text-stone-500 dark:text-stone-400 cursor-not-allowed'
              : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-sm'
          }`}
          aria-label={isPlaying ? 'Pause recitation' : 'Play verified recitation'}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Loading Audio...</span>
            </>
          ) : isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Pause Recitation</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Listen to Ayah</span>
            </>
          )}
        </button>

        <div className="text-stone-700 dark:text-stone-300">
          <span className="font-semibold text-emerald-950 dark:text-emerald-100 block sm:inline">{reciter}</span>
          <span className="text-stone-500 dark:text-stone-400 text-[11px] block">Licensed via {source}</span>
        </div>
      </div>

      {hasError ? (
        <span className="text-amber-700 dark:text-amber-300 text-[11px] italic">Audio stream temporarily unavailable</span>
      ) : (
        <span className="text-stone-400 text-[10px] flex items-center gap-1">
          <span>Murattal standard recitation</span>
        </span>
      )}
    </div>
  );
};
