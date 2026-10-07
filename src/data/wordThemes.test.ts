import { describe, expect, it } from 'vitest';
import { themeOfWord } from './wordThemes';

describe('themeOfWord', () => {
  it('prefers a listed lemma over its root', () => {
    // عَلِيم is a Divine Name although its root ع ل م is under Guidance
    expect(themeOfWord('عَلِيم', 'علم')).toBe('divine_names');
    expect(themeOfWord('عِلْم', 'علم')).toBe('guidance_knowledge');
  });

  it('falls back to the root', () => {
    expect(themeOfWord('صَبَرَ', 'صبر')).toBe('character_ethics');
    expect(themeOfWord('سَجَدَ', 'سجد')).toBe('worship_devotion');
  });

  it('leaves particles and everyday words without a theme', () => {
    expect(themeOfWord('مِن')).toBeUndefined();
    expect(themeOfWord('قالَ', 'قول')).toBeUndefined();
  });

  it('matches whatever the mark order (NFD input)', () => {
    expect(themeOfWord('رَحِيم'.normalize('NFD'), 'رحم')).toBe('divine_names');
  });
});
