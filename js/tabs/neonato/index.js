// tabs/neonato/index.js
import { byId, showResult } from '../../utils/dom.js';
import {
  calculateIGAndDPP,
  calculateCorrectedPostnatalIG,
  calculateIntergrowthClassification,
  calculateIctericiaSBP2021
} from './logic.js';

let weightChart = null;

export function renderNeonato() {
  const root = byId('tab-neo');
  if (!root) return;

  root.innerHTML = `
    <div class="card">
      <div class="card-header"><h2>Idade Gestacional e DPP</h2></div>
      <label>Modo de Entrada</label>
      <select id="neo-modo">
        <option value="dum">DUM (Data Última Menstruação)</option>
        <option value="usg">USG 1º Trimestre</option>
      </select>
      <div id="box-dum"><label>Data da DUM</label><input type="date" id="neo-dum"></div>
      <div id="box-usg" style="display:none">
        <label>Data do USG</label><input type="date" id="neo-usg-data">
        <div class="grid-2">
          <div><label>Semanas no USG</label><input type="number" id="neo-usg-sem" min="0" step="1"></div>
          <div><label>Dias no USG</label><input type="number" id="neo-usg-dias" min="0" max="6" step="1"></div>
        </div>
      </div>
      <label>Data para cálculo</label>
      <input type="date" id="neo-ig-calc">
      <button class="calc-btn" id="btn-neo-ig">Calcular IG e DPP</button>
      <div id="res-neo-ig" class="result-box"></div>
    </div>

    <div class="card">
      <div class="card-header"><h2>Idade Gestacional Corrigida Pós-Nascimento</h2></div>
      <div class="grid-2">
        <div><label>IG ao nascimento (semanas)</label><input type="number" id="neo-ig-nasc-sem" min="0" step="1"></div>
        <div><label>IG ao nascimento (dias)</label><input type="number" id="neo-ig-nasc-dias" min="0" max="6" step="1"></div>
      </div>
      <div class="grid-2">
        <div><label>Data de nascimento</label><input type="date" id="neo-data-nasc"></div>
        <div><label>Data para cálculo</label><input type="date" id="neo-data-posnatal"></div>
      </div>
      <button class="calc-btn" id="btn-neo-igcorr">Calcular Corrigida Pós-Natal</button>
      <div id="res-neo-igcorr" class="result-box"></div>
    </div>

    <div class="card">
      <div class="card-header"><h2>Peso para Idade Gestacional (INTERGROWTH-21st)</h2></div>
      <div class="grid-3">
        <div><label>Sexo</label><select id="neo-ig-sexo"><option value="M">Masculino</option><option value="F">Feminino</option></select></div>
        <div><label>IG ao nascer (semanas)</label><input type="number" id="neo-lub-ig-sem" min="24" max="44" step="1"></div>
        <div><label>IG ao nascer (dias)</label><input type="number" id="neo-lub-ig-dias" min="0" max="6" step="1"></div>
      </div>
      <label>Peso ao nascer (g)</label>
      <input type="number" id="neo-lub-peso" min="200" step="1">
      <button class="calc-btn" id="btn-neo-intergrowth">Classificar (PIG/AIG/GIG)</button>
      <div id="res-neo-lub" class="result-box"></div>
    </div>

    <div class="card">
      <div class="card-header"><h2>Calculadora de Perda de Peso Neonatal</h2></div>
      <div class="grid-2">
        <div><label>Peso ao Nascer (kg)</label><input type="number" step="0.001" id="start_birth_weight" placeholder="Ex: 3.200"></div>
        <div><label>Data/Hora Nascimento</label><input type="datetime-local" id="start_birth_datetime"></div>
      </div>
      <div class="grid-2" style="margin-top: 10px;">
        <div><label>Peso Atual (kg)</label><input type="number" step="0.001" id="start_measurement_weight" placeholder="Ex: 2.950"></div>
        <div><label>Data/Hora Medição</label><input type="datetime-local" id="start_measurement_datetime"></div>
      </div>
      <button class="calc-btn" id="btn-calc-peso-neo" style="margin-top: 15px;">Calcular Gráfico</button>
      <div style="margin-top: 20px;"><canvas id="weightChart" style="max-height: 250px;"></canvas></div>
      <div id="res-perda-peso" class="result-box" style="margin-top: 10px; font-weight: bold;"></div>
    </div>

    <div class="card">
      <div class="card-header"><h2>Icterícia Neonatal (parâmetros SBP)</h2></div>
      <div class="grid-2">
        <div><label>IG (semanas)</label><input type="number" id="ict-ig" min="24" step="1"></div>
        <div><label>Horas de vida</label><input type="number" id="ict-horas" min="0" step="1"></div>
      </div>
      <label>Bilirrubina Total (mg/dL)</label>
      <input type="number" id="ict-bt" step="0.1" min="0">
      <label>Fatores de risco</label>
      <div style="margin-top:8px">
        <label><input type="checkbox" class="ict-risk"> Hemólise</label>
        <label><input type="checkbox" class="ict-risk"> Sepse / instabilidade clínica</label>
        <label><input type="checkbox" class="ict-risk"> Prematuridade limítrofe</label>
        <label><input type="checkbox" class="ict-risk"> Hipoalbuminemia</label>
      </div>
      <button class="calc-btn" id="btn-neo-ict">Avaliar Conduta</button>
      <div id="res-ict" class="result-box"></div>
    </div>
  `;

  initWeightChart();
  bindNeonatoEvents();
  toggleNeoInputMode();
}

