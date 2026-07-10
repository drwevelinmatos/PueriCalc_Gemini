import { byId } from '../../utils/dom.js';
import {
  formatBR,
  laserEnergyPerPoint,
  laserTotalEnergy,
  laserDensity,
  laserTotalTime,
  formatLaserTime,
  fillDateTimeIfEmpty,
  copyTextareaValue,
  saveLocal,
  loadLocal,
  printLaserArea
} from './shared.js';

const STORAGE_KEY = 'puericalc_laser_feridas';

export function initFeridas() {
  const root = byId('laser-panel-feridas');
  if (!root) return;

  root.innerHTML = `
    <div class="laser-panel-head">
      <h3>Feridas</h3>
      <p>Planejamento local por ponto, densidade energética e geração de texto clínico.</p>
    </div>

    <div class="laser-card">
      <div class="quick-actions">
        <button class="mini-btn" data-preset="reparo">Preset reparo</button>
        <button class="mini-btn" data-preset="inflamacao">Preset inflamação</button>
        <button class="mini-btn" data-preset="analgesia">Preset analgesia</button>
        <button class="mini-btn" data-preset="cicatrizacao">Preset cicatrização</button>
      </div>

      <div class="form-grid">
        <div class="input-group full">
          <label for="feridas_paciente">Paciente</label>
          <input type="text" id="feridas_paciente" placeholder="Nome do paciente">
        </div>

        <div class="input-group">
          <label for="feridas_modo">Modo clínico</label>
          <select id="feridas_modo">
            <option value="pediatrico">Pediátrico</option>
            <option value="adulto">Adulto</option>
          </select>
        </div>

        <div class="input-group">
          <label for="feridas_area_nome">Área tratada</label>
          <input type="text" id="feridas_area_nome" placeholder="Ex: joelho / abdome / perna">
        </div>

        <div class="input-group">
          <label for="feridas_objetivo">Objetivo clínico</label>
          <select id="feridas_objetivo">
            <option value="reparo">Reparo tecidual</option>
            <option value="inflamacao">Modulação inflamatória</option>
            <option value="analgesia">Analgesia</option>
            <option value="cicatrizacao">Cicatrização</option>
          </select>
        </div>

        <div class="input-group">
          <label for="feridas_lambda">Comprimento de onda (nm)</label>
          <input type="number" id="feridas_lambda" value="660">
        </div>

        <div class="input-group">
          <label for="feridas_potencia">Potência (mW)</label>
          <input type="number" id="feridas_potencia" value="100" step="0.01">
        </div>

        <div class="input-group">
          <label for="feridas_tempo">Tempo por ponto (s)</label>
          <input type="number" id="feridas_tempo" value="10" step="0.01">
        </div>

        <div class="input-group">
          <label for="feridas_pontos">Número de pontos</label>
          <input type="number" id="feridas_pontos" value="10" step="1">
        </div>

        <div class="input-group">
          <label for="feridas_area_cm2">Área estimada da lesão (cm²)</label>
          <input type="number" id="feridas_area_cm2" value="4" step="0.01">
        </div>

        <div class="input-group">
          <label for="feridas_frequencia">Frequência sugerida</label>
          <input type="text" id="feridas_frequencia" placeholder="Ex: 2x/semana">
        </div>

        <div class="meta-grid full">
          <div class="input-group">
            <label for="feridas_data">Data</label>
            <input type="date" id="feridas_data">
          </div>
          <div class="input-group">
            <label for="feridas_hora">Hora</label>
            <input type="time" id="feridas_hora">
          </div>
        </div>

        <div class="input-group full">
          <label for="feridas_observacoes">Observações clínicas</label>
          <textarea id="feridas_observacoes" placeholder="Aspecto da lesão, dor, exsudato, bordas, sinais inflamatórios..."></textarea>
        </div>

        <div class="input-group full">
          <label for="feridas_intercorrencias">Intercorrências / tolerância</label>
          <textarea id="feridas_intercorrencias" placeholder="Ex: sem intercorrências, boa tolerância..."></textarea>
        </div>
      </div>

      <div class="checklist-grid">
        <label class="check-item"><input type="checkbox" id="feridas_chk_foto"> Registro fotográfico</label>
        <label class="check-item"><input type="checkbox" id="feridas_chk_higiene"> Higienização prévia</label>
        <label class="check-item"><input type="checkbox" id="feridas_chk_dor"> Dor avaliada</label>
        <label class="check-item"><input type="checkbox" id="feridas_chk_reavaliacao"> Reavaliação programada</label>
      </div>

      <div class="laser-results-grid">
        <div class="laser-result-card">
          <small>Energia por ponto</small>
          <strong id="feridas_j_ponto">—</strong>
        </div>
        <div class="laser-result-card">
          <small>Energia total</small>
          <strong id="feridas_j_total">—</strong>
        </div>
        <div class="laser-result-card">
          <small>Densidade energética</small>
          <strong id="feridas_densidade">—</strong>
        </div>
        <div class="laser-result-card laser-result-highlight">
          <small>Tempo total</small>
          <strong id="feridas_tempo_total">—</strong>
        </div>
      </div>

      <div class="laser-note-box">
        <h4>Sugestão clínica</h4>
        <div class="protocol-text" id="feridas_protocolo">Preencha os campos para visualizar a sugestão.</div>
      </div>

      <div class="actions-row">
        <button class="btn-primary" id="btn-feridas-prontuario">Gerar texto para prontuário</button>
        <button class="btn-secondary" id="btn-feridas-copiar">Copiar texto</button>
      </div>

      <div class="form-toolbar hidden-print">
        <button class="btn-tertiary" id="btn-feridas-resumo">Gerar resumo</button>
        <button class="btn-tertiary" id="btn-feridas-salvar">Salvar localmente</button>
        <button class="btn-tertiary" id="btn-feridas-carregar">Carregar salvo</button>
        <button class="btn-tertiary" id="btn-feridas-limpar">Limpar</button>
        <button class="btn-tertiary" id="btn-feridas-imprimir">Imprimir</button>
      </div>

      <div class="prontuario-box" id="feridas_box" style="display:none;">
        <h4>Texto para prontuário</h4>
        <textarea id="feridas_prontuario" readonly></textarea>
      </div>

      <div class="print-area" id="feridas_print_area">
        <div class="print-sheet">
          <div class="print-header">
            <div>
              <div class="print-brand">PueriCalc • Laserterapia</div>
              <div class="print-subbrand">Registro clínico assistencial</div>
            </div>
            <div class="badge-soft">Feridas</div>
          </div>
          <div class="print-body"></div>
          <div class="signature-box">
            Dr. Wevelin Matos<br>
            Pediatria • Cardiologia Pediátrica • Laserterapia
          </div>
        </div>
      </div>
    </div>
  `;

  bindFeridas();
  calculateFeridas();
}

