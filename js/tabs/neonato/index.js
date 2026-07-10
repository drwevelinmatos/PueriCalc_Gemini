import { byId, showResult } from '../../utils/dom.js';
import {
  calculateIGAndDPP,
  calculateCorrectedPostnatalIG,
  calculateIntergrowthClassification,
  calculateIctericiaSBP2021
} from './logic.js';

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

      <div id="box-dum">
        <label>Data da DUM</label>
        <input type="date" id="neo-dum">
      </div>

      <div id="box-usg" style="display:none">
        <label>Data do USG</label>
        <input type="date" id="neo-usg-data">

        <div class="grid-2">
          <div>
            <label>Semanas no USG</label>
            <input type="number" id="neo-usg-sem" min="0" step="1">
          </div>
          <div>
            <label>Dias no USG</label>
            <input type="number" id="neo-usg-dias" min="0" max="6" step="1">
          </div>
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
        <div>
          <label>IG ao nascimento (semanas)</label>
          <input type="number" id="neo-ig-nasc-sem" min="0" step="1">
        </div>
        <div>
          <label>IG ao nascimento (dias)</label>
          <input type="number" id="neo-ig-nasc-dias" min="0" max="6" step="1">
        </div>
      </div>

      <div class="grid-2">
        <div>
          <label>Data de nascimento</label>
          <input type="date" id="neo-data-nasc">
        </div>
        <div>
          <label>Data para cálculo</label>
          <input type="date" id="neo-data-posnatal">
        </div>
      </div>

      <button class="calc-btn" id="btn-neo-igcorr">Calcular Corrigida Pós-Natal</button>
      <div id="res-neo-igcorr" class="result-box"></div>
    </div>

    <div class="card">
      <div class="card-header"><h2>Peso para Idade Gestacional (INTERGROWTH-21st)</h2></div>

      <div class="grid-3">
        <div>
          <label>Sexo</label>
          <select id="neo-ig-sexo">
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>
        </div>
        <div>
          <label>IG ao nascer (semanas)</label>
          <input type="number" id="neo-lub-ig-sem" min="24" max="44" step="1">
        </div>
        <div>
          <label>IG ao nascer (dias)</label>
          <input type="number" id="neo-lub-ig-dias" min="0" max="6" step="1">
        </div>
      </div>

      <label>Peso ao nascer (g)</label>
      <input type="number" id="neo-lub-peso" min="200" step="1">

      <button class="calc-btn" id="btn-neo-intergrowth">Classificar (PIG/AIG/GIG)</button>
      <div id="res-neo-lub" class="result-box"></div>
    </div>

    <div class="card">
      <div class="card-header"><h2>Icterícia Neonatal (parâmetros SBP)</h2></div>

      <div class="grid-2">
        <div>
          <label>IG (semanas)</label>
          <input type="number" id="ict-ig" min="24" step="1">
        </div>
        <div>
          <label>Horas de vida</label>
          <input type="number" id="ict-horas" min="0" step="1">
        </div>
      </div>

      <label>Bilirrubina Total (mg/dL)</label>
      <input type="number" id="ict-bt" step="0.1" min="0">

      <label>Fatores de risco</label>
      <div style="margin-top:8px">
        <label style="font-weight:600;color:#2c3e50"><input type="checkbox" class="ict-risk"> Hemólise</label>
        <label style="font-weight:600;color:#2c3e50"><input type="checkbox" class="ict-risk"> Sepse / instabilidade clínica</label>
        <label style="font-weight:600;color:#2c3e50"><input type="checkbox" class="ict-risk"> Prematuridade limítrofe</label>
        <label style="font-weight:600;color:#2c3e50"><input type="checkbox" class="ict-risk"> Hipoalbuminemia</label>
      </div>

      <button class="calc-btn" id="btn-neo-ict">Avaliar Conduta</button>
      <div id="res-ict" class="result-box"></div>

      <div class="muted warn">
        O bloco ≥35 semanas continua pronto para receber a tabela oficial completa por horas de vida.
      </div>
    </div>
  `;

  bindNeonatoEvents();
  toggleNeoInputMode();
}

function bindNeonatoEvents() {
  byId('neo-modo')?.addEventListener('change', toggleNeoInputMode);
  byId('btn-neo-ig')?.addEventListener('click', handleCalculateIGDPP);
  byId('btn-neo-igcorr')?.addEventListener('click', handleCalculateCorrectedIG);
  byId('btn-neo-intergrowth')?.addEventListener('click', handleCalculateIntergrowth);
  byId('btn-neo-ict')?.addEventListener('click', handleCalculateIctericia);
}

function toggleNeoInputMode() {
  const mode = byId('neo-modo')?.value || 'dum';
  const dumBox = byId('box-dum');
  const usgBox = byId('box-usg');

  if (dumBox) dumBox.style.display = mode === 'dum' ? 'block' : 'none';
  if (usgBox) usgBox.style.display = mode === 'usg' ? 'block' : 'none';
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

  if (result.error) {
    return showResult('res-neo-ig', result.error);
  }

  showResult(
    'res-neo-ig',
    `IG na data informada: ${result.weeks} semanas e ${result.days} dias\nDPP estimada: ${result.dpp.toLocaleDateString('pt-BR')}`
  );
}

function handleCalculateCorrectedIG() {
  const result = calculateCorrectedPostnatalIG({
    birthIGWeeks: Number(byId('neo-ig-nasc-sem')?.value),
    birthIGDays: Number(byId('neo-ig-nasc-dias')?.value),
    birthDate: byId('neo-data-nasc')?.value,
    calcDate: byId('neo-data-posnatal')?.value
  });

  if (result.error) {
    return showResult('res-neo-igcorr', result.error);
  }

  showResult(
    'res-neo-igcorr',
    `IG corrigida: ${result.weeks} semanas e ${result.days} dias\nTempo pós-natal considerado: ${result.postnatalDays} dia(s)`
  );
}

function handleCalculateIntergrowth() {
  const result = calculateIntergrowthClassification({
    sex: byId('neo-ig-sexo')?.value,
    weeks: Number(byId('neo-lub-ig-sem')?.value),
    days: Number(byId('neo-lub-ig-dias')?.value),
    weightGrams: Number(byId('neo-lub-peso')?.value)
  });

  if (result.error) {
    return showResult('res-neo-lub', result.error);
  }

  const sexLabel = byId('neo-ig-sexo')?.value === 'M' ? 'Meninos' : 'Meninas';
  const weightGrams = Number(byId('neo-lub-peso')?.value);

  showResult(
    'res-neo-lub',
    [
      `INTERGROWTH-21st (${sexLabel} • ${result.domain === 'veryPreterm' ? 'Very-Preterm' : 'Newborn'})`,
      `IG: ${result.key}`,
      `Peso: ${weightGrams} g (${(weightGrams / 1000).toFixed(3)} kg)`,
      '',
      `P10: ${result.p10Kg.toFixed(2)} kg (${Math.round(result.p10Kg * 1000)} g)`,
      `P90: ${result.p90Kg.toFixed(2)} kg (${Math.round(result.p90Kg * 1000)} g)`,
      '',
      `Classificação: ${result.classification}`
    ].join('\n')
  );
}

function handleCalculateIctericia() {
  const hasRisk = Array.from(document.querySelectorAll('.ict-risk')).some((el) => el.checked);

  const result = calculateIctericiaSBP2021({
    gaWeeks: Number(byId('ict-ig')?.value),
    hours: Number(byId('ict-horas')?.value),
    bt: Number(byId('ict-bt')?.value),
    hasRisk
  });

  if (result.error) {
    return showResult('res-ict', result.error);
  }

  const bt = Number(byId('ict-bt')?.value);
  const ga = Number(byId('ict-ig')?.value);
  const hours = Number(byId('ict-horas')?.value);

  if (result.group === 'pre35') {
    return showResult(
      'res-ict',
      [
        'SBP 2021 — RN <35 semanas',
        `IG: ${ga} sem | Horas: ${hours}h | Risco: ${hasRisk ? 'Sim (limite inferior)' : 'Não (limite superior)'}`,
        `BT: ${bt.toFixed(1)} mg/dL`,
        '',
        `Limiar fototerapia: ${result.photoThreshold.toFixed(1)} mg/dL`,
        `Limiar exsanguíneo: ${result.exchThreshold.toFixed(1)} mg/dL`,
        '',
        `Conduta: ${result.recommendation}`,
        '',
        result.guidance || ''
      ].join('\n')
    );
  }

  if (result.group === 'ge35-unfilled') {
    return showResult(
      'res-ict',
      [
        'SBP 2021 — RN ≥35 semanas',
        'Sem tabela preenchida para essa idade em horas/IG.',
        '',
        `Conduta: ${result.recommendation || 'Revisar manualmente.'}`
      ].join('\n')
    );
  }

  return showResult(
    'res-ict',
    [
      'SBP 2021 — RN ≥35 semanas',
      `Grupo IG: ${result.igGroupName}`,
      `Horas: ${hours}h`,
      `BT: ${bt.toFixed(1)} mg/dL`,
      '',
      `Limiar fototerapia: ${result.photoThreshold.toFixed(1)} mg/dL`,
      `Limiar exsanguíneo: ${result.exchThreshold.toFixed(1)} mg/dL`,
      '',
      hasRisk
        ? `Fator de risco: Sim — limiares reduzidos em ${result.riskReduction} mg/dL`
        : 'Fator de risco: Não',
      '',
      `Conduta: ${result.recommendation}`,
      '',
      result.guidance || ''
    ].join('\n')
  );
}
