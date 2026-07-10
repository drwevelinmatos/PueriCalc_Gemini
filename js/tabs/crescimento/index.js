import { byId, showResult } from '../../utils/dom.js';
import {
  calculateGrowthVelocities,
  calculateParentalTarget
} from './logic.js';

export function renderCrescimento() {
  const root = byId('tab-cresc');
  if (!root) return;

  root.innerHTML = `
    <div class="card">
      <div class="card-header"><h2>Velocidades (PC, Peso, Estatura) — bloco único</h2></div>

      <div class="grid-2">
        <div>
          <label>Data inicial</label>
          <input type="date" id="cr-data-i">
        </div>
        <div>
          <label>Data final</label>
          <input type="date" id="cr-data-f">
        </div>
      </div>

      <div class="grid-3">
        <div>
          <label>PC inicial (cm)</label>
          <input type="number" id="cr-pc-i" step="0.1">
        </div>
        <div>
          <label>PC final (cm)</label>
          <input type="number" id="cr-pc-f" step="0.1">
        </div>
        <div>
          <label>Idade (meses) (p/ referência)</label>
          <input type="number" id="cr-idade-meses" step="0.1" min="0">
        </div>
      </div>

      <div class="grid-2">
        <div>
          <label>Peso inicial</label>
          <input type="number" id="cr-peso-i" step="1">
        </div>
        <div>
          <label>Peso final</label>
          <input type="number" id="cr-peso-f" step="1">
        </div>
      </div>

      <label>Unidade do peso</label>
      <select id="cr-peso-unid">
        <option value="g">g</option>
        <option value="kg">kg</option>
      </select>

      <div class="grid-2">
        <div>
          <label>Estatura inicial (cm)</label>
          <input type="number" id="cr-alt-i" step="0.1">
        </div>
        <div>
          <label>Estatura final (cm)</label>
          <input type="number" id="cr-alt-f" step="0.1">
        </div>
      </div>

      <button class="calc-btn" id="btn-cr-velocidades">Calcular velocidades</button>

      <div id="res-cr-peso" class="result-box"></div>
      <div id="res-cr-pc" class="result-box"></div>
      <div id="res-cr-alt" class="result-box"></div>
      <div id="ref-cr" class="result-box"></div>
    </div>

    <div class="card">
      <div class="card-header"><h2>Alvo parental + Idade óssea + Análise integrada</h2></div>

      <div class="grid-2">
        <div>
          <label>Altura do pai (cm)</label>
          <input type="number" id="ap-pai" step="0.1">
        </div>
        <div>
          <label>Altura da mãe (cm)</label>
          <input type="number" id="ap-mae" step="0.1">
        </div>
      </div>

      <label>Sexo da criança</label>
      <select id="ap-sexo">
        <option value="M">Masculino</option>
        <option value="F">Feminino</option>
      </select>

      <div class="grid-2">
        <div>
          <label>Altura atual (cm)</label>
          <input type="number" id="ap-alt-atual" step="0.1">
        </div>
        <div>
          <label>Idade cronológica (anos)</label>
          <input type="number" id="ap-idade" step="0.1">
        </div>
      </div>

      <label>Idade óssea (anos) (entrada manual)</label>
      <input type="number" id="ap-io" step="0.1">

      <button class="calc-btn" id="btn-ap-analise">Calcular e analisar</button>
      <div id="res-ap" class="result-box"></div>

      <div class="muted">
        Idade óssea aqui permanece como input clínico manual, pronta para integração posterior com regra interpretativa própria.
      </div>
    </div>
  `;

  bindCrescimentoEvents();
}

function bindCrescimentoEvents() {
  byId('btn-cr-velocidades')?.addEventListener('click', handleGrowthVelocities);
  byId('btn-ap-analise')?.addEventListener('click', handleParentalTarget);
}

function handleGrowthVelocities() {
  const result = calculateGrowthVelocities({
    startDate: byId('cr-data-i')?.value,
    endDate: byId('cr-data-f')?.value,
    headCircInitial: Number(byId('cr-pc-i')?.value),
    headCircFinal: Number(byId('cr-pc-f')?.value),
    weightInitial: Number(byId('cr-peso-i')?.value),
    weightFinal: Number(byId('cr-peso-f')?.value),
    weightUnit: byId('cr-peso-unid')?.value,
    heightInitial: Number(byId('cr-alt-i')?.value),
    heightFinal: Number(byId('cr-alt-f')?.value),
    ageMonths: Number(byId('cr-idade-meses')?.value)
  });

  if (result.error) {
    showResult('res-cr-peso', result.error);
    return;
  }

  showResult(
    'res-cr-peso',
    `Ganho ponderal: ${result.weightGainPerDay.toFixed(1)} g/dia\nΔPeso total: ${result.totalWeightDeltaG.toFixed(0)} g em ${result.days} dia(s)`
  );

  showResult(
    'res-cr-pc',
    `Velocidade de PC: ${result.headCircPerMonth.toFixed(2)} cm/mês\nΔPC total: ${result.totalHeadCircDelta.toFixed(2)} cm`
  );

  showResult(
    'res-cr-alt',
    `Velocidade de estatura: ${result.heightPerYear.toFixed(2)} cm/ano\nΔEstatura total: ${result.totalHeightDelta.toFixed(2)} cm`
  );

  if (result.references) {
    showResult(
      'ref-cr',
      [
        'Referências (placeholders):',
        `Peso (g/dia): ${result.references.peso}`,
        `PC (cm/mês): ${result.references.pc}`,
        `Estatura (cm/ano): ${result.references.altura}`,
        '',
        'ATUALIZAR_CONFORME_REFERÊNCIA: edite REF_CRESCIMENTO.'
      ].join('\n')
    );
  } else {
    showResult(
      'ref-cr',
      'Informe idade (meses) para trazer referências por faixa etária.'
    );
  }
}

function handleParentalTarget() {
  const result = calculateParentalTarget({
    fatherHeight: Number(byId('ap-pai')?.value),
    motherHeight: Number(byId('ap-mae')?.value),
    sex: byId('ap-sexo')?.value,
    currentHeight: Number(byId('ap-alt-atual')?.value),
    chronologicalAge: Number(byId('ap-idade')?.value),
    boneAge: Number(byId('ap-io')?.value)
  });

  if (result.error) {
    return showResult('res-ap', result.error);
  }

  const lines = [
    `Alvo parental: ${result.targetHeight.toFixed(1)} cm`,
    `Faixa esperada: ${result.minExpected.toFixed(1)} a ${result.maxExpected.toFixed(1)} cm`,
    '',
    `Altura atual: ${Number(byId('ap-alt-atual')?.value).toFixed(1)} cm`,
    `Diferença vs alvo: ${result.delta.toFixed(1)} cm`,
    `Interpretação: ${result.withinRange ? 'Dentro' : 'Fora'} da faixa alvo.`
  ];

  if (result.boneAge !== null) {
    lines.push(
      '',
      `Idade óssea: ${result.boneAge.toFixed(1)} anos`,
      `IO - IC: ${result.boneAgeDiff.toFixed(1)} ano(s)`,
      'Interpretação IO: PLACEHOLDER.'
    );
  } else {
    lines.push('', 'Idade óssea: não informada (opcional).');
  }

  showResult('res-ap', lines.join('\n'));
}
