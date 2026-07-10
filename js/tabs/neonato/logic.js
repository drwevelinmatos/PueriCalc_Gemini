import { parseDate, diffDays, weeksDaysFromTotalDays } from '../../utils/dates.js';
import {
  INTERGROWTH_P10_P90,
  igKey,
  pickIntergrowthDomain,
  classifyPIGAIGGIG
} from '../../data/intergrowth.js';
import {
  findPre35Row,
  findGE35Row,
  pickThreshold
} from '../../data/ictericia.js';

export function calculateIGAndDPP({
  mode,
  dumDate,
  usgDate,
  usgWeeks,
  usgDays,
  calcDate
}) {
  const targetDate = parseDate(calcDate);
  if (!targetDate) return { error: 'Informe a data para cálculo.' };

  let dpp = null;
  let gestationalDays = null;

  if (mode === 'dum') {
    const dum = parseDate(dumDate);
    if (!dum) return { error: 'Informe a data da DUM.' };

    gestationalDays = diffDays(dum, targetDate);
    dpp = new Date(dum.getTime());
    dpp.setDate(dpp.getDate() + 280);
  } else {
    const usg = parseDate(usgDate);
    if (!usg) return { error: 'Informe a data do USG.' };
    if (!Number.isFinite(usgWeeks) || usgWeeks < 0) return { error: 'Informe semanas do USG.' };
    if (!Number.isFinite(usgDays) || usgDays < 0 || usgDays > 6) return { error: 'Dias do USG deve estar entre 0 e 6.' };

    const gestDaysAtUSG = usgWeeks * 7 + usgDays;
    const estimatedDUM = new Date(usg.getTime());
    estimatedDUM.setDate(estimatedDUM.getDate() - gestDaysAtUSG);

    gestationalDays = diffDays(estimatedDUM, targetDate);
    dpp = new Date(estimatedDUM.getTime());
    dpp.setDate(dpp.getDate() + 280);
  }

  if (gestationalDays < 0) {
    return { error: 'A data para cálculo é anterior ao início estimado da gestação.' };
  }

  const wd = weeksDaysFromTotalDays(gestationalDays);

  return {
    gestationalDays,
    weeks: wd.weeks,
    days: wd.days,
    dpp
  };
}

export function calculateCorrectedPostnatalIG({
  birthIGWeeks,
  birthIGDays,
  birthDate,
  calcDate
}) {
  const birth = parseDate(birthDate);
  const target = parseDate(calcDate);

  if (!Number.isFinite(birthIGWeeks) || birthIGWeeks < 0) {
    return { error: 'Informe IG ao nascimento (semanas).' };
  }

  if (!Number.isFinite(birthIGDays) || birthIGDays < 0 || birthIGDays > 6) {
    return { error: 'Dias ao nascimento deve estar entre 0 e 6.' };
  }

  if (!birth) return { error: 'Informe a data de nascimento.' };
  if (!target) return { error: 'Informe a data para cálculo.' };

  const postnatalDays = diffDays(birth, target);
  if (postnatalDays < 0) {
    return { error: 'Data para cálculo não pode ser anterior ao nascimento.' };
  }

  const totalIGDays = birthIGWeeks * 7 + birthIGDays + postnatalDays;
  const wd = weeksDaysFromTotalDays(totalIGDays);

  return {
    postnatalDays,
    totalIGDays,
    weeks: wd.weeks,
    days: wd.days
  };
}

export function calculateIntergrowthClassification({
  sex,
  weeks,
  days,
  weightGrams
}) {
  if (!Number.isFinite(weeks) || weeks <= 0) {
    return { error: 'Informe IG (semanas).' };
  }

  if (!Number.isFinite(days) || days < 0 || days > 6) {
    return { error: 'Dias deve estar entre 0 e 6.' };
  }

  if (!Number.isFinite(weightGrams) || weightGrams <= 0) {
    return { error: 'Informe peso ao nascer (g).' };
  }

  const key = igKey(weeks, days);
  const domainPick = pickIntergrowthDomain(weeks, days);
  if (domainPick.error) return { error: domainPick.error };

  const sexKey = sex === 'M' ? 'boys' : 'girls';
  const row = INTERGROWTH_P10_P90[sexKey][domainPick.domain][key];

  if (!row) {
    return { error: `Sem dados INTERGROWTH para IG ${key} (${sex}).` };
  }

  const classification = classifyPIGAIGGIG(weightGrams, row.p10, row.p90);

  return {
    key,
    domain: domainPick.domain,
    p10Kg: row.p10,
    p90Kg: row.p90,
    classification
  };
}

