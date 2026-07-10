import { EMERG_DOSES, getEmergencyBase } from './shared.js';

export function calculateShock({ weightKg, ageYears, shockType }) {
  const base = getEmergencyBase(weightKg, ageYears);
  if (base.error) return base;

  const bolus = EMERG_DOSES.choque.bolus_mlkg * weightKg;

  const texts = {
    hipov: [
      'Choque hipovolêmico',
      `• Bolus inicial: ${bolus.toFixed(0)} mL`,
      '• Reavaliar perfusão, FC, PA, diurese e pulsos',
      '• Investigar perdas e corrigir causa'
    ],
    sept: [
      'Choque séptico',
      `• Expansão inicial: ${bolus.toFixed(0)} mL (conforme contexto clínico)`,
      '• Antibiótico precoce',
      '• Reavaliação frequente de perfusão e sinais de congestão',
      '• Considerar vasoativo conforme resposta'
    ],
    ana: [
      'Choque anafilático',
      `• Expansão inicial: ${bolus.toFixed(0)} mL`,
      '• Adrenalina IM conforme protocolo',
      '• Oxigênio, monitorização e suporte de via aérea',
      '• Considerar adjuvantes'
    ],
    card: [
      'Choque cardiogênico',
      '• Evitar expansão agressiva sem reavaliação',
      '• Considerar suporte inotrópico / vasoativo',
      '• Avaliar congestão, perfusão e ecocardiografia quando possível'
    ]
  };

  const selected = texts[shockType] || ['Choque não definido'];

  return {
    text: [
      ...selected,
      '',
      'ATUALIZAR_CONFORME_PROTOCOLO: inserir drogas, doses e limites da sua rotina.'
    ].join('\n')
  };
}
