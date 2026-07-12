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
      <button class="active calc-btn" data-cardio-sub="cardio-pa" style="width: auto; margin: 0; padding: 10px 20px;">Pressão Arterial (PA)</button>
      <button class="calc-btn" data-cardio-sub="cardio-ecg" style="width: auto; margin: 0; padding: 10px 20px; background: #eef2f5; color: var(--azul);">Eletrocardiograma (ECG)</button>
      <button class="calc-btn" data-cardio-sub="cardio-mrpa" style="width: auto; margin: 0; padding: 10px 20px; background: #eef2f5; color: var(--azul);">MRPA</button>
    </div>

    <div id="cardio-pa" class="cardio-sub active">
      <div id="cardio-pa-slot"></div>
    </div>

    <div id="cardio-ecg" class="cardio-sub" style="display: none;">
      <div id="cardio-ecg-slot"></div>
    </div>

    <div id="cardio-mrpa" class="cardio-sub" style="display: none;">
      <div id="cardio-mrpa-slot"></div>
    </div>
  `;

  initCardioSubtabs(root);
  
  // Inicializa todos os módulos nos seus respectivos slots
  initPACard();
  initECGCard();
  initMRPA();
}

// Lógica para alternar as abas dinamicamente
function initCardioSubtabs(root) {
  const buttons = root.querySelectorAll('[data-cardio-sub]');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.dataset.cardioSub;

      // Oculta todas as sub-abas
      root.querySelectorAll('.cardio-sub').forEach((sub) => {
        sub.style.display = 'none';
        sub.classList.remove('active');
      });

      // Reseta o estilo visual de todos os botões para o padrão inativo
      buttons.forEach((btn) => {
        btn.classList.remove('active');
        btn.style.background = '#eef2f5';
        btn.style.color = 'var(--azul)';
      });

      // Ativa visualmente o botão clicado
      button.classList.add('active');
      button.style.background = 'var(--azul)';
      button.style.color = '#fff';

      // Mostra a sub-aba correspondente
      const activeTab = document.getElementById(targetId);
      if (activeTab) {
        activeTab.classList.add('active');
        activeTab.style.display = 'block';
      }
    });
  });
}