function bindFeridas() {
  const reactiveIds = [
    'feridas_paciente',
    'feridas_modo',
    'feridas_area_nome',
    'feridas_objetivo',
    'feridas_lambda',
    'feridas_potencia',
    'feridas_tempo',
    'feridas_pontos',
    'feridas_area_cm2',
    'feridas_frequencia',
    'feridas_data',
    'feridas_hora',
    'feridas_observacoes',
    'feridas_intercorrencias',
    'feridas_chk_foto',
    'feridas_chk_higiene',
    'feridas_chk_dor',
    'feridas_chk_reavaliacao'
  ];

  reactiveIds.forEach((id) => {
    byId(id)?.addEventListener('input', calculateFeridas);
    byId(id)?.addEventListener('change', calculateFeridas);
  });

  document.querySelectorAll('#laser-panel-feridas [data-preset]').forEach((btn) => {
    btn.addEventListener('click', () => applyFeridasPreset(btn.dataset.preset));
  });

  byId('btn-feridas-prontuario')?.addEventListener('click', generateFeridasNote);
  byId('btn-feridas-copiar')?.addEventListener('click', copyFeridasNote);
  byId('btn-feridas-resumo')?.addEventListener('click', generateFeridasSummary);
  byId('btn-feridas-salvar')?.addEventListener('click', saveFeridasLocal);
  byId('btn-feridas-carregar')?.addEventListener('click', loadFeridasLocal);
  byId('btn-feridas-limpar')?.addEventListener('click', clearFeridas);
  byId('btn-feridas-imprimir')?.addEventListener('click', printFeridas);
}

