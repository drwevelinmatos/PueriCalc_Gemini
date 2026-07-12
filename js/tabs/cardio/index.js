// tabs/cardio/index.js
import { byId } from '../../utils/dom.js';
import { initECGCard } from './ecg.js';
import { initPACard } from './pa.js';
import { initMRPA } from './mrpa.js';

export function renderCardio() {
  const root = byId('tab-cardio');
  if (!root) return;

  root.innerHTML = `
    <div class="subnav" style="margin-bottom: 20px; display: flex; gap: 10px; border-bottom: 1px solid #d8e2ea; padding-bottom: 10px;">
      <button class="active calc-btn" data-cardio-sub="cardio-main" style="width: auto; margin: 0; padding: 10px 20px;">Calculadoras (PA e ECG)</button>
      <button class="calc-btn" data-cardio-sub="cardio-mrpa" style="width: auto; margin: 0; padding: 10px 20px; background: #eef2f5; color: var(--azul);">MRPA (PA)</button>
    </div>

    <div id="cardio-main" class="cardio-sub active">
      <div id="cardio-pa-slot"></div>
      <div id="cardio-ecg-slot" style="margin-top: 20px;"></div>
    </div>

    <div id="cardio-mrpa" class="cardio-sub" style="display: none;">
      <div id="cardio-mrpa-slot"></div>
    </div>
  `;

  initCardioSubtabs(root);
  
  // Inicia os módulos (cada um vai desenhar no seu respectivo slot acima)
  initPACard();
  initECGCard();
  initMRPA();
}

// Lógica para alternar as abas
function initCardioSubtabs(root) {
  const buttons = root.querySelectorAll('[data-cardio-sub]');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.dataset.cardioSub;

      // Oculta todas as áreas
      root.querySelectorAll('.cardio-sub').forEach((sub) => {
        sub.style.display = 'none';
        sub.classList.remove('active');
      });

      // Reinicia estilo dos botões
      buttons.forEach((btn) => {
        btn.classList.remove('active');
        btn.style.background = '#eef2f5';
        btn.style.color = 'var(--azul)';
      });

      // Ativa o botão e a área clicada
      button.classList.add('active');
      button.style.background = 'var(--azul)';
      button.style.color = '#fff';

      const activeTab = document.getElementById(targetId);
      if (activeTab) {
        activeTab.classList.add('active');
        activeTab.style.display = 'block';
      }
    });
  });
}
