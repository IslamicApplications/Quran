import { describe, expect, it } from 'vitest';
import { RECITERS, hasWordTimings, reciterAudioUrl } from './reciters';

describe('reciterAudioUrl', () => {
  it('plays Alafasy from Quran.com, whose recording has word timings', () => {
    expect(reciterAudioUrl('112:1', 1)).toBe('https://verses.quran.com/Alafasy/mp3/112001.mp3');
    expect(hasWordTimings(1)).toBe(true);
  });

  it('builds the Quran API address for the other reciters', () => {
    expect(reciterAudioUrl('2:255', 4)).toBe('https://the-quran-project.github.io/Quran-Audio/Data/4/2_255.mp3');
    for (const r of RECITERS.filter((r) => r.id !== 1)) expect(hasWordTimings(r.id)).toBe(false);
  });
});
