export function parseDate(value) {
  if (!value) return null;
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function diffDays(d1, d2) {
  return Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

export function weeksDaysFromTotalDays(totalDays) {
  const weeks = Math.floor(totalDays / 7);
  const days = totalDays % 7;
  return { weeks, days };
}
