import { describe, expect, it } from 'vitest';
import { sameSpokenForm, spokenForm } from './arabicForm';

describe('spokenForm', () => {
  it('strips the same characters as the original class, written with literal marks', () => {
    // The class before it was rewritten with escapes for ESLint: ۖ-ۭ ؕ-ؚ ـ ٓ-ٕ and spaces
    // eslint-disable-next-line no-misleading-character-class -- rebuilds the old class on purpose to compare
    const original = new RegExp(`[${String.fromCharCode(0x6d6)}-${String.fromCharCode(0x6ed)}${String.fromCharCode(0x615)}-${String.fromCharCode(0x61a)}${String.fromCharCode(0x640)}${String.fromCharCode(0x653)}-${String.fromCharCode(0x655)}\\s]`);
    const current = /[ٓ-ٕۖ-ۭؕ-ؚـ\s]/;
    for (let c = 0x600; c <= 0x6ff; c++) {
      const ch = String.fromCharCode(c);
      expect(current.test(ch), `U+${c.toString(16)}`).toBe(original.test(ch));
    }
  });

  it('treats Uthmani and standard spellings alike', () => {
    expect(sameSpokenForm('صَلَوٰة', 'صَلاة')).toBe(true);
    expect(sameSpokenForm('ٱلْكِتَـٰبُ', 'الكِتابُ')).toBe(true);
  });

  it('ignores pause marks and tatweel', () => {
    expect(spokenForm('رَيْبَ ۛ')).toBe(spokenForm('رَيْبَ'));
    expect(spokenForm('كِتَـٰب')).toBe(spokenForm('كِتَٰب'));
  });
});
