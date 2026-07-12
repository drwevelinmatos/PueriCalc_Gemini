// tabs/hidratacao/index.js

import { byId } from '../../utils/dom.js';
import { calcHollidayCompleto, calcVIGCompleto, calcMisturaSG, calcAguaLivre } from './logic.js';

export function renderHidratacao() {
  const container = byId('tab-hidra');
  if (!container) return;

  container.innerHTML = `
    <!-- BLOCO 1: HOLLIDAY-SEGAR -->
    <div class="card" style="border-left: 5px solid var(--primary);">
      <div class="card-header" style="border: none; padding-left: 0;">
        <h2 style="color: var(--primary);">1. Soro de Manutenção (Holliday-Segar)</h2>
      </div>
      
      <div class="grid-3" style="margin-bottom: 12px;">
        <div><label>Peso (kg)</label><input type="number" step="0.1" id="hol-peso" placeholder="Ex: 10"></div>
        <div><label>% Holliday</label><input type="number" id="hol-pct" value="100" placeholder="Ex: 100, 80..."></div>
        <div><label>Etapas em 24h</label>
          <select id="hol-etapas" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ccc;">
            <option value="1">1 de 24h</option>
            <option value="2">2 de 12h</option>
            <option value="3">3 de 8h</option>
            <option value="4" selected>4 de 6h</option>
            <option value="6">6 de 4h</option>
          </select>
        </div>
      </div>

      <div class="grid-3" style="margin-bottom: 12px;">
        <div>
          <label>Na⁺</label>
          <div style="display:flex; gap:5px;">
            <input type="number" id="hol-na" value="130" style="width: 50%;">
            <select id="hol-na-unit" style="width: 50%; padding: 8px; border-radius: 6px; border: 1px solid #ccc; font-size: 0.75rem;">
              <option value="meq_l">mEq/L</option>
              <option value="meq_kg">mEq/kg/dia</option>
              <option value="meq_100">mEq/100mL</option>
            </select>
          </div>
        </div>
        <div>
          <label>K⁺</label>
          <div style="display:flex; gap:5px;">
            <input type="number" id="hol-k" value="30" style="width: 50%;">
            <select id="hol-k-unit" style="width: 50%; padding: 8px; border-radius: 6px; border: 1px solid #ccc; font-size: 0.75rem;">
              <option value="meq_l">mEq/L</option>
              <option value="meq_kg">mEq/kg/dia</option>
              <option value="meq_100">mEq/100mL</option>
            </select>
          </div>
        </div>
        <div><label>Mg²⁺ 10% (mEq/kg)</label><input type="number" id="hol-mg" value="0" step="0.1" style="width: 100%;"></div>
      </div>

      <div class="grid-2">
        <div><label>Ca²⁺ 10% (mL/kg)</label><input type="number" id="hol-ca" value="1" step="0.1"></div>
        <div><label>Glicose (g/kg)</label><input type="number" id="hol-glic" value="2" step="0.1"></div>
      </div>

      <button class="calc-btn" id="btn-calc-hol">Calcular Soro de Manutenção</button>
      <div id="res-hol" class="result-box"></div>
    </div>

    <!-- BLOCO 2: VIG E VOLUME (NEONATAL/CTI) -->
    <div class="card" style="border-left: 5px solid #27ae60;">
      <div class="card-header" style="border: none; padding-left: 0;">
        <h2 style="color: #27ae60;">2. Hidratação Venosa (VIG e Volume)</h2>
      </div>
      
      <div class="grid-3" style="margin-bottom: 12px;">
        <div><label>Peso (kg)</label><input type="number" step="0.1" id="vig-peso" placeholder="Ex: 3.2"></div>
        <div><label>VIG Alvo (mg/kg/min)</label><input type="number" id="vig-alvo" value="4" step="0.1"></div>
        <div><label>Vol. Alvo (mL/kg/dia)</label><input type="number" id="vig-vol" value="80"></div>
      </div>

      <div class="grid-2">
        <div><label>Na⁺ (mEq/kg/dia)</label><input type="number" id="vig-na" value="3" step="0.1"></div>
        <div><label>K⁺ (mEq/kg/dia)</label><input type="number" id="vig-k" value="2" step="0.1"></div>
        <div><label>Ca²⁺ 10% (mL/kg/dia)</label><input type="number" id="vig-ca" value="1" step="0.1"></div>
        <div><label>Mg²⁺ 10% (mEq/kg/dia)</label><input type="number" id="vig-mg" value="0.2" step="0.1"></div>
      </div>

      <button class="calc-btn" id="btn-calc-vig" style="background: #27ae60;">Calcular VIG Diária</button>
      <div id="res-vig" class="result-box"></div>
    </div>

    <!-- BLOCO 3: MISTURA DE SORO GLICOSADO -->
    <div class="card" style="border-left: 5px solid #8e44ad;">
      <div class="card-header" style="border: none; padding-left: 0;">
        <h2 style="color: #8e44ad;">3. Preparo de Soro Glicosado (Mistura)</h2>
      </div>
      <div class="grid-2" style="margin-bottom: 12px;">
        <div><label>Volume Total Desejado (mL)</label><input type="number" id="mix-vol" placeholder="Ex: 100"></div>
        <div><label>Concentração Alvo (%)</label><input type="number" id="mix-alvo" placeholder="Ex: 10"></div>
        <div><label>Solução A Disponível (%)</label><input type="number" id="mix-sga" value="5"></div>
        <div><label>Solução B Disponível (%)</label><input type="number" id="mix-sgb" value="50"></div>
      </div>
      <button class="calc-btn" id="btn-calc-mix" style="background: #8e44ad;">Calcular Mistura de SG</button>
      <div id="res-mix" class="result-box"></div>
    </div>

    <!-- BLOCO 4: DÉFICIT DE ÁGUA LIVRE -->
    <div class="card" style="border-left: 5px solid #2980b9;">
      <div class="card-header" style="border: none; padding-left: 0;">
        <h2 style="color: #2980b9;">4. Déficit de Água Livre (Hipernatremia)</h2>
      </div>
      <div class="grid-3">
        <div><label>Peso (kg)</label><input type="number" id="agua-peso" step="0.1"></div>
        <div><label>Na⁺ Atual (mEq/L)</label><input type="number" id="agua-na-atual" placeholder="Ex: 155"></div>
        <div><label>Na⁺ Alvo (mEq/L)</label><input type="number" id="agua-na-alvo" value="140"></div>
      </div>
      <button class="calc-btn" id="btn-calc-agua" style="background: #2980b9;">Calcular Déficit</button>
      <div id="res-agua" class="result-box"></div>
    </div>

    <!-- BLOCO 5: OBSERVAÇÕES E DIRETRIZES -->
    <div class="card" style="background: #fffdf5; border: 1px solid #f39c12;">
      <div class="card-header" style="border: none; padding-left: 0; margin-bottom: 5px;">
        <h2 style="color: #945d00; font-size: 1rem;">📌 Doses Sugeridas por Faixa Etária</h2>
      </div>
      
      <!-- Tabela Importada do Excel -->
      <div style="overflow-x: auto; margin-bottom: 15px; border-radius: 8px; border: 1px solid #ddd;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.75rem; text-align: left; background: #fff; min-width: 650px;">
          <thead>
            <tr style="background: #f39c12; color: #fff;">
              <th style="padding: 8px; border-right: 1px solid #ddd;">Idade</th>
              <th style="padding: 8px; border-right: 1px solid #ddd;">Glicose<br>(g/kg/dia)</th>
              <th style="padding: 8px; border-right: 1px solid #ddd;">NaCl 20%<br>(mEq/L)</th>
              <th style="padding: 8px; border-right: 1px solid #ddd;">KCl 19,1%<br>(mEq/L)</th>
              <th style="padding: 8px; border-right: 1px solid #ddd;">Ca²⁺ 10%<br>(mL/kg/dia)</th>
              <th style="padding: 8px; border-right: 1px solid #ddd;">Mg²⁺ 10%<br>(mEq/kg/dia)</th>
              <th style="padding: 8px;">Solução mais usada</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px; border-right: 1px solid #eee; font-weight: bold;">RN pré-termo</td><td style="padding: 8px; border-right: 1px solid #eee;">10–12</td><td style="padding: 8px; border-right: 1px solid #eee;">30–40</td><td style="padding: 8px; border-right: 1px solid #eee;">10–15</td><td style="padding: 8px; border-right: 1px solid #eee;">0,5–1,0</td><td style="padding: 8px; border-right: 1px solid #eee;">0,3–0,5</td><td style="padding: 8px;">SG 10% ou 5% + NaCl 0,3–0,45% + KCl</td></tr>
            <tr style="border-bottom: 1px solid #eee; background: #fafafa;"><td style="padding: 8px; border-right: 1px solid #eee; font-weight: bold;">RN a termo</td><td style="padding: 8px; border-right: 1px solid #eee;">8–10</td><td style="padding: 8px; border-right: 1px solid #eee;">30–50</td><td style="padding: 8px; border-right: 1px solid #eee;">10–20</td><td style="padding: 8px; border-right: 1px solid #eee;">0,3–0,5</td><td style="padding: 8px; border-right: 1px solid #eee;">0,3–0,5</td><td style="padding: 8px;">SG 5% + NaCl 0,45% + KCl</td></tr>
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px; border-right: 1px solid #eee; font-weight: bold;">Lactentes</td><td style="padding: 8px; border-right: 1px solid #eee;">7–9</td><td style="padding: 8px; border-right: 1px solid #eee;">30–50</td><td style="padding: 8px; border-right: 1px solid #eee;">10–20</td><td style="padding: 8px; border-right: 1px solid #eee;">0,3–0,4</td><td style="padding: 8px; border-right: 1px solid #eee;">0,25–0,4</td><td style="padding: 8px;">SG 5% + NaCl 0,45% + KCl</td></tr>
            <tr style="border-bottom: 1px solid #eee; background: #fafafa;"><td style="padding: 8px; border-right: 1px solid #eee; font-weight: bold;">Pré-escolar</td><td style="padding: 8px; border-right: 1px solid #eee;">6–7</td><td style="padding: 8px; border-right: 1px solid #eee;">30–50</td><td style="padding: 8px; border-right: 1px solid #eee;">10–20</td><td style="padding: 8px; border-right: 1px solid #eee;">0,2–0,3</td><td style="padding: 8px; border-right: 1px solid #eee;">0,2–0,3</td><td style="padding: 8px;">SG 5% + NaCl 0,45% ou 0,9% + KCl</td></tr>
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px; border-right: 1px solid #eee; font-weight: bold;">Escolar</td><td style="padding: 8px; border-right: 1px solid #eee;">5–6</td><td style="padding: 8px; border-right: 1px solid #eee;">40–60</td><td style="padding: 8px; border-right: 1px solid #eee;">10–20</td><td style="padding: 8px; border-right: 1px solid #eee;">0,2–0,25</td><td style="padding: 8px; border-right: 1px solid #eee;">0,2–0,25</td><td style="padding: 8px;">SG 5% + NaCl 0,9% + KCl</td></tr>
            <tr><td style="padding: 8px; border-right: 1px solid #eee; font-weight: bold;">Adolescente</td><td style="padding: 8px; border-right: 1px solid #eee;">4–5</td><td style="padding: 8px; border-right: 1px solid #eee;">50–70</td><td style="padding: 8px; border-right: 1px solid #eee;">10–20</td><td style="padding: 8px; border-right: 1px solid #eee;">0,15–0,2</td><td style="padding: 8px; border-right: 1px solid #eee;">0,15–0,2</td><td style="padding: 8px;">SG 5% + NaCl 0,9% + KCl</td></tr>
          </tbody>
        </table>
      </div>

      <div style="font-size: 0.85rem; line-height: 1.5; color: #5f7382;">
        <p><strong>💧 Soro Clássico Pediátrico ("1000/40/10"):</strong><br>
        1000 mL de SG 5% + 40 mEq de Na⁺ + 10 mEq de K⁺</p>
        <p><strong>⚖️ Osmolaridade de Manutenção:</strong><br>
        • <strong>Hipo-osmolar</strong>: Uso restrito (risco de hiponatremia iatrogênica).<br>
        • <strong>Iso/Normo-osmolar</strong>: Recomendado pelas diretrizes (AAP) para profilaxia de hiponatremia hospitalar.</p>
      </div>
    </div>
  `;

  // === PROTEÇÕES DE SEGURANÇA: Alterar os inputs quando a unidade muda ===
  byId('hol-na-unit')?.addEventListener('change', (e) => {
    const v = e.target.value;
    if (v === 'meq_l') byId('hol-na').value = 130;
    else if (v === 'meq_kg') byId('hol-na').value = 3;
    else if (v === 'meq_100') byId('hol-na').value = 3;
  });

  byId('hol-k-unit')?.addEventListener('change', (e) => {
    const v = e.target.value;
    if (v === 'meq_l') byId('hol-k').value = 30;
    else if (v === 'meq_kg') byId('hol-k').value = 2;
    else if (v === 'meq_100') byId('hol-k').value = 2;
  });

  // Listeners dos Botões
  byId('btn-calc-hol')?.addEventListener('click', handleHol);
  byId('btn-calc-vig')?.addEventListener('click', handleVIG);
  byId('btn-calc-mix')?.addEventListener('click', handleMix);
  byId('btn-calc-agua')?.addEventListener('click', handleAgua);
}