function applyFeridasPreset(type) {
  const mode = byId('feridas_modo')?.value || 'pediatrico';

  const presets = {
    reparo: { lambda: 660, potencia: 100, tempo: mode === 'pediatrico' ? 8 : 10, pontos: 8, frequencia: '2–3x/semana' },
    inflamacao: { lambda: 660, potencia: 100, tempo: mode === 'pediatrico' ? 6 : 8, pontos: 8, frequencia: '2x/semana' },
    analgesia: { lambda: 808, potencia: 100, tempo: mode === 'pediatrico' ? 6 : 8, pontos: 6, frequencia: '2–3x/semana' },
    cicatrizacao: { lambda: 660, potencia: 100, tempo: mode === 'pediatrico' ? 8 : 10, pontos: 10, frequencia: '2–3x/semana' }
  };

  const preset = presets[type];
  if (!preset) return;

  byId('feridas_objetivo').value = type;
  byId('feridas_lambda').value = preset.lambda;
  byId('feridas_potencia').value = preset.potencia;
  byId('feridas_tempo').value = preset.tempo;
  byId('feridas_pontos').value = preset.pontos;
  byId('feridas_frequencia').value = preset.frequencia;

  calculateFeridas();
}

function collectFeridas() {
  fillDateTimeIfEmpty('feridas_data', 'feridas_hora');

  const data = {
    paciente: byId('feridas_paciente')?.value?.trim() || '',
    modo: byId('feridas_modo')?.value || 'pediatrico',
    areaNome: byId('feridas_area_nome')?.value?.trim() || '',
    objetivo: byId('feridas_objetivo')?.value || 'reparo',
    lambda: parseFloat(byId('feridas_lambda')?.value),
    potencia: parseFloat(byId('feridas_potencia')?.value),
    tempo: parseFloat(byId('feridas_tempo')?.value),
    pontos: parseFloat(byId('feridas_pontos')?.value),
    areaCm2: parseFloat(byId('feridas_area_cm2')?.value),
    frequencia: byId('feridas_frequencia')?.value?.trim() || '',
    data: byId('feridas_data')?.value || '',
    hora: byId('feridas_hora')?.value || '',
    observacoes: byId('feridas_observacoes')?.value?.trim() || '',
    intercorrencias: byId('feridas_intercorrencias')?.value?.trim() || '',
    chkFoto: !!byId('feridas_chk_foto')?.checked,
    chkHigiene: !!byId('feridas_chk_higiene')?.checked,
    chkDor: !!byId('feridas_chk_dor')?.checked,
    chkReavaliacao: !!byId('feridas_chk_reavaliacao')?.checked
  };

  if ([data.lambda, data.potencia, data.tempo, data.pontos, data.areaCm2].some((v) => Number.isNaN(v) || v <= 0)) {
    return null;
  }

  data.energiaPonto = laserEnergyPerPoint(data.potencia, data.tempo);
  data.energiaTotal = laserTotalEnergy(data.energiaPonto, data.pontos);
  data.densidade = laserDensity(data.energiaTotal, data.areaCm2);
  data.tempoTotal = laserTotalTime(data.tempo, data.pontos);

  data.checklist = [
    data.chkFoto ? 'registro fotográfico realizado' : null,
    data.chkHigiene ? 'higienização prévia realizada' : null,
    data.chkDor ? 'dor avaliada' : null,
    data.chkReavaliacao ? 'reavaliação programada' : null
  ].filter(Boolean);

  return data;
}

