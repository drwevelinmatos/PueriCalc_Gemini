import { getEmergencyBase } from './shared.js';

export function calculateNeuroEmergency({ weightKg, ageYears, subtype }) {
  const base = getEmergencyBase(weightKg, ageYears);
  if (base.error) return base;

  if (subtype === 'crise') {
    return {
      text: [
        'Urgência neurológica: crise convulsiva',
        `Peso-base: ${weightKg.toFixed(1)} kg`,
        '• Garantir ABC',
        '• Glicemia capilar',
        '• Benzodiazepínico conforme protocolo institucional',
        '• Reavaliar tempo de crise e recorrência',
        '',
        'PLACEHOLDER: inserir doses padronizadas da sua rotina.'
      ].join('\n')
    };
  }

  if (subtype === 'status') {
    return {
      text: [
        'Urgência neurológica: status convulsivo',
        `Peso-base: ${weightKg.toFixed(1)} kg`,
        '• ABC + monitorização',
        '• Corrigir glicemia, distúrbios metabólicos e temperatura',
        '• Escalonamento medicamentoso por etapa',
        '• Considerar suporte ventilatório precoce',
        '',
        'PLACEHOLDER: inserir algoritmo completo com doses.'
      ].join('\n')
    };
  }

  return {
    text: [
      'Urgência neurológica: hipertensão intracraniana',
      `Peso-base: ${weightKg.toFixed(1)} kg`,
      '• Cabeceira elevada',
      '• Evitar hipoxemia e hipotensão',
      '• Considerar osmoterapia conforme protocolo',
      '• Solicitar neuroimagem quando indicado',
      '',
      'PLACEHOLDER: inserir conduta medicamentosa detalhada.'
    ].join('\n')
  };
}
