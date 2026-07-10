import { byId, showResult } from '../../utils/dom.js';
import {
  calculateHollidaySegar,
  calculateVIG,
  calculateSchwartz
} from './logic.js';

export function renderHidratacao() {
  const root = byId('tab-hidra');
  if (!root) return;

  root.innerHTML = `
    <div class="card">
      <div class="card-header" style="border-color:var(--renal)">
        <h2>Holliday-Segar (com eletrólitos)</h2>
      </div>

      <label>Peso (kg)</label>
      <input type="number" id="hs-peso" step="0.1" min="0">

      <label>Modo eletrólitos</label>
      <select id="hs-modo">
        <option value="meqkg">mEq/kg/dia</option>
        <option value="meql">mEq/L (solução final)</option>
      </select>

      <div class="grid-2">
        <div>
          <label>Na+</label>
          <input type="number" id="hs-na" step="0.1">
        </div>
        <div>
          <label>K+</label>
          <input type="number" id="hs-k" step="0.1">
        </div>
      </div>

      <div class="grid-2">
        <div>
          <label>Cl-</label>
          <input type="number" id="hs-cl" step="0.1">
        </div>
        <div>
          <label>Glicose (g/L ou g/kg/dia)</label>
          <input type="number" id="hs-glic" step="0.1">
        </div>
      </div>

      <button class="calc-btn" id="btn-hs-calc" style="background:var(--renal)">
        Calcular manutenção
      </button>

      <div id="res-hs" class="result-box"></div>
    </div>

    <div class="card">
      <div class="card-header" style="border-color:var(--renal)">
        <h2>VIG (com eletrólitos)</h2>
      </div>

      <div class="grid-2">
        <div>
          <label>Peso (kg)</label>
          <input type="number" id="vig-peso" step="0.1" min="0">
        </div>
        <div>
          <label>VIG alvo (mL/kg/h)</label>
          <input type="number" id="vig-alvo" step="0.1" value="4">
        </div>
      </div>

      <div class="grid-2">
        <div>
          <label>Na+ (mEq/L)</label>
          <input type="number" id="vig-na" step="0.1">
        </div>
        <div>
          <label>K+ (mEq/L)</label>
          <input type="number" id="vig-k" step="0.1">
        </div>
      </div>

      <div class="grid-2">
        <div>
          <label>Cl- (mEq/L)</label>
          <input type="number" id="vig-cl" step="0.1">
        </div>
        <div>
          <label>Glicose (g/L)</label>
          <input type="number" id="vig-glic" step="0.1">
        </div>
      </div>

      <button class="calc-btn" id="btn-vig-calc" style="background:var(--renal)">
        Calcular VIG
      </button>

      <div id="res-vig" class="result-box"></div>
    </div>

    <div class="card">
      <div class="card-header" style="border-color:var(--renal)">
        <h2>Clearance de Schwartz (eTFG)</h2>
      </div>

      <div class="grid-2">
        <div>
          <label>Creatinina (mg/dL)</label>
          <input type="number" id="ren-cr" step="0.01">
        </div>
        <div>
          <label>Estatura (cm)</label>
          <input type="number" id="ren-alt" step="0.1">
        </div>
      </div>

      <button class="calc-btn" id="btn-schwartz-calc" style="background:var(--renal)">
        Calcular eTFG
      </button>

      <div id="res-renal" class="result-box"></div>
    </div>
  `;

  bindHidratacaoEvents();
}

function bindHidratacaoEvents() {
  byId('btn-hs-calc')?.addEventListener('click', handleHollidaySegar);
  byId('btn-vig-calc')?.addEventListener('click', handleVIG);
  byId('btn-schwartz-calc')?.addEventListener('click', handleSchwartz);
}

function handleHollidaySegar() {
  const result = calculateHollidaySegar({
    weightKg: Number(byId('hs-peso')?.value),
    sodium: Number(byId('hs-na')?.value),
    potassium: Number(byId('hs-k')?.value),
    chloride: Number(byId('hs-cl')?.value),
    glucose: Number(byId('hs-glic')?.value),
    electrolyteMode: byId('hs-modo')?.value
  });

  if (result.error) {
    return showResult('res-hs', result.error);
  }

  const modeLabel =
    result.electrolyteMode === 'meqkg'
      ? 'mEq/kg/dia'
      : 'mEq/L';

  showResult(
    'res-hs',
    [
      'Manutenção (Holliday-Segar)',
      `Volume 24h: ${result.volume24h.toFixed(0)} mL`,
      `Taxa: ${result.rateMlH.toFixed(1)} mL/h`,
      '',
      `Modo de eletrólitos: ${modeLabel}`,
      `Na+: ${Number.isFinite(result.sodium) ? result.sodium : '-'} `,
      `K+: ${Number.isFinite(result.potassium) ? result.potassium : '-'} `,
      `Cl-: ${Number.isFinite(result.chloride) ? result.chloride : '-'} `,
      `Glicose: ${Number.isFinite(result.glucose) ? result.glucose : '-'} `,
      '',
      'Composição eletrolítica: bloco pronto para refinamento posterior.'
    ].join('\n')
  );
}

function handleVIG() {
  const result = calculateVIG({
    weightKg: Number(byId('vig-peso')?.value),
    targetMlKgH: Number(byId('vig-alvo')?.value),
    sodium: Number(byId('vig-na')?.value),
    potassium: Number(byId('vig-k')?.value),
    chloride: Number(byId('vig-cl')?.value),
    glucose: Number(byId('vig-glic')?.value)
  });

  if (result.error) {
    return showResult('res-vig', result.error);
  }

  showResult(
    'res-vig',
    [
      'VIG',
      `Taxa: ${result.rateMlH.toFixed(1)} mL/h`,
      `Volume 24h: ${result.volume24h.toFixed(0)} mL`,
      '',
      `Na+: ${Number.isFinite(result.sodium) ? result.sodium : '-'} `,
      `K+: ${Number.isFinite(result.potassium) ? result.potassium : '-'} `,
      `Cl-: ${Number.isFinite(result.chloride) ? result.chloride : '-'} `,
      `Glicose: ${Number.isFinite(result.glucose) ? result.glucose : '-'} `,
      '',
      'Eletrólitos: bloco pronto para refinamento posterior.'
    ].join('\n')
  );
}

function handleSchwartz() {
  const result = calculateSchwartz({
    creatinineMgDl: Number(byId('ren-cr')?.value),
    heightCm: Number(byId('ren-alt')?.value)
  });

  if (result.error) {
    return showResult('res-renal', result.error);
  }

  showResult(
    'res-renal',
    `eTFG (Schwartz): ${result.eGFR.toFixed(1)} mL/min/1,73m²`
  );
}
