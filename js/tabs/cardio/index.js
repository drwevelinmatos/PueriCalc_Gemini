import { byId } from '../../utils/dom.js';
import { initECGCard } from './ecg.js';
import { initPACard } from './pa.js';
import { initMRPA } from './mrpa.js';

export function renderCardio() {
  const root = byId('tab-cardio');
  if (!root) return;

  root.innerHTML = `
    <div class="subnav">
      <button class="active" data-cardio-sub="cardio-main">Calculadoras</button>
      <button data-cardio-sub="cardio-mrpa">MRPA (PA)</button>
    </div>

    <div id="cardio-main" class="cardio-sub active">
      <div id="cardio-ecg-slot"></div>
      <div id="cardio-pa-slot"></div>
    </div>

    <div id="cardio-mrpa" class="cardio-sub">
      <div id="cardio-mrpa-slot"></div>
    </div>
  `;

  initCardioSubtabs(root);
  initECGCard();
  initPACard();
  initMRPA();
}

function initCardioSubtabs(root) {
  const buttons = root.querySelectorAll('[data-cardio-sub]');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.dataset.cardioSub;

      root.querySelectorAll('.cardio-sub').forEach((sub) => {
        sub.classList.remove('active');
      });

      buttons.forEach((btn) => btn.classList.remove('active'));

      byId(targetId)?.classList.add('active');
      button.classList.add('active');

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}