export function calculateIctericiaSBP2021({
  gaWeeks,
  hours,
  bt,
  hasRisk
}) {
  if (!Number.isFinite(gaWeeks) || gaWeeks <= 0) {
    return { error: 'Informe IG (semanas).' };
  }

  if (!Number.isFinite(hours) || hours < 0) {
    return { error: 'Informe horas de vida.' };
  }

  if (!Number.isFinite(bt) || bt < 0) {
    return { error: 'Informe bilirrubina total (mg/dL).' };
  }

  const gaFloat = gaWeeks;

  if (gaFloat < 35) {
    const row = findPre35Row(gaFloat);

    if (!row) {
      return { error: 'Sem referência SBP 2021 (<35 semanas) para esta IG.' };
    }

    const photoThreshold = pickThreshold(row.photo, hasRisk);
    const exchThreshold = pickThreshold(row.exch, hasRisk);

    let recommendation = 'Acompanhar e repetir BT conforme clínica.';

    if (bt >= exchThreshold) {
      recommendation = 'Exsanguineotransfusão: INDICAÇÃO. Manter fototerapia intensiva enquanto prepara EST.';
    } else if (bt >= photoThreshold) {
      recommendation = 'Fototerapia: INDICAÇÃO.';
    }

    return {
      group: 'pre35',
      photoThreshold,
      exchThreshold,
      riskApplied: hasRisk,
      recommendation,
      guidance: [
        hasRisk
          ? 'Fator de risco marcado: aplicado o menor valor de corte para RN pré-termo.'
          : 'Sem fator de risco marcado: aplicado o maior valor da faixa de corte.',
        '',
        'Fatores de risco considerados para RN <35 semanas:',
        'Doença hemolítica Rh/ABO/outros antígenos; deficiência de G-6-PD; albumina sérica <2,5 g/dL; rápido aumento da BT; instabilidade clínica com pH <7,15, ventilação mecânica, sepse/meningite ou apneia/bradicardia com necessidade de ventilação ou drogas vasoativas nas últimas 24h.',
        '',
        'Orientações:',
        '– Indicar EST se, apesar da fototerapia de alta intensidade na maior superfície corporal, a BT continuar aumentando.',
        '– Indicar EST sempre que houver sinais de encefalopatia bilirrubínica.',
        '– Indicar EST se BT estiver 5 mg/dL acima dos níveis referidos.',
        '– RN ≤1000 g ou IG ≤26 semanas: indicar fototerapia profilática até 12 horas após o nascimento com irradiância espectral padrão de 8–10 mW/cm²/nm.',
        '– Se houver elevação da BT, aumentar a superfície corporal submetida à fototerapia; se BT continuar aumentando, elevar a irradiância espectral.',
        '– Evitar irradiância de alta intensidade em extremo baixo peso ao nascer.'
      ].join('\n')
    };
  }

  const hit = findGE35Row(gaFloat, hours);

  if (!hit) {
    return {
      group: 'ge35-unfilled',
      recommendation: 'Sem referência preenchida para essa idade em horas/IG.'
    };
  }

  const riskReduction = hasRisk ? 2 : 0;

  const photoThreshold = Math.max(0, hit.row.photo - riskReduction);
  const exchThreshold = Math.max(0, hit.row.exch - riskReduction);

  let recommendation = 'Acompanhar e repetir BT conforme risco clínico.';

  if (bt >= exchThreshold) {
    recommendation = 'Exsanguineotransfusão: INDICAÇÃO. Iniciar imediatamente fototerapia de alta intensidade enquanto prepara EST.';
  } else if (bt >= photoThreshold) {
    recommendation = 'Fototerapia: INDICAÇÃO.';
  }

  return {
    group: 'ge35',
    igGroupName: hit.group.name,
    photoThreshold,
    exchThreshold,
    originalPhotoThreshold: hit.row.photo,
    originalExchThreshold: hit.row.exch,
    riskApplied: hasRisk,
    riskReduction,
    recommendation,
    guidance: [
      hasRisk
        ? 'Fator de risco marcado: reduzidos 2 mg/dL dos limiares de fototerapia e EST.'
        : 'Sem fator de risco marcado: usados os limiares originais da tabela.',
      '',
      'Fatores de risco considerados para RN ≥35 semanas:',
      'Doença hemolítica Rh/ABO/outros antígenos; deficiência de G-6-PD; asfixia; letargia; instabilidade da temperatura; sepse; acidose; albumina <3 g/dL.',
      '',
      'Orientações:',
      '– BT entre 17 e 19 mg/dL: iniciar fototerapia de alta intensidade e dosar BT após 4–6 horas.',
      '– BT entre 20 e 25 mg/dL: iniciar fototerapia de alta intensidade e dosar BT em 3–4 horas.',
      '– BT >25 mg/dL: iniciar fototerapia de alta intensidade e dosar BT em 2–3 horas enquanto material de EST é preparado.',
      '– Se houver indicação de EST, iniciar imediatamente fototerapia de alta intensidade, repetir BT em 2–3 horas e reavaliar indicação de EST.',
      '– A EST deve ser realizada imediatamente se houver sinais de encefalopatia bilirrubínica ou se BT estiver 5 mg/dL acima dos níveis referidos.'
    ].join('\n')
  };
}
