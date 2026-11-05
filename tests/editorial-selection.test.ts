import { describe, expect, it } from 'vitest';
// @ts-ignore Shared reservation policy has no runtime dependencies.
import { selectPendingTopics } from '../scripts/lib/editorial-selection.mjs';

const strategy = {
  enabled: true,
  priorityCountries: [
    { id: 'it', targetOriginals: 30 },
    { id: 'jp', targetOriginals: 25 },
    { id: 'mx', targetOriginals: 25 },
    { id: 'us', targetOriginals: 20 },
  ],
};

describe('owner country priorities', () => {
  it('reserves two distinct priority topics while retaining other countries for later', () => {
    const plan = ['za', 'it', 'jp', 'mx', 'us'].map((countryId) => ({
      id: `new-${countryId}`,
      countryId,
    }));
    const chosen = selectPendingTopics(plan, [], 2, strategy);
    expect(chosen).toHaveLength(2);
    expect(new Set(chosen.map((t: any) => t.countryId)).size).toBe(2);
    expect(
      chosen.every((t: any) => ['it', 'jp', 'mx', 'us'].includes(t.countryId)),
    ).toBe(true);
    expect(plan.some((t) => t.countryId === 'za')).toBe(true);
  });
  it('does not invent extra topics or fall back outside the four countries', () => {
    const plan = [
      { id: 'italy-gap', countryId: 'it' },
      { id: 'africa-later', countryId: 'za' },
    ];
    expect(
      selectPendingTopics(plan, [], 5, strategy).map((t: any) => t.id),
    ).toEqual(['italy-gap']);
  });
  it('excludes completed bilingual pairs and retains an incomplete localization', () => {
    const plan = [
      { id: 'done', countryId: 'it' },
      { id: 'unfinished', countryId: 'jp' },
    ];
    const articles = [
      { id: 'done', locale: 'es', status: 'published' },
      { id: 'done', locale: 'en', status: 'published' },
      { id: 'unfinished', locale: 'es', status: 'published' },
    ];
    expect(
      selectPendingTopics(plan, articles, 2, strategy).map((t: any) => t.id),
    ).toEqual(['unfinished']);
  });
});
