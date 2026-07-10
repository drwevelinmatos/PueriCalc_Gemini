import { EMERG_DOSES, getEmergencyBase } from './shared.js';

export function calculateSRI({ weightKg, ageYears }) {
  const base = getEmergencyBase(weightKg, ageYears);
  if (base.error) return base;

  const cet = EMERG_DOSES.sri.cet_mgkg * weightKg;
  const eto = EMERG_DOSES.sri.eto_mgkg * weightKg;
  const mida = EMERG_DOSES.sri.mida_mgkg * weightKg;
  const fenta = EMERG_DOSES.sri.fenta_mcgkg * weightKg;
  const roc = EMERG_DOSES.sri.roc_mgkg * weightKg;
  const succ = EMERG_DOSES.sri.succ_mgkg * weightKg;

  return {
    text: [
      'Sequência rápida de intubação',
      'Indução (escolher 1):',
      `• Cetamina: ${cet.toFixed(1)} mg`,
      `• Etomidato: ${eto.toFixed(1)} mg`,
      `• Midazolam: ${mida.toFixed(1)} mg`,
      '',
      'Analgesia (se indicada):',
      `• Fentanil: ${fenta.toFixed(0)} mcg`,
      '',
      'Bloqueio neuromuscular (escolher 1):',
      `• Rocurônio: ${roc.toFixed(1)} mg`,
      `• Succinilcolina: ${succ.toFixed(1)} mg`,
      '',
      'ATUALIZAR_CONFORME_PROTOCOLO: confirmar faixas, contraindicações e máximos.'
    ].join('\n')
  };
}
