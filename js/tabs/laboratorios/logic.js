export function analyzeGasometry({
  pH,
  pCO2,
  hco3,
  sodium,
  chloride,
  albumin
}) {
  if (!Number.isFinite(pH)) {
    return { error: 'Informe pH.' };
  }

  if (!Number.isFinite(pCO2)) {
    return { error: 'Informe pCO2.' };
  }

  if (!Number.isFinite(hco3)) {
    return { error: 'Informe HCO3-.' };
  }

  let primaryDisorder = 'Indeterminado';
  let compensation = 'Avaliação de compensação não implementada.';
  let anionGap = null;
  let correctedAnionGap = null;

  if (pH < 7.35) {
    if (hco3 < 22) primaryDisorder = 'Acidose metabólica';
    else if (pCO2 > 45) primaryDisorder = 'Acidose respiratória';
  } else if (pH > 7.45) {
    if (hco3 > 26) primaryDisorder = 'Alcalose metabólica';
    else if (pCO2 < 35) primaryDisorder = 'Alcalose respiratória';
  } else {
    primaryDisorder = 'pH dentro da faixa de referência; considerar distúrbio compensado ou misto';
  }

  if (Number.isFinite(sodium) && Number.isFinite(chloride)) {
    anionGap = sodium - (chloride + hco3);

    if (Number.isFinite(albumin)) {
      correctedAnionGap = anionGap + 2.5 * (4 - albumin);
    }
  }

  let interpretation = [
    `Distúrbio principal: ${primaryDisorder}`,
    compensation
  ];

  if (anionGap !== null) {
    interpretation.push(`Ânion gap: ${anionGap.toFixed(1)}`);
  }

  if (correctedAnionGap !== null) {
    interpretation.push(`Ânion gap corrigido pela albumina: ${correctedAnionGap.toFixed(1)}`);
  }

  interpretation.push('Conduta orientativa: correlacionar com quadro clínico e protocolo institucional.');

  return {
    primaryDisorder,
    interpretation: interpretation.join('\n')
  };
}

export function convertLabValue({
  factor,
  value
}) {
  if (!Number.isFinite(value)) {
    return { error: 'Informe o valor para converter.' };
  }

  if (!Number.isFinite(factor) || factor <= 0) {
    return { error: 'Fator de conversão inválido.' };
  }

  return { converted: value * factor };
}
