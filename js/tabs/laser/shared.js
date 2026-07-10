import { byId } from '../../utils/dom.js';

export function formatBR(value, decimals = 1) {
  return Number(value).toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

export function laserEnergyPerPoint(powerMw, timeSec) {
  return (powerMw / 1000) * timeSec;
}

export function laserTotalEnergy(energyPerPoint, points) {
  return energyPerPoint * points;
}

export function laserDensity(totalEnergy, areaCm2) {
  return areaCm2 > 0 ? totalEnergy / areaCm2 : 0;
}

export function laserTotalTime(timeSec, points) {
  return timeSec * points;
}

export function formatLaserTime(seconds) {
  return seconds < 60
    ? `${formatBR(seconds, 0)} s`
    : `${formatBR(seconds / 60, 1)} min`;
}

export function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function currentTimeHHMM() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function fillDateTimeIfEmpty(dateId, timeId) {
  const dateEl = byId(dateId);
  const timeEl = byId(timeId);

  if (dateEl && !dateEl.value) dateEl.value = todayISO();
  if (timeEl && !timeEl.value) timeEl.value = currentTimeHHMM();
}

export async function copyTextareaValue(textareaId) {
  const textarea = byId(textareaId);
  if (!textarea || !textarea.value.trim()) return false;

  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(textarea.value);
    return true;
  }

  textarea.select();
  textarea.setSelectionRange(0, 99999);
  return document.execCommand('copy');
}

export function saveLocal(key, payload) {
  localStorage.setItem(key, JSON.stringify(payload));
}

export function loadLocal(key) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}

export function printLaserArea(printAreaId, bodyText) {
  const area = byId(printAreaId);
  if (!area) return;

  const body = area.querySelector('.print-body');
  if (body) body.textContent = bodyText;

  area.style.display = 'block';

  const styleId = 'laserPrintOnlyStyle';
  let styleEl = document.getElementById(styleId);

  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = styleId;
    document.head.appendChild(styleEl);
  }

  styleEl.textContent = `
    @media print {
      body * { visibility: hidden !important; }
      #${printAreaId}, #${printAreaId} * { visibility: visible !important; }
      #${printAreaId} {
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        width: 100% !important;
        display: block !important;
        background: #fff !important;
      }
    }
  `;

  window.print();
}

export function openLaserPanel(root, panelId, buttonEl) {
  root.querySelectorAll('.laser-panel').forEach((panel) => {
    panel.classList.remove('active');
  });

  root.querySelectorAll('.laser-menu-btn').forEach((btn) => {
    btn.classList.remove('active');
  });

  byId(panelId)?.classList.add('active');
  buttonEl?.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}
