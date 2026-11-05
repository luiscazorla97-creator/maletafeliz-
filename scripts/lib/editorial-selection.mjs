// Reservation only: this function neither writes articles nor changes a scheduler.
export function selectPendingTopics(plan, articles, count, strategy) {
  const complete = new Set(
    plan
      .filter((t) =>
        ['es', 'en'].every((lang) =>
          articles.some(
            (a) =>
              a.id === t.id && a.locale === lang && a.status === 'published',
          ),
        ),
      )
      .map((t) => t.id),
  );
  const pending = plan.filter((t) => !complete.has(t.id));
  const selected = [];
  if (strategy?.enabled && strategy.priorityCountries?.length) {
    const countries = strategy.priorityCountries;
    const lastPublished = (id) =>
      Math.max(
        0,
        ...articles
          .filter(
            (a) =>
              complete.has(a.id) &&
              plan.find((t) => t.id === a.id)?.countryId === id,
          )
          .map((a) => Date.parse(a.publishedAt) || 0),
      );
    const progress = (c) =>
      plan.filter((t) => t.countryId === c.id && complete.has(t.id)).length /
      c.targetOriginals;
    const order = [...countries].sort(
      (a, b) =>
        lastPublished(a.id) - lastPublished(b.id) || progress(a) - progress(b),
    );
    const rank = new Map((strategy.backlog || []).map((t, i) => [t.id, i]));
    const candidates = pending
      .filter((t) => countries.some((c) => c.id === t.countryId))
      .sort(
        (a, b) => (rank.get(a.id) ?? Infinity) - (rank.get(b.id) ?? Infinity),
      );
    while (selected.length < count) {
      let added = false;
      for (const country of order) {
        const topic = candidates.find(
          (t) => t.countryId === country.id && !selected.includes(t),
        );
        if (topic && selected.length < count) {
          selected.push(topic);
          added = true;
        }
      }
      if (!added) break;
    }
    return selected;
  }
  // Backward-compatible fixture/initial-launch behaviour when no strategy exists.
  for (const continent of ['america', 'europe', 'asia', 'africa', 'oceania']) {
    const topic = pending.find(
      (t) => t.continent === continent && !selected.includes(t),
    );
    if (topic && selected.length < count) selected.push(topic);
  }
  for (const topic of pending)
    if (selected.length < count && !selected.includes(topic))
      selected.push(topic);
  return selected;
}
