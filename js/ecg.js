import { byId, showResult } from '../../utils/dom.js';

export function initECGCard() {
  const slot = byId('cardio-ecg-slot');
  if (!slot) return;

  slot.innerHTML = `
    <div class="card">
      <div class="card-header" style="border-color:var(--cardio)">
        <h2>Avaliação de ECG</h2>
      </div>

      <p class="muted">Use quadradinhos: 1 mm = 0,04 s (25 mm/s). Se preferir, você pode expandir depois para RR em milissegundos.</p>

      <div class="grid-2">
        <div>
          <label>QT (quadradinhos)</label>
          <input type="number" id="ecg-qt-q" step="1" min="1">
        </div>
        <div>
          <label>RR (quadradinhos)</label>
          <input type="number" id="ecg-rr-q" step="1" min="1">
        </div>
      </div>

      <button class="calc-btn" id="btn-ecg-calc" style="background:var(--cardio)">
        Analisar ECG (QTc + FC)
      </button>

      <div id="res-ecg" class="result-box"></div>

      <div class="muted warn">
        Intervalos por idade, eixo e padrões pediátricos específicos podem ser plugados depois em arquivo próprio.
      </div>
    </div>
  `;

  byId('btn-ecg-calc')?.addEventListener('click', calculateECG);
}

function calculateECG() {
  const qtq = Number(byId('ecg-qt-q')?.value);
  const rrq = Number(byId('ecg-rr-q')?.value);

  if (!Number.isFinite(qtq) || qtq <= 0) {
    return showResult('res-ecg', 'Informe QT (quadradinhos).');
  }

  if (!Number.isFinite(rrq) || rrq <= 0) {
    return showResult('res-ecg', 'Informe RR (quadradinhos).');
  }

  const qtSeconds = qtq * 0.04;
  const rrSeconds = rrq * 0.04;

  const qtcBazett = qtSeconds / Math.sqrt(rrSeconds);
  const qtcFridericia = qtSeconds / Math.cbrt(rrSeconds);
  const heartRate = 1500 / rrq;

  const text = [
    `FC estimada: ${heartRate.toFixed(0)} bpm`,
    `QT: ${qtSeconds.toFixed(3)} s`,
    `RR: ${rrSeconds.toFixed(3)} s`,
    '',
    `QTc (Bazett): ${(qtcBazett * 1000).toFixed(0)} ms`,
    `QTc (Fridericia): ${(qtcFridericia * 1000).toFixed(0)} ms`,
    '',
    'Análise etária detalhada: módulo pronto para expansão.'
  ].join('\n');

  showResult('res-ecg', text);
}