// === HANDLERS DE CÁLCULO ===

function handleHol() {
  const params = {
    peso: parseFloat(byId('hol-peso').value),
    pctHol: parseFloat(byId('hol-pct').value),
    naVal: parseFloat(byId('hol-na').value),
    naUnit: byId('hol-na-unit').value,
    kVal: parseFloat(byId('hol-k').value),
    kUnit: byId('hol-k-unit').value,
    caMlKg: parseFloat(byId('hol-ca').value),
    mgMeqKg: parseFloat(byId('hol-mg').value),
    glicGKg: parseFloat(byId('hol-glic').value)
  };
  const etapas = parseInt(byId('hol-etapas').value) || 1;

  if (!params.peso || params.peso <= 0) return renderHTML('res-hol', 'Por favor, preencha o peso corretamente.');

  const res = calcHollidayCompleto(params);
  
  let warn = res.ad_vol < 0 ? `<div style="color: #c0392b; background: #fadbd8; padding: 10px; border-radius: 6px; margin-bottom: 12px; font-weight: bold;">⚠️ Volume de Água Destilada negativo! Os componentes da receita ultrapassam o volume total do Holliday-Segar.</div>` : '';

  const h_ad = (res.ad_vol / etapas).toFixed(1);
  const h_nacl = (res.nacl20_vol / etapas).toFixed(1);
  const h_kcl = (res.kcl19_vol / etapas).toFixed(1);
  const h_ca = (res.ca_vol / etapas).toFixed(1);
  const h_mg = (res.mg_vol / etapas).toFixed(1);
  const h_glic = (res.glic_vol / etapas).toFixed(1);
  const h_total = (res.volTotal / etapas).toFixed(1);
  const h_rate = (res.volTotal / 24).toFixed(1);

  let html = `${warn}<strong>📊 Prescrição: Montar ${etapas} etapa(s) de ${24/etapas}h</strong><br><br>`;
  html += `• Água Destilada: <strong>${h_ad} mL</strong><br>`;
  if (res.glic_vol > 0) html += `• Glicose 50%: <strong>${h_glic} mL</strong><br>`;
  if (res.nacl20_vol > 0) html += `• NaCl 20%: <strong>${h_nacl} mL</strong><br>`;
  if (res.kcl19_vol > 0) html += `• KCl 19,1%: <strong>${h_kcl} mL</strong><br>`;
  if (res.ca_vol > 0) html += `• Gluconato de Ca²⁺ 10%: <strong>${h_ca} mL</strong><br>`;
  if (res.mg_vol > 0) html += `• Sulfato de Mg²⁺ 10%: <strong>${h_mg} mL</strong><br>`;
  html += `<hr style="border: 0; border-top: 1px dashed rgba(0,0,0,0.1); margin: 10px 0;">`;
  html += `<strong>Volume Final da Etapa: ${h_total} mL</strong><br>`;
  html += `<strong style="color: var(--primary);">Correr a: ${h_rate} mL/h</strong>`;

  renderHTML('res-hol', html);
}

