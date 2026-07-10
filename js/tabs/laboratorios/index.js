import { byId, showResult } from '../../utils/dom.js';
import { analyzeGasometry, convertLabValue } from './logic.js';

export function renderLaboratorios() {
  const root = byId('tab-lab');
  if (!root) return;

  root.innerHTML = `
    <div class="card">
      <div class="card-header" style="border-color:var(--lab)">
        <h2>Gasometria (análise + conduta)</h2>
      </div>

      <div class="grid-2">
        <div>
          <label>pH</label>
          <input type="number" id="g-ph" step="0.01">
        </div>
        <div>
          <label>pCO2 (mmHg)</label>
          <input type="number" id="g-pco2" step="0.1">
        </div>
      </div>

      <div class="grid-2">
        <div>
          <label>HCO3- (mEq/L)</label>
          <input type="number" id="g-hco3" step="0.1">
        </div>
        <div>
          <label>Na+ (mEq/L)</label>
          <input type="number" id="g-na" step="0.1">
        </div>
      </div>

      <div class="grid-2">
        <div>
          <label>Cl- (mEq/L)</label>
          <input type="number" id="g-cl" step="0.1">
        </div>
        <div>
          <label>Albumina (g/dL) (opcional)</label>
          <input type="number" id="g-alb" step="0.1">
        </div>
      </div>

      <button class="calc-btn" id="btn-gaso-calc" style="background:var(--lab)">
        Analisar
      </button>

      <div id="res-gaso" class="result-box"></div>

      <div class="muted warn">
        Condutas são orientativas. Ajuste conforme contexto clínico e protocolos locais.
      </div>
    </div>

    <div class="card">
      <div class="card-header" style="border-color:var(--lab)">
        <h2>Conversor de Unidades</h2>
      </div>

      <select id="lab-conv">
        <option value="0.2495">Cálcio (mg/dL → mmol/L)</option>
        <option value="88.4">Creatinina (mg/dL → µmol/L)</option>
        <option value="17.1">Bilirrubina (mg/dL → µmol/L)</option>
      </select>

      <input type="number" id="lab-val" placeholder="Valor convencional" style="margin-top:10px">

      <button class="calc-btn" id="btn-lab-conv" style="background:var(--lab)">
        Converter
      </button>

      <div id="res-lab" class="result-box"></div>
    </div>
  `;

  bindLaboratorioEvents();
}

function bindLaboratorioEvents() {
  byId('btn-gaso-calc')?.addEventListener('click', handleGasometry);
  byId('btn-lab-conv')?.addEventListener('click', handleLabConversion);
}

function handleGasometry() {
  const result = analyzeGasometry({
    pH: Number(byId('g-ph')?.value),
    pCO2: Number(byId('g-pco2')?.value),
    hco3: Number(byId('g-hco3')?.value),
    sodium: Number(byId('g-na')?.value),
    chloride: Number(byId('g-cl')?.value),
    albumin: Number(byId('g-alb')?.value)
  });

  if (result.error) {
    return showResult('res-gaso', result.error);
  }

  showResult('res-gaso', result.interpretation);
}

function handleLabConversion() {
  const result = convertLabValue({
    factor: Number(byId('lab-conv')?.value),
    value: Number(byId('lab-val')?.value)
  });

  if (result.error) {
    return showResult('res-lab', result.error);
  }

  showResult('res-lab', `Resultado: ${result.converted.toFixed(2)}`);
}
