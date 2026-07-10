import { EMERG_DOSES, getEmergencyBase } from './shared.js';

export function calculateRCP({ weightKg, ageYears }) {
  const base = getEmergencyBase(weightKg, ageYears);
  if (base.error) return base;

  const epi = EMERG_DOSES.rcp.epi_mgkg * weightKg;
  const amio = EMERG_DOSES.rcp.amio_mgkg * weightKg;
  const lido = EMERG_DOSES.rcp.lido_mgkg * weightKg;
  const defib1 = EMERG_DOSES.rcp.defib_jkg_1 * weightKg;
  const defib2 = EMERG_DOSES.rcp.defib_jkg_2 * weightKg;

  return {
    text: [
      'Ressuscitação cardiopulmonar',
      `• Epinefrina: ${epi.toFixed(2)} mg (0,01 mg/kg IV/IO)`,
      `• Amiodarona: ${amio.toFixed(0)} mg (5 mg/kg)`,
      `• Lidocaína: ${lido.toFixed(0)} mg (1 mg/kg)`,
      `• Desfibrilação inicial: ${defib1.toFixed(0)} J (2 J/kg)`,
      `• Desfibrilação subsequente: ${defib2.toFixed(0)} J (4 J/kg)`,
      '',
      'ATUALIZAR_CONFORME_PROTOCOLO: revisar doses, máximos e sequência institucional.'
    ].join('\n')
  };
}

export function calculateTube({ weightKg, ageYears }) {
  const base = getEmergencyBase(weightKg, ageYears);
  if (base.error) return base;

  const cuffedDI = ageYears / 4 + 3.5;
  const uncuffedDI = ageYears / 4 + 4.0;
  const cuffedDepth = cuffedDI * 3;
  const uncuffedDepth = uncuffedDI * 3;

  return {
    text: [
      'Tamanho do tubo e posição de fixação',
      `• ETT cuffed (DI): idade/4 + 3,5 = ${cuffedDI.toFixed(1)} mm`,
      `• ETT uncuffed (DI): idade/4 + 4,0 = ${uncuffedDI.toFixed(1)} mm`,
      `• Profundidade oral aproximada (3 × DI):`,
      `  - cuffed: ~${cuffedDepth.toFixed(1)} cm`,
      `  - uncuffed: ~${uncuffedDepth.toFixed(1)} cm`,
      '',
      'Neonato: idealmente substituir por tabela específica por peso/IG.'
    ].join('\n')
  };
}