function handleVIG() {
  const params = {
    peso: parseFloat(byId('vig-peso').value),
    vig: parseFloat(byId('vig-alvo').value),
    volMlKgDia: parseFloat(byId('vig-vol').value),
    naMeqKg: parseFloat(byId('vig-na').value),
    kMeqKg: parseFloat(byId('vig-k').value),
    caMlKg: parseFloat(byId('vig-ca').value),
    mgMeqKg: parseFloat(byId('vig-mg').value)
  };

  if (!params.peso || !params.vig || !params.volMlKgDia) return renderHTML('res-vig', 'Preencha peso, VIG e volume alvo.');

  const res = calcVIGCompleto(params);
  let warn = res.ad_vol < 0 ? `<div style="color: #c0392b; background: #fadbd8; padding: 10px; border-radius: 6px; margin-bottom: 12px; font-weight: bold;">⚠️ Volume de Água Destilada negativo! Os componentes ultrapassam o volume total de ${res.volTotal.toFixed(0)} mL.</div>` : '';

  const h_rate = (res.volTotal / 24).toFixed(1);

  let html = `${warn}<strong>📊 Prescrição Diária (Solução para 24h)</strong><br><br>`;
  html += `• Água Destilada: <strong>${res.ad_vol.toFixed(1)} mL</strong><br>`;
  if (res.glic_vol > 0) html += `• Glicose 50%: <strong>${res.glic_vol.toFixed(1)} mL</strong> <span class="muted">(Total: ${res.glicoseG.toFixed(1)}g)</span><br>`;
  if (res.nacl20_vol > 0) html += `• NaCl 20%: <strong>${res.nacl20_vol.toFixed(1)} mL</strong><br>`;
  if (res.kcl19_vol > 0) html += `• KCl 19,1%: <strong>${res.kcl19_vol.toFixed(1)} mL</strong><br>`;
  if (res.ca_vol > 0) html += `• Gluconato de Ca²⁺ 10%: <strong>${res.ca_vol.toFixed(1)} mL</strong><br>`;
  if (res.mg_vol > 0) html += `• Sulfato de Mg²⁺ 10%: <strong>${res.mg_vol.toFixed(1)} mL</strong><br>`;
  html += `<hr style="border: 0; border-top: 1px dashed rgba(0,0,0,0.1); margin: 10px 0;">`;
  html += `<strong>Volume Total (24h): ${res.volTotal.toFixed(1)} mL</strong><br>`;
  html += `<strong style="color: #27ae60;">Correr em BIC a: ${h_rate} mL/h</strong>`;

  renderHTML('res-vig', html);
}

