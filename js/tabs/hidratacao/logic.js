export function calculateHollidaySegar({
  weightKg,
  sodium,
  potassium,
  chloride,
  glucose,
  electrolyteMode
}) {
  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    return { error: 'Informe peso (kg).' };
  }

  let volume24h = 0;

  if (weightKg <= 10) {
    volume24h = 100 * weightKg;
  } else if (weightKg <= 20) {
    volume24h = 1000 + 50 * (weightKg - 10);
  } else {
    volume24h = 1500 + 20 * (weightKg - 20);
  }

  const rateMlH = volume24h / 24;

  return {
    volume24h,
    rateMlH,
    sodium,
    potassium,
    chloride,
    glucose,
    electrolyteMode
  };
}

export function calculateVIG({
  weightKg,
  targetMlKgH,
  sodium,
  potassium,
  chloride,
  glucose
}) {
  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    return { error: 'Informe peso (kg).' };
  }

  if (!Number.isFinite(targetMlKgH) || targetMlKgH <= 0) {
    return { error: 'Informe VIG alvo (mL/kg/h).' };
  }

  const rateMlH = targetMlKgH * weightKg;
  const volume24h = rateMlH * 24;

  return {
    rateMlH,
    volume24h,
    sodium,
    potassium,
    chloride,
    glucose
  };
}

export function calculateSchwartz({
  creatinineMgDl,
  heightCm
}) {
  if (!Number.isFinite(creatinineMgDl) || creatinineMgDl <= 0) {
    return { error: 'Informe creatinina.' };
  }

  if (!Number.isFinite(heightCm) || heightCm <= 0) {
    return { error: 'Informe estatura (cm).' };
  }

  const eGFR = (0.413 * heightCm) / creatinineMgDl;

  return { eGFR };
}
