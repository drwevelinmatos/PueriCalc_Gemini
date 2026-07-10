import { byId } from '../../utils/dom.js';
import { formatBR, copyTextareaValue } from './shared.js';

export function initILIB() {
  const root = byId('laser-panel-ilib');
  if (!root) return;

  root.innerHTML = `
    <div class="laser-panel-head">
      <h3>ILIB</h3>
      <p>Fotobiomodulação sistêmica com cálculo de volemia, tempo, energia e texto de prontuário.</p>
    </div>

    <div class="laser-card">
      <div class="form-grid">
        <div class="input-group full">
          <label for="ilib_nome">Paciente</label>
          <input type="text" id="ilib_nome" placeholder="Nome do paciente">
        </div>

        <div class="input-group">
          <label for="ilib_idade">Idade</label>
          <div class="input-row">
            <input type="number" id="ilib_idade" placeholder="Qtd">
            <select id="ilib_unidade">
              <option value="anos">anos</option>
              <option value="meses">meses</option>
            </select>
          </div>
        </div>

        <div class="input-group">
          <label for="ilib_peso">Peso (kg)</label>
          <input type="number" id="ilib_peso" step="0.01" placeholder="Ex: 12.5">
        </div>

        <div class="input-group">
          <label for="ilib_potencia">Potência (mW)</label>
          <input type="number" id="ilib_potencia" value="100" step="0.01">
        </div>

        <div class="input-group">
          <label for="ilib_ciclos">Volemias / ciclos</label>
          <input type="number" id="ilib_ciclos" value="6" step="1">
        </div>

        <div class="input-group">
          <label for="ilib_area">Área estimada do feixe / spot (cm²)</label>
          <input type="number" id="ilib_area" value="0.04" step="0.01">
        </div>

        <div class="input-group full">
          <label for="ilib_indicacao">Indicação clínica</label>
          <select id="ilib_indicacao">
            <option value="modulacao">Modulação inflamatória / suporte sistêmico</option>
            <option value="dor">Dor / recuperação funcional</option>
            <option value="mucosite">Mucosite / inflamação de mucosas</option>
            <option value="dermato">Dermatologia / reparo tecidual</option>
            <option value="adjuvante">Protocolo adjuvante geral</option>
          </select>
        </div>
      </div>

      <div class="laser-results-grid">
        <div class="laser-result-card">
          <small>Faixa etária / fator</small>
          <strong id="ilib_fator">—</strong>
        </div>
        <div class="laser-result-card">
          <small>Volemia estimada</small>
          <strong id="ilib_volemia">—</strong>
        </div>
        <div class="laser-result-card">
          <small>Tempo por volemia</small>
          <strong id="ilib_ciclo">—</strong>
        </div>
        <div class="laser-result-card">
          <small>Energia total</small>
          <strong id="ilib_joules">—</strong>
        </div>
        <div class="laser-result-card">
          <small>Densidade energética</small>
          <strong id="ilib_densidade">—</strong>
        </div>
        <div class="laser-result-card laser-result-highlight">
          <small>Tempo total da sessão</small>
          <strong id="ilib_tempo">—</strong>
        </div>
      </div>

      <div class="laser-note-box">
        <h4>Sugestão automática de protocolo</h4>
        <div id="ilib_protocolo" class="protocol-text">Preencha os campos para visualizar a sugestão.</div>
      </div>

      <div class="actions-row">
        <button class="btn-primary" id="btn-ilib-prontuario">Gerar texto para prontuário</button>
        <button class="btn-secondary" id="btn-ilib-copiar">Copiar texto</button>
      </div>

      <div class="prontuario-box" id="ilib_box" style="display:none;">
        <h4>Texto para prontuário</h4>
        <textarea id="ilib_prontuario" readonly></textarea>
      </div>
    </div>
  `;

  bindILIBEvents();
}

