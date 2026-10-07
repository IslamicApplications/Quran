import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchVerseTafsirs, tafsirBlocks } from './tafsir';

describe('tafsirBlocks', () => {
  it('splits paragraphs and reads # lines as headings', () => {
    expect(tafsirBlocks('## Which was revealed in Makkah\n\nImam Ahmad recorded that…')).toEqual([
      { kind: 'heading', text: 'Which was revealed in Makkah' },
      { kind: 'text', text: 'Imam Ahmad recorded that…' }
    ]);
  });

  it('sets quoted Arabic apart and keeps short Arabic terms in their sentence', () => {
    const blocks = tafsirBlocks('بِسْمِ اللَّهِ الرَّحْمَـنِ الرَّحِيمِ\n\nThe word الصَّمَدُ means the Master.');
    expect(blocks.map((b) => b.kind)).toEqual(['arabic', 'text']);
  });

  it('shows a heading that swallowed its paragraph as text, and drops bold markers', () => {
    const long = `## The Story ${'of the People of the Cave '.repeat(5)}`;
    expect(tafsirBlocks(long)[0].kind).toBe('text');
    expect(tafsirBlocks('the Messenger of Allah **ﷺ** said')[0].text).toBe('the Messenger of Allah ﷺ said');
  });
});

describe('fetchVerseTafsirs', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('maps tafsirs by author, decodes entities and reads the passage range', async () => {
    const body = {
      tafsirs: [
        { author: 'Ibn Kathir', groupVerse: 'You are reading a tafsir for the group of verses 112:1 to 112:4', content: 'the Prophet&nbsp;ﷺ said' },
        { author: 'Maarif Ul Quran', groupVerse: null, content: 'Verse 112:2' },
        { author: 'Unknown Tafsir', groupVerse: null, content: 'ignored' }
      ]
    };
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(body) });
    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchVerseTafsirs('112:2');
    expect(fetchMock).toHaveBeenCalledWith('https://quranapi.pages.dev/api/tafsir/112_2.json');
    expect(result.tafsirs.ibn_kathir).toEqual({ text: 'the Prophet ﷺ said', passage: '112:1–112:4' });
    expect(result.tafsirs.maarif).toEqual({ text: 'Verse 112:2', passage: undefined });
    expect(Object.keys(result.tafsirs)).toEqual(['ibn_kathir', 'maarif']);
  });
});
