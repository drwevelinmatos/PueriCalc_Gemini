import { initMainTabs } from './router.js';
import { renderNeonato } from './tabs/neonato/index.js';
import { renderCrescimento } from './tabs/crescimento/index.js';
import { renderCardio } from './tabs/cardio/index.js';
import { renderEmergencia } from './tabs/emergencia/index.js';
import { renderHidratacao } from './tabs/hidratacao/index.js';
import { renderLaser } from './tabs/laser/index.js';
import { renderLaboratorios } from './tabs/laboratorios/index.js';
import { renderChecklist } from './tabs/checklist/index.js';

function bootstrap() {
  initMainTabs();

  renderNeonato();
  renderCrescimento();
  renderCardio();
  renderEmergencia();
  renderHidratacao();
  renderLaser();
  renderLaboratorios();
  renderChecklist();
}

document.addEventListener('DOMContentLoaded', bootstrap);
