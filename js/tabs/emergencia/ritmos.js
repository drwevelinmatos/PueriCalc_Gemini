import { getEmergencyBase } from './shared.js';

export function calculateRhythmEmergency({ weightKg, ageYears, subtype }) {
  const base = getEmergencyBase(weightKg, ageYears);
  if (base.error) return base;

  if (subtype === 'chocaveis') {
    return {
      text: [
        'Distúrbios de ritmos: ritmos chocáveis',
        `Peso-base: ${weightKg.toFixed(1)} kg`,
        `• 1º choque: ${(2 * weightKg).toFixed(0)} J`,
        `• Choques subsequentes: ${(4 * weightKg).toFixed(0)} J`,
        '• Identificar FV / TV sem pulso',
        '• Associar RCP de alta qualidade e medicação conforme protocolo',
        '',
        'PLACEHOLDER: detalhar sequência institucional.'
      ].join('\n')
    };
  }

  return {
    text: [
      'Distúrbios de ritmos: ritmos não chocáveis',
      `Peso-base: ${weightKg.toFixed(1)} kg`,
      '• Identificar assistolia / AESP',
      '• RCP de alta qualidade',
      '• Epinefrina conforme protocolo',
      '• Buscar causas reversíveis',
      '',
      'PLACEHOLDER: detalhar sequência institucional.'
    ].join('\n')
  };
}