function handleMix() {
  const vol = parseFloat(byId('mix-vol').value);
  const alvo = parseFloat(byId('mix-alvo').value);
  const sgA = parseFloat(byId('mix-sga').value);
  const sgB = parseFloat(byId('mix-sgb').value);

  if (!vol || !alvo || !sgA || !sgB) return renderHTML('res-mix', 'Preencha todos os campos da mistura.');

  const res = calcMisturaSG(vol, alvo, sgA, sgB);
  if (res.error) return renderHTML('res-mix', `<span style="color:#c0392b; font-weight:bold;">${res.error}</span>`);

  let html = `<strong>🧪 Receita para ${vol} mL de Soro Glicosado a ${alvo}%</strong><br><br>`;
  html += `Misturar no frasco:<br>`;
  html += `• Soro Glicosado ${res.cLow}%: <strong style="color: #8e44ad;">${res.vLow.toFixed(1)} mL</strong><br>`;
  html += `• Soro Glicosado ${res.cHigh}%: <strong style="color: #8e44ad;">${res.vHigh.toFixed(1)} mL</strong><br>`;

  renderHTML('res-mix', html);
}

function handleAgua() {
  const peso = parseFloat(byId('agua-peso').value);
  const naAtual = parseFloat(byId('agua-na-atual').value);
  const naAlvo = parseFloat(byId('agua-na-alvo').value);

  if (!peso || !naAtual || !naAlvo) return renderHTML('res-agua', 'Preencha todos os campos para o déficit.');

  const res = calcAguaLivre(peso, naAtual, naAlvo);
  if (res.error) return renderHTML('res-agua', `<span style="color:#f39c12; font-weight:bold;">${res.error}</span>`);

  let html = `<strong>💧 Déficit de Água Livre Estimado</strong><br><br>`;
  html += `• Volume a repor: <strong style="color: #2980b9; font-size: 1.1rem;">${res.deficitL.toFixed(2)} Litros (${res.deficitMl.toFixed(0)} mL)</strong><br><br>`;
  html += `<span style="font-size:0.85rem; color: #7f8c8d;"><strong>Atenção:</strong> A correção da hipernatremia deve ser lenta (redução máxima de 10-12 mEq/L em 24h) para evitar edema cerebral. Distribua este volume ao longo de 48 a 72 horas associado ao volume de manutenção basal.</span>`;

  renderHTML('res-agua', html);
}

function renderHTML(elementId, htmlString) {
  const box = byId(elementId);
  if (box) {
      box.innerHTML = htmlString;
      box.style.display = 'block';
  }
}