function initWeightChart() {
  const ctx = document.getElementById('weightChart')?.getContext('2d');
  if(!ctx) return;
  weightChart = new Chart(ctx, {
    type: 'line',
    data: { datasets: [
      { label: 'P95 (Alerta)', data: [{x:0,y:0}, {x:24,y:5}, {x:48,y:8}, {x:72,y:10}, {x:96,y:10.5}], borderColor: '#e74c3c', fill: false },
      { label: 'P50 (Média)', data: [{x:0,y:0}, {x:24,y:2.5}, {x:48,y:4.5}, {x:72,y:5.5}, {x:96,y:6}], borderColor: '#27ae60', fill: false },
      { label: 'Paciente', data: [], type: 'scatter', backgroundColor: '#2980b9', pointRadius: 8 }
    ]},
    options: { responsive: true, scales: { x: { title: { display: true, text: 'Horas de Vida' } }, y: { title: { display: true, text: 'Perda (%)' } } } }
  });
}

function bindNeonatoEvents() {
  byId('neo-modo')?.addEventListener('change', toggleNeoInputMode);
  byId('btn-neo-ig')?.addEventListener('click', handleCalculateIGDPP);
  byId('btn-neo-igcorr')?.addEventListener('click', handleCalculateCorrectedIG);
  byId('btn-neo-intergrowth')?.addEventListener('click', handleCalculateIntergrowth);
  byId('btn-neo-ict')?.addEventListener('click', handleCalculateIctericia);
  byId('btn-calc-peso-neo')?.addEventListener('click', processarCalculoNeo);
}

function toggleNeoInputMode() {
  const mode = byId('neo-modo')?.value || 'dum';
  byId('box-dum').style.display = mode === 'dum' ? 'block' : 'none';
  byId('box-usg').style.display = mode === 'usg' ? 'block' : 'none';
}

function processarCalculoNeo() {
    const bW = parseFloat(byId('start_birth_weight').value);
    const cW = parseFloat(byId('start_measurement_weight').value);
    const bD = new Date(byId('start_birth_datetime').value);
    const cD = new Date(byId('start_measurement_datetime').value);
    if (!bW || !cW || isNaN(bD) || isNaN(cD)) return alert("Preencha todos os campos.");
    const perda = ((bW - cW) / bW) * 100;
    const horas = (cD - bD) / (1000 * 60 * 60);
    weightChart.data.datasets[2].data = [{ x: horas, y: perda }];
    weightChart.update();
    byId('res-perda-peso').innerHTML = `Perda: ${perda.toFixed(1)}% em ${Math.floor(horas)}h de vida.`;
}

function handleCalculateIGDPP() {
  const result = calculateIGAndDPP({
    mode: byId('neo-modo')?.value,
    dumDate: byId('neo-dum')?.value,
    usgDate: byId('neo-usg-data')?.value,
    usgWeeks: Number(byId('neo-usg-sem')?.value),
    usgDays: Number(byId('neo-usg-dias')?.value),
    calcDate: byId('neo-ig-calc')?.value
  });
  if (result.error) return showResult('res-neo-ig', result.error);
  showResult('res-neo-ig', `IG: ${result.weeks} sem ${result.days} dias. DPP: ${result.dpp.toLocaleDateString('pt-BR')}`);
}

function handleCalculateCorrectedIG() {
  const result = calculateCorrectedPostnatalIG({
    birthIGWeeks: Number(byId('neo-ig-nasc-sem')?.value),
    birthIGDays: Number(byId('neo-ig-nasc-dias')?.value),
    birthDate: byId('neo-data-nasc')?.value,
    calcDate: byId('neo-data-posnatal')?.value
  });
  if (result.error) return showResult('res-neo-igcorr', result.error);
  showResult('res-neo-igcorr', `IG Corrigida: ${result.weeks} sem ${result.days} dias.`);
}

function handleCalculateIntergrowth() {
  const result = calculateIntergrowthClassification({
    sex: byId('neo-ig-sexo')?.value,
    weeks: Number(byId('neo-lub-ig-sem')?.value),
    days: Number(byId('neo-lub-ig-dias')?.value),
    weightGrams: Number(byId('neo-lub-peso')?.value)
  });
  if (result.error) return showResult('res-neo-lub', result.error);
  showResult('res-neo-lub', `Classificação: ${result.classification}`);
}

function handleCalculateIctericia() {
  const hasRisk = Array.from(document.querySelectorAll('.ict-risk')).some(el => el.checked);
  const result = calculateIctericiaSBP2021({
    gaWeeks: Number(byId('ict-ig')?.value),
    hours: Number(byId('ict-horas')?.value),
    bt: Number(byId('ict-bt')?.value),
    hasRisk
  });
  if (result.error) return showResult('res-ict', result.error);
  showResult('res-ict', `Conduta: ${result.recommendation}`);
}