function calculateFeridas() {
  const data = collectFeridas();

  if (!data) {
    ['feridas_j_ponto', 'feridas_j_total', 'feridas_densidade', 'feridas_tempo_total'].forEach((id) => {
      byId(id).textContent = '—';
    });
    byId('feridas_protocolo').textContent = 'Preencha os campos para visualizar a sugestão.';
    return null;
  }

  const goalMap = {
    reparo: 'estímulo ao reparo tecidual',
    inflamacao: 'modulação inflamatória local',
    analgesia: 'analgesia local',
    cicatrizacao: 'suporte à cicatrização'
  };

  byId('feridas_j_ponto').textContent = `${formatBR(data.energiaPonto, 2)} J`;
  byId('feridas_j_total').textContent = `${formatBR(data.energiaTotal, 2)} J`;
  byId('feridas_densidade').textContent = `${formatBR(data.densidade, 2)} J/cm²`;
  byId('feridas_tempo_total').textContent = formatLaserTime(data.tempoTotal);

  byId('feridas_protocolo').textContent = [
    `Modo clínico: ${data.modo}`,
    `Área: ${data.areaNome || 'não informada'}`,
    `Objetivo principal: ${goalMap[data.objetivo] || 'suporte tecidual local'}`,
    `Comprimento de onda: ${formatBR(data.lambda, 0)} nm`,
    `Energia por ponto: ${formatBR(data.energiaPonto, 2)} J`,
    `Número de pontos: ${formatBR(data.pontos, 0)}`,
    `Energia total estimada: ${formatBR(data.energiaTotal, 2)} J`,
    `Densidade energética estimada: ${formatBR(data.densidade, 2)} J/cm²`,
    `Frequência sugerida: ${data.frequencia || 'não informada'}`,
    `Checklist: ${data.checklist.length ? data.checklist.join(', ') : 'sem itens marcados'}`,
    `Observações: ${data.observacoes || 'não informadas'}`
  ].join('\n');

  return data;
}

function generateFeridasNote() {
  const data = calculateFeridas();
  if (!data) {
    alert('Preencha os campos corretamente primeiro.');
    return;
  }

  byId('feridas_prontuario').value = [
    `EVOLUÇÃO TERAPÊUTICA - LASERTERAPIA EM FERIDAS (${data.data || new Date().toLocaleDateString('pt-BR')})`,
    `Paciente: ${data.paciente || 'Não informado'}`,
    `Modo clínico: ${data.modo}`,
    `Área tratada: ${data.areaNome || 'Não informada'}`,
    '',
    'Técnica:',
    'Fotobiomodulação local em área de reparo tecidual / lesão cutânea.',
    '',
    'Parâmetros:',
    `Comprimento de onda: ${formatBR(data.lambda, 0)} nm`,
    `Potência: ${formatBR(data.potencia, 0)} mW`,
    `Tempo por ponto: ${formatBR(data.tempo, 0)} s`,
    `Número de pontos: ${formatBR(data.pontos, 0)}`,
    `Energia por ponto: ${formatBR(data.energiaPonto, 2)} J`,
    `Energia total: ${formatBR(data.energiaTotal, 2)} J`,
    `Área estimada: ${formatBR(data.areaCm2, 2)} cm²`,
    `Densidade energética estimada: ${formatBR(data.densidade, 2)} J/cm²`,
    `Frequência sugerida: ${data.frequencia || 'não informada'}`,
    '',
    'Checklist assistencial:',
    `${data.checklist.length ? '- ' + data.checklist.join('\n- ') : '- sem itens adicionais marcados'}`,
    '',
    'Observações clínicas:',
    `${data.observacoes || 'Não informadas.'}`,
    '',
    'Intercorrências / tolerância:',
    `${data.intercorrencias || 'Sem intercorrências, boa tolerância.'}`,
    '',
    'Evolução:',
    'Procedimento realizado conforme planejamento terapêutico, mantendo seguimento clínico e reavaliação seriada da lesão.'
  ].join('\n');

  byId('feridas_box').style.display = 'block';
}

async function copyFeridasNote() {
  if (!byId('feridas_prontuario')?.value?.trim()) {
    generateFeridasNote();
  }

  const ok = await copyTextareaValue('feridas_prontuario');
  alert(ok ? 'Texto copiado para a área de transferência.' : 'Não foi possível copiar o texto.');
}

function generateFeridasSummary() {
  const data = calculateFeridas();
  if (!data) return;

  byId('feridas_prontuario').value = [
    'LASERTERAPIA EM FERIDAS',
    `Data: ${data.data}`,
    `Hora: ${data.hora}`,
    `Paciente: ${data.paciente || 'Não informado'}`,
    `Área: ${data.areaNome || 'Não informada'}`,
    `Energia total: ${formatBR(data.energiaTotal, 2)} J`,
    `Densidade: ${formatBR(data.densidade, 2)} J/cm²`,
    `Frequência: ${data.frequencia || 'não informada'}`,
    `Intercorrências: ${data.intercorrencias || 'sem intercorrências'}`
  ].join('\n');

  byId('feridas_box').style.display = 'block';
}

