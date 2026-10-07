/**
 * Tajweed colouring from Quran.com's word text marked with rules (<rule class=madda_normal>…</rule>, nested at
 * times), coloured the way printed tajweed Mushafs group them: silent letters grey, lengthening (madd) in reds,
 * nasalisation (ghunnah) in greens, echoing (qalqalah) blue.
 */

export interface TajweedRule {
  id: string;
  name: string;
  arabic: string;
  /** CSS class colouring this rule (index.css) */
  className: string;
}

export const TAJWEED_RULES: TajweedRule[] = [
  { id: 'ham_wasl', name: 'Hamzat al-wasl (silent)', arabic: 'همزة الوصل', className: 'tj-silent' },
  { id: 'laam_shamsiyah', name: 'Lām shamsiyyah (silent)', arabic: 'لام شمسية', className: 'tj-silent' },
  { id: 'slnt', name: 'Silent letter', arabic: 'حرف لا يُنطق', className: 'tj-silent' },
  { id: 'madda_normal', name: 'Natural madd (2 counts)', arabic: 'مد طبيعي', className: 'tj-madd-2' },
  { id: 'madda_permissible', name: 'Permissible madd (2, 4 or 6)', arabic: 'مد جائز', className: 'tj-madd-246' },
  { id: 'madda_obligatory_mottasel', name: 'Joined obligatory madd (4–5)', arabic: 'مد واجب متصل', className: 'tj-madd-45' },
  { id: 'madda_obligatory_monfasel', name: 'Separated madd (4–5)', arabic: 'مد منفصل', className: 'tj-madd-45' },
  { id: 'madda_necessary', name: 'Necessary madd (6)', arabic: 'مد لازم', className: 'tj-madd-6' },
  { id: 'ghunnah', name: 'Ghunnah (nasalisation)', arabic: 'غنة', className: 'tj-ghunnah' },
  { id: 'ikhafa', name: 'Ikhfāʾ (hiding)', arabic: 'إخفاء', className: 'tj-ikhfa' },
  { id: 'ikhafa_shafawi', name: 'Ikhfāʾ shafawī', arabic: 'إخفاء شفوي', className: 'tj-ikhfa' },
  { id: 'idgham_ghunnah', name: 'Idghām with ghunnah', arabic: 'إدغام بغنة', className: 'tj-idgham' },
  { id: 'idgham_shafawi', name: 'Idghām shafawī', arabic: 'إدغام شفوي', className: 'tj-idgham' },
  { id: 'idgham_mutajanisayn', name: 'Idghām mutajānisayn', arabic: 'إدغام متجانسين', className: 'tj-idgham' },
  { id: 'idgham_mutaqaribayn', name: 'Idghām mutaqāribayn', arabic: 'إدغام متقاربين', className: 'tj-idgham' },
  { id: 'idgham_wo_ghunnah', name: 'Idghām without ghunnah', arabic: 'إدغام بلا غنة', className: 'tj-silent' },
  { id: 'iqlab', name: 'Iqlāb (n becomes m)', arabic: 'إقلاب', className: 'tj-iqlab' },
  { id: 'qalaqah', name: 'Qalqalah (echo)', arabic: 'قلقلة', className: 'tj-qalqalah' }
];

const BY_ID = new Map(TAJWEED_RULES.map((r) => [r.id, r]));

export interface TajweedSegment {
  text: string;
  rule?: TajweedRule;
}

/**
 * Splits a word's marked text into runs of plain and rule-coloured letters. Nested rules colour by the
 * innermost one Ayah Words knows; markers that are no tajweed rule (custom-alef-maksora) are ignored.
 */
export const parseTajweed = (markup: string): TajweedSegment[] => {
  const segments: TajweedSegment[] = [];
  const stack: (TajweedRule | undefined)[] = [];
  for (const [, open, close, text] of markup.matchAll(/<rule class=["']?([\w-]+)["']?>|(<\/rule>)|([^<]+)/g)) {
    if (open) stack.push(BY_ID.get(open));
    else if (close) stack.pop();
    else if (text) {
      const rule = [...stack].reverse().find(Boolean);
      const last = segments[segments.length - 1];
      if (last && last.rule === rule) last.text += text;
      else segments.push({ text, rule });
    }
  }
  return segments;
};

// Whether tajweed colouring is on, shared by the Surah Reader and the Mushaf pages (this device only)
const TAJWEED_KEY = 'ayah-words-tajweed';

export const readTajweedPreference = (): boolean => {
  try {
    return localStorage.getItem(TAJWEED_KEY) === '1';
  } catch {
    return false;
  }
};

export const saveTajweedPreference = (on: boolean): void => {
  try {
    localStorage.setItem(TAJWEED_KEY, on ? '1' : '0');
  } catch {
    /* per-viewer convenience only */
  }
};
