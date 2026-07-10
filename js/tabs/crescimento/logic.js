import { parseDate, diffDays } from '../../utils/dates.js';
import { REF_CRESCIMENTO, pickGrowthReference } from '../../data/crescimento.js';

export function calculateGrowthVelocities({
  startDate,
  endDate,
  headCircInitial,
  headCircFinal,
  weightInitial,
  weightFinal,
  weightUnit,
  heightInitial,
  heightFinal,
  ageMonths
}) {
  const d1 = parseDate(startDate);
  const d2 = parseDate(endDate);

  if (!d1 || !d2) {
    return { error: 'Informe as datas inicial e final.' };
  }

  const days = diffDays(d1, d2);
  if (days <= 0) {
    return { error: 'A data final deve ser maior que a inicial.' };
  }

  if (!Number.isFinite(weightInitial) || !Number.isFinite(weightFinal)) {
    return { error: 'Informe pesos inicial e final.' };
  }

  if (!Number.isFinite(headCircInitial) || !Number.isFinite(headCircFinal)) {
    return { error: 'Informe PC inicial e final.' };
  }

  if (!Number.isFinite(heightInitial) || !Number.isFinite(heightFinal)) {
    return { error: 'Informe estatura inicial e final.' };
  }

  const weightInitialG = weightUnit === 'kg' ? weightInitial * 1000 : weightInitial;
  const weightFinalG = weightUnit === 'kg' ? weightFinal * 1000 : weightFinal;

  const weightGainPerDay = (weightFinalG - weightInitialG) / days;

  const months = days / 30.4375;
  const headCircPerMonth = (headCircFinal - headCircInitial) / months;

  const heightPerYear = (heightFinal - heightInitial) / (days / 365.25);

  const ageRef = Number.isFinite(ageMonths) ? ageMonths : null;

  return {
    days,
    totalWeightDeltaG: weightFinalG - weightInitialG,
    weightGainPerDay,
    totalHeadCircDelta: headCircFinal - headCircInitial,
    headCircPerMonth,
    totalHeightDelta: heightFinal - heightInitial,
    heightPerYear,
    references: ageRef === null ? null : {
      peso: pickGrowthReference(REF_CRESCIMENTO.peso_g_dia, ageRef),
      pc: pickGrowthReference(REF_CRESCIMENTO.pc_cm_mes, ageRef),
      altura: pickGrowthReference(REF_CRESCIMENTO.alt_cm_ano, ageRef)
    }
  };
}

export function calculateParentalTarget({
  fatherHeight,
  motherHeight,
  sex,
  currentHeight,
  chronologicalAge,
  boneAge
}) {
  if (!Number.isFinite(fatherHeight) || fatherHeight <= 0) {
    return { error: 'Informe altura do pai.' };
  }

  if (!Number.isFinite(motherHeight) || motherHeight <= 0) {
    return { error: 'Informe altura da mãe.' };
  }

  if (!Number.isFinite(currentHeight) || currentHeight <= 0) {
    return { error: 'Informe altura atual.' };
  }

  if (!Number.isFinite(chronologicalAge) || chronologicalAge < 0) {
    return { error: 'Informe idade cronológica.' };
  }

  const targetHeight =
    sex === 'M'
      ? (fatherHeight + motherHeight + 13) / 2
      : (fatherHeight + motherHeight - 13) / 2;

  const minExpected = targetHeight - 8.5;
  const maxExpected = targetHeight + 8.5;
  const withinRange = currentHeight >= minExpected && currentHeight <= maxExpected;
  const delta = currentHeight - targetHeight;

  let boneAgeDiff = null;
  if (Number.isFinite(boneAge) && boneAge > 0) {
    boneAgeDiff = boneAge - chronologicalAge;
  }

  return {
    targetHeight,
    minExpected,
    maxExpected,
    withinRange,
    delta,
    boneAge: Number.isFinite(boneAge) && boneAge > 0 ? boneAge : null,
    boneAgeDiff
  };
}
