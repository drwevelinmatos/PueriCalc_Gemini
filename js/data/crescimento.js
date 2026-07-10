export const REF_CRESCIMENTO = {
  peso_g_dia: [
    { minM: 0, maxM: 3, ref: '20–30 g/dia (placeholder)' },
    { minM: 4, maxM: 6, ref: '20 g/dia (placeholder)' },
    { minM: 7, maxM: 9, ref: '15 g/dia (placeholder)' },
    { minM: 10, maxM: 12, ref: '10 g/dia (placeholder)' }
  ],
  pc_cm_mes: [
    { minM: 0, maxM: 3, ref: '≈ 2 cm/mês (placeholder)' },
    { minM: 4, maxM: 6, ref: '≈ 1 cm/mês (placeholder)' },
    { minM: 7, maxM: 12, ref: '≈ 0,5 cm/mês (placeholder)' }
  ],
  alt_cm_ano: [
    { minM: 0, maxM: 12, ref: '≈ 25 cm/ano (placeholder)' },
    { minM: 12, maxM: 24, ref: '≈ 12 cm/ano (placeholder)' },
    { minM: 24, maxM: 48, ref: '≈ 7–8 cm/ano (placeholder)' }
  ]
};

export function pickGrowthReference(arr, ageMonths) {
  const item = arr.find((x) => ageMonths >= x.minM && ageMonths <= x.maxM);
  return item ? item.ref : 'Sem referência configurada para esta idade.';
}
