// tabs/hidratacao/logic.js

export function calcHollidaySegarBase(pesoKg) {
  if (pesoKg <= 10) return 100 * pesoKg;
  if (pesoKg <= 20) return 1000 + 50 * (pesoKg - 10);
  return 1500 + 20 * (pesoKg - 20);
}

// 1A. Método Tradicional (SG 5% + mEq/kg)
export function calcHolTradicional(p) {
  const volTotal = calcHollidaySegarBase(p.peso) * (p.pctHol / 100);
  
  // Cálculo puro por peso (mEq/kg -> mL)
  const nacl20_vol = (p.naKg * p.peso) / 3.4; // 1 mL NaCl 20% = 3.4 mEq
  const kcl19_vol = (p.kKg * p.peso) / 2.5; // 1 mL KCl 19.1% = 2.5 mEq
  const ca_vol = p.caKg * p.peso; // Gluconato Ca 10%
  const mg_vol = (p.mgKg * p.peso) / 0.8; // MgSO4 10% = 0.8 mEq/mL
  
  // Solvente é SG 5%
  const sg5_vol = volTotal - (nacl20_vol + kcl19_vol + ca_vol + mg_vol);

  return {
    volTotal, nacl20_vol, kcl19_vol, ca_vol, mg_vol, sg5_vol
  };
}

// 1B. Método Planilha (Água Destilada + mEq/L)
export function calcHolPlanilha(p) {
  const volTotal = calcHollidaySegarBase(p.peso) * (p.pctHol / 100);
  
  // Cálculo por Concentração no Litro (mEq/L -> mL)
  const nacl20_vol = (p.naL * (volTotal / 1000)) / 3.4;
  const kcl19_vol = (p.kL * (volTotal / 1000)) / 2.5;
  const ca_vol = p.caKg * p.peso;
  const mg_vol = (p.mgKg * p.peso) / 0.8;
  const glic_vol = (p.glicKg * p.peso) / 0.5; // Glicose 50% = 0.5 g/mL
  
  // Solvente é Água Destilada
  const ad_vol = volTotal - (nacl20_vol + kcl19_vol + ca_vol + mg_vol + glic_vol);

  return {
    volTotal, nacl20_vol, kcl19_vol, ca_vol, mg_vol, glic_vol, ad_vol
  };
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

  return {
    volTotal, glicoseG, glic_vol, nacl20_vol, kcl19_vol, ca_vol, mg_vol, ad_vol
  };
}

export function calcMisturaSG(vol, alvo, sgA, sgB) {
  const cLow = Math.min(sgA, sgB);
  const cHigh = Math.max(sgA, sgB);
  
  if (alvo < cLow || alvo > cHigh) return { error: 'Concentração alvo fora do intervalo possível das soluções disponíveis.' };
  
  const vHigh = vol * (alvo - cLow) / (cHigh - cLow);
  const vLow = vol - vHigh;
  
  return { vLow, vHigh, cLow, cHigh };
}

export function calcAguaLivre(peso, naAtual, naAlvo) {
  if (naAtual <= naAlvo) return { error: 'Sódio atual não indica déficit de água livre (Na Atual ≤ Na Alvo).' };
  const tbw = peso * 0.6; 
  const deficitL = tbw * ((naAtual / naAlvo) - 1);
  return { deficitL, deficitMl: deficitL * 1000 };
}
