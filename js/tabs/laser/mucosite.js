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

const STORAGE_KEY = 'puericalc_laser_mucosite';

export function initMucosite() {
  const root = byId('laser-panel-mucosite');
  if (!root) return;

  root.innerHTML = `
    <div class="laser-panel-head">
      <h3>mucosite</h3> 
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
          <label for="mucosite_paciente">Paciente</label>
          <input type="text" id="mucosite_paciente" placeholder="Nome do paciente">
        </div>

        <div class="input-group">
          <label for="mucosite_modo">Modo clínico</label>
          <select id="mucosite_modo">
            <option value="pediatrico">Pediátrico</option>
            <option value="adulto">Adulto</option>
          </select>
        </div>

        <div class="input-group">
          <label for="mucosite_area_nome">Área tratada</label>
          <input type="text" id="mucosite_area_nome" placeholder="Ex: joelho / abdome / perna">
        </div>

        <div class="input-group">
          <label for="mucosite_objetivo">Objetivo clínico</label>
          <select id="mucosite_objetivo">
            <option value="reparo">Reparo tecidual</option>
            <option value="inflamacao">Modulação inflamatória</option>
            <option value="analgesia">Analgesia</option>
            <option value="cicatrizacao">Cicatrização</option>
          </select>
        </div>

        <div class="input-group">
          <label for="mucosite_lambda">Comprimento de onda (nm)</label>
          <input type="number" id="mucosite_lambda" value="660">
        </div>

        <div class="input-group">
          <label for="mucosite_potencia">Potência (mW)</label>
          <input type="number" id="mucosite_potencia" value="100" step="0.01">
        </div>

        <div class="input-group">
          <label for="mucosite_tempo">Tempo por ponto (s)</label>
          <input type="number" id="mucosite_tempo" value="10" step="0.01">
        </div>

        <div class="input-group">
          <label for="mucosite_pontos">Número de pontos</label>
          <input type="number" id="mucosite_pontos" value="10" step="1">
        </div>

        <div class="input-group">
          <label for="mucosite_area_cm2">Área estimada da lesão (cm²)</label>
          <input type="number" id="mucosite_area_cm2" value="4" step="0.01">
        </div>

        <div class="input-group">
          <label for="mucosite_frequencia">Frequência sugerida</label>
          <input type="text" id="mucosite_frequencia" placeholder="Ex: 2x/semana">
        </div>

        <div class="meta-grid full">
          <div class="input-group">
            <label for="mucosite_data">Data</label>
            <input type="date" id="mucosite_data">
          </div>
          <div class="input-group">
            <label for="mucosite_hora">Hora</label>
            <input type="time" id="mucosite_hora">
          </div>
        </div>

        <div class="input-group full">
          <label for="mucosite_observacoes">Observações clínicas</label>
          <textarea id="mucosite_observacoes" placeholder="Aspecto da lesão, dor, exsudato, bordas, sinais inflamatórios..."></textarea>
        </div>

        <div class="input-group full">
          <label for="mucosite_intercorrencias">Intercorrências / tolerância</label>
          <textarea id="mucosite_intercorrencias" placeholder="Ex: sem intercorrências, boa tolerância..."></textarea>
        </div>
      </div>

      <div class="checklist-grid">
        <label class="check-item"><input type="checkbox" id="mucosite_chk_foto"> Registro fotográfico</label>
        <label class="check-item"><input type="checkbox" id="mucosite_chk_higiene"> Higienização prévia</label>
        <label class="check-item"><input type="checkbox" id="mucosite_chk_dor"> Dor avaliada</label>
        <label class="check-item"><input type="checkbox" id="mucosite_chk_reavaliacao"> Reavaliação programada</label>
      </div>

      <div class="laser-results-grid">
        <div class="laser-result-card">
          <small>Energia por ponto</small>
          <strong id="mucosite_j_ponto">—</strong>
        </div>
        <div class="laser-result-card">
          <small>Energia total</small>
          <strong id="mucosite_j_total">—</strong>
        </div>
        <div class="laser-result-card">
          <small>Densidade energética</small>
          <strong id="mucosite_densidade">—</strong>
        </div>
        <div class="laser-result-card laser-result-highlight">
          <small>Tempo total</small>
          <strong id="mucosite_tempo_total">—</strong>
        </div>
      </div>

      <div class="laser-note-box">
        <h4>Sugestão clínica</h4>
        <div class="protocol-text" id="mucosite_protocolo">Preencha os campos para visualizar a sugestão.</div>
      </div>

      <div class="actions-row">
        <button class="btn-primary" id="btn-mucosite-prontuario">Gerar texto para prontuário</button>
        <button class="btn-secondary" id="btn-mucosite-copiar">Copiar texto</button>
      </div>

      <div class="form-toolbar hidden-print">
        <button class="btn-tertiary" id="btn-mucosite-resumo">Gerar resumo</button>
        <button class="btn-tertiary" id="btn-mucosite-salvar">Salvar localmente</button>
        <button class="btn-tertiary" id="btn-mucosite-carregar">Carregar salvo</button>
        <button class="btn-tertiary" id="btn-mucosite-limpar">Limpar</button>
        <button class="btn-tertiary" id="btn-mucosite-imprimir">Imprimir</button>
      </div>

      <div class="prontuario-box" id="mucosite_box" style="display:none;">
        <h4>Texto para prontuário</h4>
        <textarea id="mucosite_prontuario" readonly></textarea>
      </div>

      <div class="print-area" id="mucosite_print_area">
        <div class="print-sheet">
          <div class="print-header">
            <div>
              <div class="print-brand">PueriCalc • Laserterapia</div>
              <div class="print-subbrand">Registro clínico assistencial</div>
            </div>
            <div class="badge-soft">mucosite</div>
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

  bindmucosite();
  calculatemucosite();
}

function bindmucosite() {
  const reactiveIds = [
    'mucosite_paciente',
    'mucosite_modo',
    'mucosite_area_nome',
    'mucosite_objetivo',
    'mucosite_lambda',
    'mucosite_potencia',
    'mucosite_tempo',
    'mucosite_pontos',
    'mucosite_area_cm2',
    'mucosite_frequencia',
    'mucosite_data',
    'mucosite_hora',
    'mucosite_observacoes',
    'mucosite_intercorrencias',
    'mucosite_chk_foto',
    'mucosite_chk_higiene',
    'mucosite_chk_dor',
    'mucosite_chk_reavaliacao'
  ];

  reactiveIds.forEach((id) => {
    byId(id)?.addEventListener('input', calculatemucosite);
    byId(id)?.addEventListener('change', calculatemucosite);
  });

  document.querySelectorAll('#laser-panel-mucosite [data-preset]').forEach((btn) => {
    btn.addEventListener('click', () => applymucositePreset(btn.dataset.preset));
  });

  byId('btn-mucosite-prontuario')?.addEventListener('click', generatemucositeNote);
  byId('btn-mucosite-copiar')?.addEventListener('click', copymucositeNote);
  byId('btn-mucosite-resumo')?.addEventListener('click', generatemucositeSummary);
  byId('btn-mucosite-salvar')?.addEventListener('click', savemucositeLocal);
  byId('btn-mucosite-carregar')?.addEventListener('click', loadmucositeLocal);
  byId('btn-mucosite-limpar')?.addEventListener('click', clearmucosite);
  byId('btn-mucosite-imprimir')?.addEventListener('click', printmucosite);
}

function applymucositePreset(type) {
  const mode = byId('mucosite_modo')?.value || 'pediatrico';

  const presets = {
    reparo: { lambda: 660, potencia: 100, tempo: mode === 'pediatrico' ? 8 : 10, pontos: 8, frequencia: '2–3x/semana' },
    inflamacao: { lambda: 660, potencia: 100, tempo: mode === 'pediatrico' ? 6 : 8, pontos: 8, frequencia: '2x/semana' },
    analgesia: { lambda: 808, potencia: 100, tempo: mode === 'pediatrico' ? 6 : 8, pontos: 6, frequencia: '2–3x/semana' },
    cicatrizacao: { lambda: 660, potencia: 100, tempo: mode === 'pediatrico' ? 8 : 10, pontos: 10, frequencia: '2–3x/semana' }
  };

  const preset = presets[type];
  if (!preset) return;

  byId('mucosite_objetivo').value = type;
  byId('mucosite_lambda').value = preset.lambda;
  byId('mucosite_potencia').value = preset.potencia;
  byId('mucosite_tempo').value = preset.tempo;
  byId('mucosite_pontos').value = preset.pontos;
  byId('mucosite_frequencia').value = preset.frequencia;

  calculatemucosite();
}

function collectmucosite() {
  fillDateTimeIfEmpty('mucosite_data', 'mucosite_hora');

  const data = {
    paciente: byId('mucosite_paciente')?.value?.trim() || '',
    modo: byId('mucosite_modo')?.value || 'pediatrico',
    areaNome: byId('mucosite_area_nome')?.value?.trim() || '',
    objetivo: byId('mucosite_objetivo')?.value || 'reparo',
    lambda: parseFloat(byId('mucosite_lambda')?.value),
    potencia: parseFloat(byId('mucosite_potencia')?.value),
    tempo: parseFloat(byId('mucosite_tempo')?.value),
    pontos: parseFloat(byId('mucosite_pontos')?.value),
    areaCm2: parseFloat(byId('mucosite_area_cm2')?.value),
    frequencia: byId('mucosite_frequencia')?.value?.trim() || '',
    data: byId('mucosite_data')?.value || '',
    hora: byId('mucosite_hora')?.value || '',
    observacoes: byId('mucosite_observacoes')?.value?.trim() || '',
    intercorrencias: byId('mucosite_intercorrencias')?.value?.trim() || '',
    chkFoto: !!byId('mucosite_chk_foto')?.checked,
    chkHigiene: !!byId('mucosite_chk_higiene')?.checked,
    chkDor: !!byId('mucosite_chk_dor')?.checked,
    chkReavaliacao: !!byId('mucosite_chk_reavaliacao')?.checked
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

function calculatemucosite() {
  const data = collectmucosite();

  if (!data) {
    ['mucosite_j_ponto', 'mucosite_j_total', 'mucosite_densidade', 'mucosite_tempo_total'].forEach((id) => {
      byId(id).textContent = '—';
    });
    byId('mucosite_protocolo').textContent = 'Preencha os campos para visualizar a sugestão.';
    return null;
  }

  const goalMap = {
    reparo: 'estímulo ao reparo tecidual',
    inflamacao: 'modulação inflamatória local',
    analgesia: 'analgesia local',
    cicatrizacao: 'suporte à cicatrização'
  };

  byId('mucosite_j_ponto').textContent = `${formatBR(data.energiaPonto, 2)} J`;
  byId('mucosite_j_total').textContent = `${formatBR(data.energiaTotal, 2)} J`;
  byId('mucosite_densidade').textContent = `${formatBR(data.densidade, 2)} J/cm²`;
  byId('mucosite_tempo_total').textContent = formatLaserTime(data.tempoTotal);

  byId('mucosite_protocolo').textContent = [
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

function generatemucositeNote() {
  const data = calculatemucosite();
  if (!data) {
    alert('Preencha os campos corretamente primeiro.');
    return;
  }

  byId('mucosite_prontuario').value = [
    `EVOLUÇÃO TERAPÊUTICA - LASERTERAPIA EM mucosite (${data.data || new Date().toLocaleDateString('pt-BR')})`,
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

  byId('mucosite_box').style.display = 'block';
}

async function copymucositeNote() {
  if (!byId('mucosite_prontuario')?.value?.trim()) {
    generatemucositeNote();
  }

  const ok = await copyTextareaValue('mucosite_prontuario');
  alert(ok ? 'Texto copiado para a área de transferência.' : 'Não foi possível copiar o texto.');
}

function generatemucositeSummary() {
  const data = calculatemucosite();
  if (!data) return;

  byId('mucosite_prontuario').value = [
    'LASERTERAPIA EM mucosite',
    `Data: ${data.data}`,
    `Hora: ${data.hora}`,
    `Paciente: ${data.paciente || 'Não informado'}`,
    `Área: ${data.areaNome || 'Não informada'}`,
    `Energia total: ${formatBR(data.energiaTotal, 2)} J`,
    `Densidade: ${formatBR(data.densidade, 2)} J/cm²`,
    `Frequência: ${data.frequencia || 'não informada'}`,
    `Intercorrências: ${data.intercorrencias || 'sem intercorrências'}`
  ].join('\n');

  byId('mucosite_box').style.display = 'block';
}

function savemucositeLocal() {
  const data = calculatemucosite();
  if (!data) {
    alert('Preencha os campos corretamente primeiro.');
    return;
  }

  saveLocal(STORAGE_KEY, data);
  alert('Dados salvos localmente.');
}

function loadmucositeLocal() {
  const data = loadLocal(STORAGE_KEY);
  if (!data) {
    alert('Nenhum salvamento local encontrado.');
    return;
  }

  Object.entries({
    mucosite_paciente: data.paciente,
    mucosite_modo: data.modo,
    mucosite_area_nome: data.areaNome,
    mucosite_objetivo: data.objetivo,
    mucosite_lambda: data.lambda,
    mucosite_potencia: data.potencia,
    mucosite_tempo: data.tempo,
    mucosite_pontos: data.pontos,
    mucosite_area_cm2: data.areaCm2,
    mucosite_frequencia: data.frequencia,
    mucosite_data: data.data,
    mucosite_hora: data.hora,
    mucosite_observacoes: data.observacoes,
    mucosite_intercorrencias: data.intercorrencias
  }).forEach(([id, value]) => {
    if (byId(id)) byId(id).value = value ?? '';
  });

  byId('mucosite_chk_foto').checked = !!data.chkFoto;
  byId('mucosite_chk_higiene').checked = !!data.chkHigiene;
  byId('mucosite_chk_dor').checked = !!data.chkDor;
  byId('mucosite_chk_reavaliacao').checked = !!data.chkReavaliacao;

  calculatemucosite();
  alert('Dados carregados.');
}

function clearmucosite() {
  [
    'mucosite_paciente',
    'mucosite_area_nome',
    'mucosite_frequencia',
    'mucosite_data',
    'mucosite_hora',
    'mucosite_observacoes',
    'mucosite_intercorrencias'
  ].forEach((id) => {
    if (byId(id)) byId(id).value = '';
  });

  byId('mucosite_modo').value = 'pediatrico';
  byId('mucosite_objetivo').value = 'reparo';
  byId('mucosite_lambda').value = '660';
  byId('mucosite_potencia').value = '100';
  byId('mucosite_tempo').value = '10';
  byId('mucosite_pontos').value = '10';
  byId('mucosite_area_cm2').value = '4';

  ['mucosite_chk_foto', 'mucosite_chk_higiene', 'mucosite_chk_dor', 'mucosite_chk_reavaliacao'].forEach((id) => {
    byId(id).checked = false;
  });

  byId('mucosite_prontuario').value = '';
  byId('mucosite_box').style.display = 'none';

  calculatemucosite();
}

function printmucosite() {
  const data = calculatemucosite();
  if (!data) {
    alert('Preencha os campos corretamente primeiro.');
    return;
  }

  printLaserArea(
    'mucosite_print_area',
    [
      'LASERTERAPIA EM mucosite',
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
