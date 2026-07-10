export const SBP2021_PRE35 = [
  { minGA: 0, maxGA: 27.999, photo: [5, 6], exch: [11, 14] },
  { minGA: 28.0, maxGA: 29.999, photo: [6, 8], exch: [12, 14] },
  { minGA: 30.0, maxGA: 31.999, photo: [8, 10], exch: [13, 16] },
  { minGA: 32.0, maxGA: 33.999, photo: [10, 12], exch: [15, 18] },
  { minGA: 34.0, maxGA: 34.999, photo: [10, 12], exch: [17, 19] }
];

export const SBP2021_GE35 = {
  groups: [
    {
      name: '35-37 semanas',
      minGA: 35,
      maxGA: 37.999,
      rows: [
        { minH: 24, maxH: 35.999, photo: 8, exch: 15 },
        { minH: 36, maxH: 47.999, photo: 9.5, exch: 16 },
        { minH: 48, maxH: 71.999, photo: 11, exch: 18 },
        { minH: 72, maxH: 95.999, photo: 13, exch: 20 },
        { minH: 96, maxH: 119.999, photo: 14, exch: 21 },
        { minH: 120, maxH: 168, photo: 15, exch: 21 }
      ]
    },
    {
      name: '≥38 semanas',
      minGA: 38,
      maxGA: 99,
      rows: [
        { minH: 24, maxH: 35.999, photo: 10, exch: 18 },
        { minH: 36, maxH: 47.999, photo: 11.5, exch: 20 },
        { minH: 48, maxH: 71.999, photo: 13, exch: 21 },
        { minH: 72, maxH: 95.999, photo: 15, exch: 22 },
        { minH: 96, maxH: 119.999, photo: 16, exch: 23 },
        { minH: 120, maxH: 168, photo: 17, exch: 24 }
      ]
    }
  ]
};

export function pickThreshold(range, hasRisk) {
  return hasRisk ? range[0] : range[1];
}

export function findPre35Row(gaFloat) {
  return SBP2021_PRE35.find(
    (row) => gaFloat >= row.minGA && gaFloat <= row.maxGA
  ) || null;
}

export function findGE35Row(gaFloat, hours) {
  const group = SBP2021_GE35.groups.find(
    (g) => gaFloat >= g.minGA && gaFloat <= g.maxGA
  );

  if (!group) return null;

  const row = group.rows.find(
    (r) => hours >= r.minH && hours <= r.maxH
  );

  return row ? { group, row } : null;
}
