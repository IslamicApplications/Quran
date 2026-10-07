import { afterEach, describe, expect, it, vi } from 'vitest';
import { estimateTimings, hasWordTimings, reciterAudioUrl, reciterTimings } from './reciters';

describe('reciterAudioUrl', () => {
  it("plays Quran.com's recordings for the reciters it has timings for", () => {
    expect(reciterAudioUrl('112:1', 1)).toBe('https://verses.quran.com/Alafasy/mp3/112001.mp3');
    expect(reciterAudioUrl('2:255', 2)).toBe('https://verses.quran.com/Shatri/mp3/002255.mp3');
    expect(reciterAudioUrl('9:1', 5)).toBe('https://verses.quran.com/Rifai/mp3/009001.mp3');
    for (const id of [1, 2, 5] as const) expect(hasWordTimings(id)).toBe(true);
  });

  it('plays the Quran API files for the reciters Quran.com does not have', () => {
    expect(reciterAudioUrl('2:255', 4)).toBe('https://the-quran-project.github.io/Quran-Audio/Data/4/2_255.mp3');
    for (const id of [3, 4] as const) expect(hasWordTimings(id)).toBe(false);
  });
});

describe('estimateTimings', () => {
  it('covers every word in order, longer words taking longer, inside the recording', () => {
    const t = estimateTimings(['قُلْ', 'هُوَ', 'ٱللَّهُ', 'أَحَدٌ'], 3000);
    expect(t.map((x) => x.position)).toEqual([1, 2, 3, 4]);
    t.forEach((x, i) => {
      expect(x.end).toBeGreaterThan(x.start);
      if (i) expect(x.start).toBe(t[i - 1].end);
    });
    expect(t[0].start).toBeGreaterThan(0); // the opening silence is skipped
    expect(t[3].end).toBeLessThanOrEqual(3000);
    expect(t[2].end - t[2].start).toBeGreaterThan(t[0].end - t[0].start); // ٱللَّهُ is longer than قُلْ
  });
});

describe('reciterTimings', () => {
  afterEach(() => vi.unstubAllGlobals());

  it("reads Quran.com's timings and shares a span of words evenly between them", async () => {
    // Hani ar-Rifai's 112:1, where the first entry covers words 1–2
    const verse = {
      words: [1, 2, 3, 4].map(() => ({ char_type_name: 'word' })).concat({ char_type_name: 'end' } as never),
      audio: { segments: [[0, 2, 0, 1890], [2, 3, 1900, 2560], [3, 4, 2570, 3170]] }
    };
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ verse }) });
    vi.stubGlobal('fetch', fetchMock);

    const t = await reciterTimings('112:1', 5);
    expect(fetchMock.mock.calls[0][0]).toContain('/verses/by_key/112:1?');
    expect(fetchMock.mock.calls[0][0]).toContain('audio=5');
    expect(t).toEqual([
      { position: 1, start: 0, end: 945 },
      { position: 2, start: 945, end: 1890 },
      { position: 3, start: 1900, end: 2560 },
      { position: 4, start: 2570, end: 3170 }
    ]);
  });

  it('has no timings to give for the reciters without them', async () => {
    expect(await reciterTimings('112:1', 3)).toBeUndefined();
  });
});
