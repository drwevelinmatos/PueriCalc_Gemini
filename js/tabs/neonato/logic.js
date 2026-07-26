// tabs/neonato/logic.js
import { parseDate, diffDays, weeksDaysFromTotalDays } from '../../utils/dates.js';
import {
  INTERGROWTH_P10_P90,
  igKey,
  pickIntergrowthDomain,
  classifyPIGAIGGIG
} from '../../data/intergrowth.js';

export function calculateIGAndDPP({ mode, dumDate, usgDate, usgWeeks, usgDays, calcDate }) {
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

  if (gestationalDays < 0) return { error: 'A data para cálculo é anterior ao início estimado da gestação.' };

  const wd = weeksDaysFromTotalDays(gestationalDays);
  return { gestationalDays, weeks: wd.weeks, days: wd.days, dpp };
}

export function calculateCorrectedPostnatalIG({ birthIGWeeks, birthIGDays, birthDate, calcDate }) {
  const birth = parseDate(birthDate);
  const target = parseDate(calcDate);

  if (!Number.isFinite(birthIGWeeks) || birthIGWeeks < 0) return { error: 'Informe IG ao nascimento (semanas).' };
  if (!Number.isFinite(birthIGDays) || birthIGDays < 0 || birthIGDays > 6) return { error: 'Dias ao nascimento deve estar entre 0 e 6.' };
  if (!birth) return { error: 'Informe a data de nascimento.' };
  if (!target) return { error: 'Informe a data para cálculo.' };

  const postnatalDays = diffDays(birth, target);
  if (postnatalDays < 0) return { error: 'Data para cálculo não pode ser anterior ao nascimento.' };

  const totalIGDays = birthIGWeeks * 7 + birthIGDays + postnatalDays;
  const wd = weeksDaysFromTotalDays(totalIGDays);
  return { postnatalDays, totalIGDays, weeks: wd.weeks, days: wd.days };
}

export function calculateIntergrowthClassification({ sex, weeks, days, weightGrams }) {
  if (!Number.isFinite(weeks) || weeks <= 0) return { error: 'Informe IG (semanas).' };
  if (!Number.isFinite(days) || days < 0 || days > 6) return { error: 'Dias deve estar entre 0 e 6.' };
  if (!Number.isFinite(weightGrams) || weightGrams <= 0) return { error: 'Informe peso ao nascer (g).' };

  const key = igKey(weeks, days);
  const domainPick = pickIntergrowthDomain(weeks, days);
  if (domainPick.error) return { error: domainPick.error };

  const sexKey = sex === 'M' ? 'boys' : 'girls';
  const row = INTERGROWTH_P10_P90[sexKey][domainPick.domain][key];

  if (!row) return { error: `Sem dados INTERGROWTH para IG ${key} (${sex}).` };

  const classification = classifyPIGAIGGIG(weightGrams, row.p10, row.p90);
  return { key, domain: domainPick.domain, p10Kg: row.p10, p90Kg: row.p90, classification };
}

// =========================================================================
// LÓGICA DE PERDA DE PESO (NEWT TOOL)
// =========================================================================
export function calcularRiscoPerdaPeso(horasDeVida, viaParto, tipoAlim, perdaPerc) {
    let limites = null;
    let alerta = "";
    let padraoUsado = "";

    // 1. Lógica rigorosa do NEWT:
    // Se horas <= 96 E bebê não está em mista -> Usa curva "First 3-4 days"
    // Se horas > 96 OU bebê está em mista -> Usa curva "First 30 days"

    if (horasDeVida <= 96 && tipoAlim !== 'mista') {
        padraoUsado = "Avaliação baseada na curva de Primeiros 3-4 Dias.";
        if (tipoAlim === 'lme') {
            limites = viaParto === 'vaginal'
                ? { p50: 5.0, p75: 7.0, p90: 8.5, p95: 10.0 }
                : { p50: 6.0, p75: 8.0, p90: 10.0, p95: 12.0 };
        } else if (tipoAlim === 'formula') {
            limites = viaParto === 'vaginal'
                ? { p50: 3.0, p75: 5.0, p90: 7.0, p95: 9.0 }
                : { p50: 4.0, p75: 6.0, p90: 8.0, p95: 10.0 };
        }
    } 
    else if (horasDeVida <= 720) { // Até 30 dias de vida
        padraoUsado = "Avaliação baseada na curva de Primeiros 30 Dias.";
        if (tipoAlim === 'mista' && horasDeVida <= 96) {
            alerta = " <br><i style='font-size:11px; font-weight:normal;'>(Bebês em aleitamento misto são avaliados pela curva de 30 dias mesmo no curto prazo)</i>";
        }
        // Curva genérica/mista para 30 dias
        limites = viaParto === 'vaginal'
            ? { p50: 2.0, p75: 4.0, p90: 6.0, p95: 8.0 }
            : { p50: 3.0, p75: 5.0, p90: 7.0, p95: 9.0 };
    } 
    else {
        return { texto: "Idade excede 30 dias. Fora do padrão NEWT.", cor: "#7f8c8d", padrao: "" };
    }

    let textoRisco = "";
    let corRisco = "";

    if (perdaPerc >= limites.p95) { textoRisco = "≥ Percentil 95 (Alerta Vermelho)"; corRisco = "#c0392b"; }
    else if (perdaPerc >= limites.p90) { textoRisco = "Percentil 90-95 (Risco Alto)"; corRisco = "#e67e22"; }
    else if (perdaPerc >= limites.p75) { textoRisco = "Percentil 75-90 (Atenção)"; corRisco = "#f39c12"; }
    else if (perdaPerc >= limites.p50) { textoRisco = "Percentil 50-75 (Fisiológico)"; corRisco = "#27ae60"; }
    else { textoRisco = "< Percentil 50 (Excelente)"; corRisco = "#27ae60"; }

    return { texto: `${textoRisco}${alerta}`, cor: corRisco, padrao: padraoUsado };
}

