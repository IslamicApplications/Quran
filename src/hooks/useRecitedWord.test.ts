import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { followChapterRecitation, followRecitation, recitedWord } from './useRecitedWord';

/** A stand-in for an <audio> element: its playback position is set by the test. */
const fakeAudio = (durationSec: number) => {
  const audio = new EventTarget() as EventTarget & { currentTime: number; duration: number };
  audio.currentTime = 0;
  audio.duration = durationSec;
  return audio as unknown as HTMLAudioElement & { currentTime: number };
};

const flush = () => new Promise((r) => setTimeout(r, 5));
const at = async (audio: HTMLAudioElement & { currentTime: number }, sec: number) => {
  audio.currentTime = sec;
  await flush();
};

beforeEach(() => {
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => setTimeout(() => cb(0), 0) as unknown as number);
  vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id));
});
afterEach(() => vi.unstubAllGlobals());

describe('followRecitation', () => {
  it("lights each word in turn from the recording's own timings (Abu Bakr al-Shatri)", async () => {
    const verse = {
      words: [1, 2, 3, 4].map(() => ({ char_type_name: 'word' })),
      audio: { segments: [[0, 1, 200, 420], [1, 2, 430, 810], [2, 3, 820, 1640], [3, 4, 1650, 2280]] }
    };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ verse }) }));
    const audio = fakeAudio(2.4);
    followRecitation(audio, '112:1', 2);
    await flush();
    audio.dispatchEvent(new Event('playing'));

    await at(audio, 0.3);
    expect(recitedWord('112:1')).toBe(1);
    await at(audio, 0.5);
    expect(recitedWord('112:1')).toBe(2);
    await at(audio, 1.0);
    expect(recitedWord('112:1')).toBe(3);
    await at(audio, 2.0);
    expect(recitedWord('112:1')).toBe(4);

    audio.dispatchEvent(new Event('ended'));
    await flush();
    expect(recitedWord('112:1')).toBeNull();
  });

  it('estimates the timings from the words for a reciter without them (Nasser al-Qatami)', async () => {
    const audio = fakeAudio(3);
    followRecitation(audio, '112:1', 3, ['قُلْ', 'هُوَ', 'ٱللَّهُ', 'أَحَدٌ']);
    await flush();
    audio.dispatchEvent(new Event('playing'));

    const seen: number[] = [];
    for (let sec = 0.3; sec < 2.9; sec += 0.1) {
      await at(audio, sec);
      const w = recitedWord('112:1');
      if (w && w !== seen[seen.length - 1]) seen.push(w);
    }
    expect(seen).toEqual([1, 2, 3, 4]);
  });

  it('follows a whole-surah recording verse by verse, announcing each new verse', async () => {
    // Al-Ikhlas recited by Alafasy: timings from Quran.com's audio service (milliseconds from the start)
    const verses: { key: string; from: number; to: number; words: [number, number, number][] }[] = [
      { key: '112:1', from: 0, to: 2980, words: [[1, 0, 430], [2, 430, 700], [3, 700, 1680], [4, 1680, 2915]] },
      { key: '112:2', from: 2980, to: 5510, words: [[1, 2915, 3965], [2, 3965, 5400]] }
    ];
    const audio = fakeAudio(13);
    const announced: string[] = [];
    followChapterRecitation(audio, verses, (key) => announced.push(key));
    audio.dispatchEvent(new Event('playing'));

    await at(audio, 0.8);
    expect(recitedWord('112:1')).toBe(3);
    await at(audio, 3.2);
    expect(recitedWord('112:1')).toBeNull();
    expect(recitedWord('112:2')).toBe(1);
    await at(audio, 4.5);
    expect(recitedWord('112:2')).toBe(2);
    expect(announced).toEqual(['112:1', '112:2']);
  });
});
