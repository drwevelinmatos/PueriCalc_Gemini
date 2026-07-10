import { byId, showResult } from '../../utils/dom.js';
import { calculateRCP, calculateTube } from './rcp.js';
import { calculateSRI } from './sri.js';
import { calculateNeuroEmergency } from './neuro.js';
import { calculateRhythmEmergency } from './ritmos.js';
import { calculateShock } from './choques.js';

export function renderEmergencia() {
  const root = byId('tab-emerg');
  if (!root) return;

  root.innerHTML = `
    <div class="card">
      <div class="card-header" style="border-color:var(--emergency)">
        <h2>Dados do paciente (base)</h2>
      </div>

      <div class="grid-2">
        <div>
          <label>Peso (kg)</label>
          <input type="number" id="em-peso" step="0.1" min="0">
        </div>
        <div>
          <label>Idade (anos)</label>
          <input type="number" id="em-idade" step="0.1" min="0">
        </div>
      </div>

      <div class="muted">
        Os subitens abaixo usam este peso e idade como fonte única.
      </div>
    </div>

    <div class="card">
      <div class="card-header" style="border-color:var(--emergency)">
        <h2>4.1 PCR e Pós-PCR</h2>
      </div>

      <label>Subitem</label>
      <select id="em-41">
        <option value="rcp">Ressuscitação Cardiopulmonar</option>
        <option value="sri">Sequência Rápida de Intubação</option>
        <option value="tubo">Tamanho do tubo e posição de fixação</option>
      </select>

      <button class="calc-btn" id="btn-em-41" style="background:var(--emergency)">
        Gerar
      </button>

      <div id="res-em-41" class="result-box"></div>
    </div>

    <div class="card">
      <div class="card-header" style="border-color:var(--emergency)">
        <h2>4.3 Urgências neurológicas</h2>
      </div>

      <label>Subitem</label>
      <select id="em-43">
        <option value="crise">Crise convulsiva</option>
        <option value="status">Status convulsivo</option>
        <option value="hic">Hipertensão intracraniana</option>
      </select>

      <button class="calc-btn" id="btn-em-43" style="background:var(--emergency)">
        Gerar
      </button>

      <div id="res-em-43" class="result-box"></div>
    </div>

    <div class="card">
      <div class="card-header" style="border-color:var(--emergency)">
        <h2>4.4 Distúrbio de ritmos</h2>
      </div>

      <label>Subitem</label>
      <select id="em-44">
        <option value="chocaveis">Chocáveis</option>
        <option value="nao">Não chocáveis</option>
      </select>

      <button class="calc-btn" id="btn-em-44" style="background:var(--emergency)">
        Gerar
      </button>

      <div id="res-em-44" class="result-box"></div>
    </div>

    <div class="card">
      <div class="card-header" style="border-color:var(--emergency)">
        <h2>4.5 Choques</h2>
      </div>

      <label>Tipo de choque</label>
      <select id="em-45">
        <option value="hipov">Hipovolêmico</option>
        <option value="sept">Séptico</option>
        <option value="ana">Anafilático</option>
        <option value="card">Cardiogênico</option>
      </select>

      <button class="calc-btn" id="btn-em-45" style="background:var(--emergency)">
        Gerar
      </button>

      <div id="res-em-45" class="result-box"></div>
    </div>
  `;

  bindEmergenciaEvents();
}

function getBaseInputs() {
  return {
    weightKg: Number(byId('em-peso')?.value),
    ageYears: Number(byId('em-idade')?.value)
  };
}

function bindEmergenciaEvents() {
  byId('btn-em-41')?.addEventListener('click', handleEmergency41);
  byId('btn-em-43')?.addEventListener('click', handleEmergency43);
  byId('btn-em-44')?.addEventListener('click', handleEmergency44);
  byId('btn-em-45')?.addEventListener('click', handleEmergency45);
}

function handleEmergency41() {
  const subtype = byId('em-41')?.value;
  const base = getBaseInputs();

  let result;

  if (subtype === 'rcp') result = calculateRCP(base);
  else if (subtype === 'sri') result = calculateSRI(base);
  else result = calculateTube(base);

  showResult('res-em-41', result.error || result.text);
}

function handleEmergency43() {
  const subtype = byId('em-43')?.value;
  const result = calculateNeuroEmergency({
    ...getBaseInputs(),
    subtype
  });

  showResult('res-em-43', result.error || result.text);
}

function handleEmergency44() {
  const subtype = byId('em-44')?.value;
  const result = calculateRhythmEmergency({
    ...getBaseInputs(),
    subtype
  });

  showResult('res-em-44', result.error || result.text);
}

function handleEmergency45() {
  const shockType = byId('em-45')?.value;
  const result = calculateShock({
    ...getBaseInputs(),
    shockType
  });

  showResult('res-em-45', result.error || result.text);
}
