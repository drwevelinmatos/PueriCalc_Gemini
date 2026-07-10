import { byId } from '../../utils/dom.js';

export function initMRPA() {
  const slot = byId('cardio-mrpa-slot');
  if (!slot) return;

  slot.innerHTML = `
    <div class="card" id="mrpa-print-area">
      <div class="mrpa-toolbar">
        <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center">
          <select id="mrpa-paper" style="padding:10px 12px;border-radius:10px;border:1px solid #dce4ec;font-weight:700;background:#fff">
            <option value="A4">Papel: A4</option>
            <option value="A5">Papel: A5</option>
          </select>

          <button class="calc-btn" id="btn-mrpa-print" style="background:var(--cardio); width:auto; padding:12px 14px; margin-top:0">
            Imprimir MRPA
          </button>
        </div>

        <div class="muted" style="margin:0;max-width:360px">
          Folha em branco para preenchimento manual.
        </div>
      </div>

      <div class="mrpa-toolbar" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin:0 0 12px">
        <div>
          <div class="mrpa-label" style="margin:0 0 6px">Local</div>
          <input id="mrpa-local" placeholder="Ex.: Pindamonhangaba" style="background:#fff">
        </div>
        <div>
          <div class="mrpa-label" style="margin:0 0 6px">Médico(a)</div>
          <input id="mrpa-medico" placeholder="Nome do médico(a)" style="background:#fff">
        </div>
        <div>
          <div class="mrpa-label" style="margin:0 0 6px">CRM</div>
          <input id="mrpa-crm" placeholder="CRM-UF" style="background:#fff">
        </div>
      </div>

      <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;padding:8px 0 10px;border-bottom:2px solid rgba(40,90,129,0.18)">
        <div>
          <div style="font-family:'Comfortaa',cursive;font-weight:800;color:var(--primary);font-size:1.05rem">
            PueriCalc • MRPA
          </div>
          <div style="color:#52616d;font-size:0.78rem">
            Monitorização Residencial da Pressão Arterial
          </div>
        </div>

        <div style="text-align:right;color:#52616d;font-size:0.78rem;line-height:1.25;max-width:420px">
          <div><b>Orientação:</b> 1º dia (clínica) 2 medições. 2º ao 5º dia: 3 manhã + 3 noite.</div>
          <div>Registrar PAS, PAD e pulso em cada medição.</div>
        </div>
      </div>

      <div class="card" style="box-shadow:none;border:1px solid rgba(0,0,0,0.10);margin-top:12px">
        <div class="mrpa-grid-2">
          <div>
            <div class="mrpa-label">Nome</div>
            <div class="mrpa-box"></div>
          </div>
          <div>
            <div class="mrpa-label">Data de nascimento</div>
            <div class="mrpa-box"></div>
          </div>
          <div>
            <div class="mrpa-label">Peso (kg)</div>
            <div class="mrpa-box"></div>
          </div>
          <div>
            <div class="mrpa-label">Altura (m)</div>
            <div class="mrpa-box"></div>
          </div>
          <div>
            <div class="mrpa-label">Médico(a)</div>
            <div class="mrpa-box"></div>
          </div>
          <div>
            <div class="mrpa-label">Clínica</div>
            <div class="mrpa-box"></div>
          </div>
        </div>
      </div>

      <div class="card" style="box-shadow:none;border:1px solid rgba(0,0,0,0.10)">
        <div class="mrpa-row-title">Medicações em uso</div>
        <div class="mrpa-box big"></div>
      </div>

      <div class="card" style="box-shadow:none;border:1px solid rgba(0,0,0,0.10)">
        <div class="mrpa-row-title">1º Dia – Clínica (____ / ____ / ____)</div>
        <div class="mrpa-grid-2">
          ${measurementCard('1ª Medição')}
          ${measurementCard('2ª Medição')}
        </div>
      </div>

      <div id="mrpa-dias"></div>

      <div style="margin-top:14px;padding-top:10px;border-top:2px solid rgba(40,90,129,0.18);display:flex;justify-content:flex-end">
        <div style="text-align:right;font-size:0.82rem;line-height:1.25;color:#1f2d3a;font-weight:700">
          <div style="font-weight:600;color:#52616d;font-size:0.78rem" id="mrpa-local-data">Local, __/__/____</div>
          <div style="margin-top:4px">__________________________________________</div>
          <div style="font-weight:600;color:#52616d;font-size:0.78rem" id="mrpa-medico-crm">Médico(a) • CRM</div>
        </div>
      </div>
    </div>
  `;

  buildMRPADays();
  bindMRPAEvents();
  setMRPAPaperSize();
  updateMRPAFooter();
}

