import { byId } from '../../utils/dom.js';
import { CHECK_DATA } from '../../data/checklist-data.js';

const CHECK_OPTIONS = [
  { value: '0m', label: 'Ao nascer (0 mês)' },
  { value: '1m', label: '1 mês' },
  { value: '2m', label: '2 meses' },
  { value: '3m', label: '3 meses' },
  { value: '4m', label: '4 meses' },
  { value: '5m', label: '5 meses' },
  { value: '6m', label: '6 meses' },
  { value: '7m', label: '7 meses' },
  { value: '8m', label: '8 meses' },
  { value: '9m', label: '9 meses' },
  { value: '10m', label: '10 meses' },
  { value: '11m', label: '11 meses' },
  { value: '12m', label: '12 meses' },
  { value: '13_14m', label: '13 a 14 meses' },
  { value: '15m', label: '15 meses' },
  { value: '16_17m', label: '16 a 17 meses' },
  { value: '18m', label: '18 meses' },
  { value: '19_20m', label: '19 a 20 meses' },
  { value: '21_22m', label: '21 a 22 meses' },
  { value: '23_24m', label: '23 a 24 meses' },
  { value: '2_3a', label: '2 a 3 anos' },
  { value: '3a', label: '3 anos' },
  { value: '4a', label: '4 anos' },
  { value: '5a', label: '5 anos' },
  { value: '6a', label: '6 anos' },
  { value: '7_8a', label: '7 a 8 anos' },
  { value: '9a', label: '9 anos' },
  { value: '10a', label: '10 anos' },
  { value: '11a', label: '11 anos' },
  { value: '12_14a', label: '12 a 14 anos' },
  { value: '15_19a', label: '15 a 19 anos' }
];

export function renderChecklist() {
  const root = byId('tab-check');
  if (!root) return;

  root.innerHTML = `
    <div class="card">
      <div class="card-header" style="border-color:var(--check)">
        <h2>Checklist de Puericultura, Vacinação e DNPM</h2>
      </div>

      <label>Faixa etária / idade da consulta</label>
      <select id="ck-idade">
        <option value="">Selecione...</option>
        ${CHECK_OPTIONS.map(option => `<option value="${option.value}">${option.label}</option>`).join('')}
      </select>

      <div id="check-area" style="margin-top:15px"></div>
    </div>
  `;

  bindChecklistEvents();
}

function bindChecklistEvents() {
  byId('ck-idade')?.addEventListener('change', renderCheckArea);
}

function renderCheckArea() {
  const idade = byId('ck-idade')?.value;
  const area = byId('check-area');

  if (!area) return;

  if (!idade || !CHECK_DATA[idade]) {
    area.innerHTML = '';
    return;
  }

  const data = CHECK_DATA[idade];

  area.innerHTML = `
    <div class="result-box" style="display:block">
      <span class="destaque">${escapeHtml(data.titulo)}</span>
      <div class="muted">Checklist ampliado de vacinação, rede privada/SBIm, desenvolvimento e alertas.</div>
    </div>

    <div class="check-wrap">
      ${renderList('Vacinas / condutas principais', data.vacinas, 'PNI')}
      ${renderList('Privado / SBIm / observações', data.privado, 'Privado / SBIm')}
      ${renderDNPM(data.dnpm)}
      ${renderAlerts(data.alertas)}
    </div>
  `;
}

function renderList(title, items, tag = '') {
  if (!items || !items.length) return '';

  return `
    <div class="check-block">
      ${tag ? `<div class="check-tag">${escapeHtml(tag)}</div>` : ''}
      <h3>${escapeHtml(title)}</h3>
      <ul class="check-list">
        ${items.map(item => `<li>☐ ${escapeHtml(item)}</li>`).join('')}
      </ul>
    </div>
  `;
}

function renderDNPM(dnpm) {
  if (!dnpm) return '';

  let html = `
    <div class="check-block">
      <h3>DNPM</h3>
      <div class="check-subtitle">Marcos esperados para a faixa etária</div>
  `;

  if (dnpm.social?.length) {
    html += renderDNPMSection('Social / Emocional', dnpm.social);
  }

  if (dnpm.linguagem?.length) {
    html += renderDNPMSection('Linguagem / Comunicação', dnpm.linguagem);
  }

  if (dnpm.cognitivo?.length) {
    html += renderDNPMSection('Cognitivo', dnpm.cognitivo);
  }

  if (dnpm.motor?.length) {
    html += renderDNPMSection('Movimento / Desenvolvimento físico', dnpm.motor);
  }

  if (dnpm.puberdade?.length) {
    html += renderDNPMSection('Puberdade', dnpm.puberdade);
  }

  html += `</div>`;
  return html;
}

function renderDNPMSection(title, items) {
  return `
    <div class="check-muted-box">
      <b>${escapeHtml(title)}</b><br>
      ${items.map(item => `☐ ${escapeHtml(item)}`).join('<br>')}
    </div>
    <br>
  `;
}

function renderAlerts(alertas) {
  if (!alertas || !alertas.length) return '';

  return `
    <div class="check-alert">
      <b>🚩 Alertas importantes</b><br>
      ${alertas.map(item => `• ${escapeHtml(item)}`).join('<br>')}
    </div>
  `;
}

function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
