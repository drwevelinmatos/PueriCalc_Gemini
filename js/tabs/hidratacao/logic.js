// tabs/hidratacao/logic.js

export function calcHollidaySegarBase(pesoKg) {
  if (pesoKg <= 10) return 100 * pesoKg;
  if (pesoKg <= 20) return 1000 + 50 * (pesoKg - 10);
  return 1500 + 20 * (pesoKg - 20);
}

// 1A. Método Tradicional (SG 5% + mEq/kg)
export function calcHolTradicional(p) {
  const volTotal = calcHollidaySegarBase(p.peso) * (p.pctHol / 100);
  
  const nacl20_vol = (p.naKg * p.peso) / 3.4; // 1 mL NaCl 20% = 3.4 mEq
  const kcl19_vol = (p.kKg * p.peso) / 2.5; // 1 mL KCl 19.1% = 2.5 mEq
  const ca_vol = p.caKg * p.peso; // Gluconato Ca 10%
  const mg_vol = (p.mgKg * p.peso) / 0.8; // MgSO4 10% = 0.8 mEq/mL
  
  const sg5_vol = volTotal - (nacl20_vol + kcl19_vol + ca_vol + mg_vol);

  return { volTotal, nacl20_vol, kcl19_vol, ca_vol, mg_vol, sg5_vol };
}

// 1B. Método Planilha (Água Destilada + mEq/L)
export function calcHolPlanilha(p) {
  const volTotal = calcHollidaySegarBase(p.peso) * (p.pctHol / 100);
  
  const nacl20_vol = (p.naL * (volTotal / 1000)) / 3.4;
  const kcl19_vol = (p.kL * (volTotal / 1000)) / 2.5;
  const ca_vol = p.caKg * p.peso;
  const mg_vol = (p.mgKg * p.peso) / 0.8;
  const glic_vol = (p.glicKg * p.peso) / 0.5; // Glicose 50% = 0.5 g/mL
  
  const ad_vol = volTotal - (nacl20_vol + kcl19_vol + ca_vol + mg_vol + glic_vol);

  return { volTotal, nacl20_vol, kcl19_vol, ca_vol, mg_vol, glic_vol, ad_vol };
}

export function calcVIGCompleto(p) {
  const volTotal = p.volMlKgDia * p.peso;
  
  const glicoseG = (p.vig * p.peso * 1440) / 1000;
  const glic_vol = glicoseG / 0.5; 
  
  const nacl20_vol = (p.naMeqKg * p.peso) / 3.4;
  const kcl19_vol = (p.kMeqKg * p.peso) / 2.5;
  const ca_vol = p.caMlKg * p.peso;
  const mg_vol = (p.mgMeqKg * p.peso) / 0.8;
  
  const ad_vol = volTotal - (glic_vol + nacl20_vol + kcl19_vol + ca_vol + mg_vol);

  return { volTotal, glicoseG, glic_vol, nacl20_vol, kcl19_vol, ca_vol, mg_vol, ad_vol };
}

export function calcMisturaSG(vol, alvo, sgA, sgB) {
  const cLow = Math.min(sgA, sgB);
  const cHigh = Math.max(sgA, sgB);
  
  if (alvo < cLow || alvo > cHigh) return { error: 'Concentração alvo fora do intervalo possível das soluções disponíveis.' };
  
  const vHigh = vol * (alvo - cLow) / (cHigh - cLow);
  const vLow = vol - vHigh;
  
  return { vLow, vHigh, cLow, cHigh };
}

// 4. Central de Distúrbios Hidroeletrolíticos
export function calcDisturbios(p) {
  const { tipo, peso, perfil, naAtual, naAlvo, kDose } = p;
  
  if (!peso || peso <= 0) return { error: 'Peso inválido.' };

  // Constantes de Água Corporal Total (ACT)
  let actFator = 0.6;
  if (perfil === 'rn') actFator = 0.75;
  else if (perfil === 'adol_f') actFator = 0.5;

  const act = peso * actFator;

  if (tipo === 'hiponatremia') {
    if (!naAtual || !naAlvo) return { error: 'Preencha Na⁺ Atual e Alvo.' };
    if (naAtual >= naAlvo) return { error: 'O Na⁺ Atual já é maior ou igual ao Alvo.' };
    
    const deficitMeq = act * (naAlvo - naAtual);
    const nacl20Vol = deficitMeq / 3.4;
    
    // Regra da Hiponatremia Sintomática: 3 mL/kg de NaCl 3%
    const bolus3pct = 3 * peso; 
    const nacl3_nacl20 = bolus3pct * 0.15; // 15% de NaCl 20%
    const nacl3_ad = bolus3pct * 0.85; // 85% de Água Destilada / SG5%

    return { tipo, deficitMeq, nacl20Vol, bolus3pct, nacl3_nacl20, nacl3_ad };
  }
  
  if (tipo === 'hipernatremia') {
    if (!naAtual || !naAlvo) return { error: 'Preencha Na⁺ Atual e Alvo.' };
    if (naAtual <= naAlvo) return { error: 'O Na⁺ Atual já é menor ou igual ao Alvo.' };
    
    const deficitL = act * ((naAtual / naAlvo) - 1);
    return { tipo, deficitL, deficitMl: deficitL * 1000, actFator };
  }

  if (tipo === 'hipopotassemia') {
    if (!kDose || kDose <= 0) return { error: 'Preencha a dose de K⁺ (mEq/kg).' };
    const meqTotais = peso * kDose;
    const kcl19Vol = meqTotais / 2.5;
    // Volume mínimo para garantir diluição máxima de 40 mEq/L
    const volMinDiluicao = (meqTotais / 40) * 1000;
    
    return { tipo, meqTotais, kcl19Vol, volMinDiluicao };
  }

  if (tipo === 'hiperpotassemia') {
    const glucCa = peso * 0.5; 
    const glucCaMax = Math.min(peso * 1.0, 20); // Máx de 20 mL
    
    const insulina = peso * 0.1;
    const g50 = peso * 1; // 1 ml/kg G50% = 0.5 g/kg
    const g10 = peso * 5; // 5 ml/kg G10% = 0.5 g/kg
    
    const bicarb = peso * 1; 
    const furo = peso * 1; 

    return { tipo, glucCa, glucCaMax, insulina, g50, g10, bicarb, furo };
  }
}
