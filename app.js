import { initMainTabs } from './router.js';

async function safeImportRender(path, exportName, label) {
  try {
    const mod = await import(path);
    const fn = mod[exportName];

    if (typeof fn !== 'function') {
      console.error(`Export ${exportName} não encontrado em ${path}`);
      return;
    }

    fn();
    console.log(`OK: ${label}`);
  } catch (err) {
    console.error(`Erro ao carregar ${label}:`, err);
  }
}

async function bootstrap() {
  initMainTabs();

  await safeImportRender('./tabs/neonato/index.js', 'renderNeonato', 'Neonato');
  await safeImportRender('./tabs/crescimento/index.js', 'renderCrescimento', 'Crescimento');
  await safeImportRender('./tabs/cardio/index.js', 'renderCardio', 'Cardio');
  await safeImportRender('./tabs/emergencia/index.js', 'renderEmergencia', 'Emergência');
  await safeImportRender('./tabs/hidratacao/index.js', 'renderHidratacao', 'Hidratação');
  await safeImportRender('./tabs/laser/index.js', 'renderLaser', 'Laser');
  await safeImportRender('./tabs/laboratorios/index.js', 'renderLaboratorios', 'Laboratórios');
  await safeImportRender('./tabs/checklist/index.js', 'renderChecklist', 'Checklist');
}

document.addEventListener('DOMContentLoaded', bootstrap);
