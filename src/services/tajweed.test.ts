import { describe, expect, it } from 'vitest';
import { parseTajweed } from './tajweed';

describe('parseTajweed', () => {
  it('splits a word into plain and rule-coloured runs', () => {
    const s = parseTajweed('<rule class=ham_wasl>ٱ</rule>لۡكِتَ<rule class=madda_normal>ـٰ</rule>بُ');
    expect(s.map((x) => [x.text, x.rule?.id])).toEqual([
      ['ٱ', 'ham_wasl'],
      ['لۡكِتَ', undefined],
      ['ـٰ', 'madda_normal'],
      ['بُ', undefined]
    ]);
  });

  it('colours nested markers by the known rule and keeps every letter', () => {
    const markup = 'ذ<rule class=madda_normal><rule class=custom-alef-maksora>ٰ</rule></rule>لِكَ';
    const s = parseTajweed(markup);
    expect(s.map((x) => [x.text, x.rule?.id])).toEqual([
      ['ذ', undefined],
      ['ٰ', 'madda_normal'],
      ['لِكَ', undefined]
    ]);
    expect(s.map((x) => x.text).join('')).toBe(markup.replace(/<[^>]+>/g, ''));
  });
});
