import { describe, expect, it } from 'vitest';
import { layout } from './MushafPageView';
import type { MushafWord } from '../services/quranCom';

const word = (location: string, line: number, end = false): MushafWord => ({ location, line, text: 'x', end });

describe('Mushaf page layout', () => {
  it("puts a surah's title and Bismillah on the lines before its first verse", () => {
    const lines = layout([word('2:286:1', 1), word('3:1:1', 4)], [{ surah: 3, line: 4 }]);
    expect(lines.slice(0, 4).map((l) => l.kind)).toEqual(['words', 'title', 'bismillah', 'words']);
  });

  it('gives At-Tawbah its title but no Bismillah', () => {
    const lines = layout([word('9:1:1', 2)], [{ surah: 9, line: 2 }]);
    expect(lines.slice(0, 2)).toEqual([{ kind: 'title', surah: 9 }, expect.objectContaining({ kind: 'words' })]);
  });

  it('ends a page with the next surah title when that surah starts on line 2 of the next page', () => {
    // Page 76: Al-Imran's last verse ends on line 14; An-Nisa's title stands on line 15
    const words = Array.from({ length: 14 }, (_, i) => word(`3:${186 + i}:1`, i + 1)).concat(word('3:200:end', 14, true));
    const lines = layout(words, []);
    expect(lines).toHaveLength(15);
    expect(lines[14]).toEqual({ kind: 'title', surah: 4 });
  });

  it('leaves a page alone when its last verse does not end a surah', () => {
    const words = Array.from({ length: 14 }, (_, i) => word(`2:${10 + i}:1`, i + 1));
    expect(layout(words, []).map((l) => l.kind)).not.toContain('title');
  });
});