// =========================================================================
// LÓGICA ICTERÍCIA (SBP 2021)
// =========================================================================
export function calcularCondutaIctericiaNova(horasVida, bt, ig, temFatorRisco, sinaisEncefalopatia) {
    let limPhoto = 0;
    let limEst = 0;

    if(ig === 'ge_38' || ig === '35_37') {
        let basePhoto, baseEst;
        if(horasVida <= 24) { basePhoto = ig === 'ge_38' ? 10 : 8; baseEst = ig === 'ge_38' ? 18 : 15; }
        else if(horasVida <= 36) { basePhoto = ig === 'ge_38' ? 11.5 : 9.5; baseEst = ig === 'ge_38' ? 20 : 16; }
        else if(horasVida <= 48) { basePhoto = ig === 'ge_38' ? 13 : 11; baseEst = ig === 'ge_38' ? 21 : 17; }
        else if(horasVida <= 72) { basePhoto = ig === 'ge_38' ? 15 : 13; baseEst = ig === 'ge_38' ? 22 : 18; }
        else if(horasVida <= 96) { basePhoto = ig === 'ge_38' ? 16 : 14; baseEst = ig === 'ge_38' ? 23 : 20; }
        else { basePhoto = ig === 'ge_38' ? 17 : 15; baseEst = ig === 'ge_38' ? 24 : 21; }

        limPhoto = temFatorRisco ? basePhoto - 2 : basePhoto;
        limEst = baseEst;
    } else {
        switch(ig) {
            case '34': limPhoto = temFatorRisco ? 10 : 12; limEst = temFatorRisco ? 17 : 19; break;
            case '32_33': limPhoto = temFatorRisco ? 10 : 12; limEst = temFatorRisco ? 15 : 18; break;
            case '30_31': limPhoto = temFatorRisco ? 8 : 10; limEst = temFatorRisco ? 13 : 16; break;
            case '28_29': limPhoto = temFatorRisco ? 6 : 8; limEst = temFatorRisco ? 12 : 14; break;
            case 'lt_28': limPhoto = temFatorRisco ? 5 : 6; limEst = temFatorRisco ? 11 : 14; break;
        }
    }

    let classificacao = "", conduta = "", suspensao = "", novaColeta = "";

    if(sinaisEncefalopatia || bt >= limEst || bt >= (limEst - 5)) {
        classificacao = `<span style="color:#c0392b; font-weight:bold;">Exsanguineotransfusão Indicada / Risco Extremo</span>`;
        conduta = "<b>Conduta:</b> Iniciar IMEDIATAMENTE fototerapia intensiva (alta irradiância na maior superfície corporal). Preparar material para Exsanguineotransfusão.";
        novaColeta = "<b>Nova Coleta:</b> Repetir BT em 2 a 3 horas e reavaliar.";
    } else if(bt >= limPhoto) {
        classificacao = `Indicação de Fototerapia (Limiar: ${limPhoto} mg/dL)`;
        conduta = "<b>Tratamento:</b> Iniciar Fototerapia. Se BT próximo ao limite de EST, usar fototerapia intensiva dupla.";
        
        if(bt > 25) novaColeta = "<b>Nova Coleta:</b> Repetir BT em 2 a 3 horas.";
        else if(bt >= 20 && bt <= 25) novaColeta = "<b>Nova Coleta:</b> Repetir BT em 3 a 4 horas.";
        else if(bt >= 17 && bt <= 19) novaColeta = "<b>Nova Coleta:</b> Repetir BT em 4 a 6 horas.";
        else novaColeta = "<b>Nova Coleta:</b> Repetir BT em 12-24 horas, ou conforme evolução clínica.";
    } else {
        classificacao = `Normal para a faixa (Limiar Photo: ${limPhoto} mg/dL | Limiar EST: ${limEst} mg/dL)`;
        conduta = "<b>Tratamento:</b> Sem indicação de fototerapia no momento. Manter aleitamento materno e observação clínica.";
        novaColeta = "<b>Nova Coleta:</b> Acompanhamento ambulatorial ou reavaliação se progressão da icterícia.";
    }

    if (horasVida <= 120) { 
        if (ig === 'ge_38') suspensao = "<b>Suspensão da Foto:</b> Quando BT &le; 11.5 mg/dL.";
        else if (ig === '35_37') suspensao = "<b>Suspensão da Foto:</b> Quando BT &le; 9.5 mg/dL.";
        else suspensao = `<b>Suspensão da Foto:</b> Quando BT for 2 mg/dL inferior ao nível de indicação de fototerapia.`;
    } else { 
        if (ig === 'ge_38' || ig === '35_37') suspensao = "<b>Suspensão da Foto:</b> Quando BT &le; 14 mg/dL.";
        else suspensao = `<b>Suspensão da Foto:</b> Quando BT for 2 mg/dL inferior ao nível de indicação para idade corrigida.`;
    }
    
    if(bt >= limPhoto) {
        suspensao += "<br><i style='font-size:11px; color:#7f8c8d;'>Nota: Após suspensão em RN &ge;35 sem com fatores de risco, manter observação por 12h antes da alta para avaliar rebote.</i>";
    } else { suspensao = ""; }

    return { classificacao, conduta, novaColeta, suspensao };
}