function saveFeridasLocal() {
  const data = calculateFeridas();
  if (!data) {
    alert('Preencha os campos corretamente primeiro.');
    return;
  }

  saveLocal(STORAGE_KEY, data);
  alert('Dados salvos localmente.');
}

function loadFeridasLocal() {
  const data = loadLocal(STORAGE_KEY);
  if (!data) {
    alert('Nenhum salvamento local encontrado.');
    return;
  }

  Object.entries({
    feridas_paciente: data.paciente,
    feridas_modo: data.modo,
    feridas_area_nome: data.areaNome,
    feridas_objetivo: data.objetivo,
    feridas_lambda: data.lambda,
    feridas_potencia: data.potencia,
    feridas_tempo: data.tempo,
    feridas_pontos: data.pontos,
    feridas_area_cm2: data.areaCm2,
    feridas_frequencia: data.frequencia,
    feridas_data: data.data,
    feridas_hora: data.hora,
    feridas_observacoes: data.observacoes,
    feridas_intercorrencias: data.intercorrencias
  }).forEach(([id, value]) => {
    if (byId(id)) byId(id).value = value ?? '';
  });

  byId('feridas_chk_foto').checked = !!data.chkFoto;
  byId('feridas_chk_higiene').checked = !!data.chkHigiene;
  byId('feridas_chk_dor').checked = !!data.chkDor;
  byId('feridas_chk_reavaliacao').checked = !!data.chkReavaliacao;

  calculateFeridas();
  alert('Dados carregados.');
}

function clearFeridas() {
  [
    'feridas_paciente',
    'feridas_area_nome',
    'feridas_frequencia',
    'feridas_data',
    'feridas_hora',
    'feridas_observacoes',
    'feridas_intercorrencias'
  ].forEach((id) => {
    if (byId(id)) byId(id).value = '';
  });

  byId('feridas_modo').value = 'pediatrico';
  byId('feridas_objetivo').value = 'reparo';
  byId('feridas_lambda').value = '660';
  byId('feridas_potencia').value = '100';
  byId('feridas_tempo').value = '10';
  byId('feridas_pontos').value = '10';
  byId('feridas_area_cm2').value = '4';

  ['feridas_chk_foto', 'feridas_chk_higiene', 'feridas_chk_dor', 'feridas_chk_reavaliacao'].forEach((id) => {
    byId(id).checked = false;
  });

  byId('feridas_prontuario').value = '';
  byId('feridas_box').style.display = 'none';

  calculateFeridas();
}

function printFeridas() {
  const data = calculateFeridas();
  if (!data) {
    alert('Preencha os campos corretamente primeiro.');
    return;
  }

  printLaserArea(
    'feridas_print_area',
    [
      'LASERTERAPIA EM FERIDAS',
      `Data: ${data.data}`,
      `Hora: ${data.hora}`,
      '',
      `Paciente: ${data.paciente || 'Não informado'}`,
      `Modo clínico: ${data.modo}`,
      `Área tratada: ${data.areaNome || 'Não informada'}`,
      '',
      'Parâmetros:',
      `Comprimento de onda: ${formatBR(data.lambda, 0)} nm`,
      `Potência: ${formatBR(data.potencia, 0)} mW`,
      `Tempo por ponto: ${formatBR(data.tempo, 0)} s`,
      `Número de pontos: ${formatBR(data.pontos, 0)}`,
      `Energia por ponto: ${formatBR(data.energiaPonto, 2)} J`,
      `Energia total: ${formatBR(data.energiaTotal, 2)} J`,
      `Área estimada: ${formatBR(data.areaCm2, 2)} cm²`,
      `Densidade energética: ${formatBR(data.densidade, 2)} J/cm²`,
      `Frequência sugerida: ${data.frequencia || 'não informada'}`,
      '',
      'Observações:',
      `${data.observacoes || 'Não informadas.'}`,
      '',
      'Intercorrências:',
      `${data.intercorrencias || 'Sem intercorrências, boa tolerância.'}`
    ].join('\n')
  );
}