function bindILIBEvents() {
  [
    'ilib_nome',
    'ilib_idade',
    'ilib_unidade',
    'ilib_peso',
    'ilib_potencia',
    'ilib_ciclos',
    'ilib_area',
    'ilib_indicacao'
  ].forEach((id) => {
    byId(id)?.addEventListener('input', calculateILIB);
    byId(id)?.addEventListener('change', calculateILIB);
  });

  byId('btn-ilib-prontuario')?.addEventListener('click', generateILIBNote);
  byId('btn-ilib-copiar')?.addEventListener('click', copyILIBNote);
}

function getAgeRange(ageYears) {
  if (ageYears < 1) {
    return {
      factor: 90,
      label: 'Lactente (< 1 ano)',
      suggestion: 'Sessões mais conservadoras, com monitorização da tolerância clínica e individualização do tempo.'
    };
  }

  if (ageYears < 12) {
    return {
      factor: 80,
      label: 'Criança (1 a < 12 anos)',
      suggestion: 'Individualizar parâmetros conforme quadro clínico, objetivo terapêutico e resposta evolutiva.'
    };
  }

  if (ageYears >= 65) {
    return {
      factor: 65,
      label: 'Idoso (≥ 65 anos)',
      suggestion: 'Considerar maior individualização do protocolo e da frequência de sessões.'
    };
  }

  return {
    factor: 70,
    label: 'Adolescente / adulto',
    suggestion: 'Faixa de estimativa padrão para cálculo da volemia.'
  };
}

function getIndicationInfo(indication) {
  const map = {
    modulacao: {
      frequency: '2 a 3x/semana',
      goal: 'modulação inflamatória e suporte sistêmico',
      note: 'reavaliar resposta clínica após 4 a 6 sessões'
    },
    dor: {
      frequency: '2 a 3x/semana',
      goal: 'analgesia e recuperação funcional',
      note: 'considerar associação com protocolo local quando indicado'
    },
    mucosite: {
      frequency: 'diário ou em dias alternados',
      goal: 'controle inflamatório e reparo de mucosa',
      note: 'frequentemente útil em associação com aplicação local'
    },
    dermato: {
      frequency: '1 a 3x/semana',
      goal: 'reparo tecidual e modulação inflamatória cutânea',
      note: 'individualizar conforme área, profundidade e evolução'
    },
    adjuvante: {
      frequency: '1 a 2x/semana',
      goal: 'suporte sistêmico adjuvante',
      note: 'ajustar conforme quadro clínico e resposta'
    }
  };

  return map[indication] || map.modulacao;
}

