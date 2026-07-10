export const EMERG_DOSES = {
  rcp: {
    epi_mgkg: 0.01,
    amio_mgkg: 5,
    lido_mgkg: 1,
    defib_jkg_1: 2,
    defib_jkg_2: 4
  },
  sri: {
    cet_mgkg: 1.5,
    eto_mgkg: 0.3,
    mida_mgkg: 0.1,
    fenta_mcgkg: 2,
    roc_mgkg: 1.2,
    succ_mgkg: 2
  },
  choque: {
    bolus_mlkg: 20
  }
};

export function getEmergencyBase(weightKg, ageYears) {
  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    return { error: 'Informe peso (kg).' };
  }

  if (!Number.isFinite(ageYears) || ageYears < 0) {
    return { error: 'Informe idade (anos).' };
  }

  return { weightKg, ageYears };
}
