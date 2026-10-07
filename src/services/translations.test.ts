import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchQuranEncSurah, fetchQuranEncTranslations, quranEncAudioUrl } from './translations';

afterEach(() => vi.unstubAllGlobals());

const respond = (body: unknown) => vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(body) });

describe('QuranEnc translations', () => {
  it('lists a language’s translations, marking those with a spoken recording', async () => {
    vi.stubGlobal('fetch', respond({ translations: [
      { key: 'somali_yacob', title: 'Somali Translation - Abdullah Hasan Yaqoub', version: '1.0.26', direction: 'ltr' },
      { key: 'urdu_junagarhi', title: 'Urdu Translation', version: '1.1.3', direction: 'rtl' }
    ] }));
    const list = await fetchQuranEncTranslations('test-list');
    expect(list.map((t) => [t.key, t.spoken, t.rtl])).toEqual([
      ['somali_yacob', true, false],
      ['urdu_junagarhi', false, true]
    ]);
  });

  it('keeps the text and footnotes exactly as QuranEnc sends them', async () => {
    vi.stubGlobal('fetch', respond({ result: [{ aya: '1', translation: '1. Dheh: Allaah waa Mid Keliya [1].', footnotes: '[1]. Axad ah.' }] }));
    const surah = await fetchQuranEncSurah('somali_yacob', 112);
    expect(surah.get(1)).toEqual({ text: '1. Dheh: Allaah waa Mid Keliya [1].', footnotes: '[1]. Axad ah.' });
  });

  it('addresses the spoken translation by surah and verse', () => {
    expect(quranEncAudioUrl('somali_yacob', '2:255')).toBe('https://d.quranenc.com/data/audio/somali_yacob/002255.mp3');
  });
});