function calculateILIB() {
  const name = byId('ilib_nome')?.value?.trim() || '';
  const age = parseFloat(byId('ilib_idade')?.value);
  const unit = byId('ilib_unidade')?.value || 'anos';
  const weight = parseFloat(byId('ilib_peso')?.value);
  const power = parseFloat(byId('ilib_potencia')?.value);
  const cycles = parseFloat(byId('ilib_ciclos')?.value);
  const area = parseFloat(byId('ilib_area')?.value);
  const indication = byId('ilib_indicacao')?.value || 'modulacao';

  if ([age, weight, power, cycles, area].some((v) => Number.isNaN(v) || v <= 0)) {
    ['ilib_fator', 'ilib_volemia', 'ilib_ciclo', 'ilib_joules', 'ilib_densidade', 'ilib_tempo'].forEach((id) => {
      const el = byId(id);
      if (el) el.textContent = '—';
    });
    byId('ilib_protocolo').textContent = 'Preencha os campos para visualizar a sugestão.';
    return null;
  }

  const ageYears = unit === 'meses' ? age / 12 : age;
  const ageRange = getAgeRange(ageYears);
  const indicationInfo = getIndicationInfo(indication);

  const bloodVolume = weight * ageRange.factor;
  const timePerCycle = bloodVolume / 5000;
  const totalTime = timePerCycle * cycles;
  const joules = power * totalTime * 0.06;
  const density = joules / area;

  byId('ilib_fator').textContent = `${ageRange.label} • ${ageRange.factor} mL/kg`;
  byId('ilib_volemia').textContent = `${formatBR(bloodVolume, 0)} mL`;
  byId('ilib_ciclo').textContent = `${formatBR(timePerCycle, 2)} min`;
  byId('ilib_joules').textContent = `${formatBR(joules, 2)} J`;
  byId('ilib_densidade').textContent = `${formatBR(density, 2)} J/cm²`;
  byId('ilib_tempo').textContent = `${formatBR(totalTime, 1)} min`;

  byId('ilib_protocolo').textContent = [
    `Faixa etária: ${ageRange.label}`,
    `Sugestão geral: ${ageRange.suggestion}`,
    `Indicação principal: ${indicationInfo.goal}`,
    `Frequência sugerida: ${indicationInfo.frequency}`,
    `Observação clínica: ${indicationInfo.note}`,
    `Duração estimada desta sessão: ${formatBR(totalTime, 1)} min`,
    `Energia total estimada: ${formatBR(joules, 2)} J`,
    `Densidade energética estimada: ${formatBR(density, 2)} J/cm²`
  ].join('\n');

  return {
    name,
    age,
    unit,
    ageYears,
    weight,
    power,
    cycles,
    area,
    indication,
    ageRange,
    bloodVolume,
    timePerCycle,
    totalTime,
    joules,
    density,
    indicationInfo
  };
}

function generateILIBNote() {
  const data = calculateILIB();
  if (!data) {
    alert('Preencha os campos corretamente primeiro.');
    return;
  }

  const today = new Date().toLocaleDateString('pt-BR');

  byId('ilib_prontuario').value = [
    `EVOLUÇÃO TERAPÊUTICA - ILIB (${today})`,
    `Paciente: ${data.name || 'Não informado'}`,
    `Idade: ${data.age} ${data.unit}`,
    `Peso: ${formatBR(data.weight, 2)} kg`,
    '',
    'Técnica:',
    'Fotobiomodulação sistêmica transcutânea (ILIB), com aplicação em topografia vascular periférica.',
    '',
    'Parâmetros calculados:',
    `Faixa etária considerada: ${data.ageRange.label}`,
    `Fator de volemia utilizado: ${data.ageRange.factor} mL/kg`,
    `Volemia estimada: ${formatBR(data.bloodVolume, 0)} mL`,
    `Tempo estimado por volemia: ${formatBR(data.timePerCycle, 2)} min`,
    `Número de volemias programadas: ${formatBR(data.cycles, 0)}`,
    `Tempo total estimado da sessão: ${formatBR(data.totalTime, 1)} min`,
    `Potência utilizada: ${formatBR(data.power, 0)} mW`,
    `Energia total estimada: ${formatBR(data.joules, 2)} J`,
    `Área estimada do spot/feixe: ${formatBR(data.area, 2)} cm²`,
    `Densidade energética estimada: ${formatBR(data.density, 2)} J/cm²`,
    '',
    'Finalidade terapêutica:',
    `${data.indicationInfo.goal}.`,
    '',
    'Plano sugerido:',
    `Frequência sugerida: ${data.indicationInfo.frequency}.`,
    `Observação: ${data.indicationInfo.note}.`,
    '',
    'Evolução:',
    'Procedimento realizado/programado com boa tolerância, sem intercorrências imediatas. Manter acompanhamento clínico e reavaliação seriada conforme resposta terapêutica.'
  ].join('\n');

  byId('ilib_box').style.display = 'block';
}

async function copyILIBNote() {
  if (!byId('ilib_prontuario')?.value?.trim()) {
    generateILIBNote();
  }

  const ok = await copyTextareaValue('ilib_prontuario');
  alert(ok ? 'Texto copiado para a área de transferência.' : 'Não foi possível copiar o texto.');
}