function measurementCard(title) {
  return `
    <div class="mrpa-medicao">
      <div class="mrpa-row-title" style="font-size:0.9rem">${title}</div>
      <div class="mrpa-label">Hora</div><div class="mrpa-box"></div>
      <div class="mrpa-label">PAS</div><div class="mrpa-box"></div>
      <div class="mrpa-label">PAD</div><div class="mrpa-box"></div>
      <div class="mrpa-label">Pulso</div><div class="mrpa-box"></div>
    </div>
  `;
}

function buildMRPADays() {
  const container = byId('mrpa-dias');
  if (!container) return;

  container.innerHTML = '';

  [2, 3, 4, 5].forEach((day) => {
    container.insertAdjacentHTML(
      'beforeend',
      `
        <div class="card" style="box-shadow:none;border:1px solid rgba(0,0,0,0.10)">
          <div class="mrpa-row-title">${day}º Dia (____ / ____ / ____)</div>

          <div style="font-weight:800;color:var(--primary);margin:6px 0 8px">☀️ Manhã</div>
          <div class="mrpa-grid-3">
            ${measurementCard('Manhã — 1')}
            ${measurementCard('Manhã — 2')}
            ${measurementCard('Manhã — 3')}
          </div>

          <div style="font-weight:800;color:var(--primary);margin:12px 0 8px">🌙 Noite</div>
          <div class="mrpa-grid-3">
            ${measurementCard('Noite — 1')}
            ${measurementCard('Noite — 2')}
            ${measurementCard('Noite — 3')}
          </div>
        </div>
      `
    );
  });
}

function bindMRPAEvents() {
  byId('mrpa-paper')?.addEventListener('change', setMRPAPaperSize);
  byId('btn-mrpa-print')?.addEventListener('click', printMRPA);

  ['mrpa-local', 'mrpa-medico', 'mrpa-crm'].forEach((id) => {
    byId(id)?.addEventListener('input', updateMRPAFooter);
  });

  window.addEventListener('beforeprint', () => {
    setMRPAPaperSize();
    updateMRPAFooter();
  });
}

function setMRPAPaperSize() {
  let styleEl = byId('mrpaPageSizeStyle');

  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'mrpaPageSizeStyle';
    document.head.appendChild(styleEl);
  }

  const paper = byId('mrpa-paper')?.value || 'A4';

  styleEl.textContent = `
    @media print {
      @page { size: ${paper} portrait; margin: ${paper === 'A5' ? '10mm' : '12mm'}; }

      body * {
        visibility: hidden !important;
      }

      #mrpa-print-area, #mrpa-print-area * {
        visibility: visible !important;
      }

      #mrpa-print-area {
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        width: 100% !important;
        background: #fff !important;
      }

      .mrpa-toolbar {
        display: none !important;
      }

      .mrpa-box {
        border: 1.6px solid #000 !important;
      }

      .mrpa-medicao {
        border: 1px solid #000 !important;
      }
    }
  `;
}

function updateMRPAFooter() {
  const local = byId('mrpa-local')?.value?.trim() || 'Local';
  const medico = byId('mrpa-medico')?.value?.trim() || 'Médico(a)';
  const crm = byId('mrpa-crm')?.value?.trim() || 'CRM';
  const today = new Date().toLocaleDateString('pt-BR');

  const localData = byId('mrpa-local-data');
  const medicoCrm = byId('mrpa-medico-crm');

  if (localData) {
    localData.textContent = `${local}, ${today}`;
  }

  if (medicoCrm) {
    medicoCrm.textContent = `${medico} • ${crm}`;
  }
}

function printMRPA() {
  setMRPAPaperSize();
  updateMRPAFooter();
  window.print();
}
