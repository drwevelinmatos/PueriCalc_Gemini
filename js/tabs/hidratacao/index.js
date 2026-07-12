// tabs/hidratacao/index.js

import { byId } from '../../utils/dom.js';
import { calcHolTradicional, calcHolPlanilha, calcVIGCompleto, calcMisturaSG, calcAguaLivre } from './logic.js';

export function renderHidratacao() {
  const container = byId('tab-hidra');
  if (!container) return;

  container.innerHTML = `
    <!-- BLOCO 1A: HOLLIDAY-SEGAR TRADICIONAL -->
    <div class="card" style="border-left: 5px solid var(--primary);">
      <div class="card-header" style="border: none; padding-left: 0;">
        <h2 style="color: var(--primary);">1A. Manutenção Padrão (Por Peso - mEq/kg)</h2>
        <p style="font-size: 0.85rem; color: #5f7382; margin-top: 4px;">Usa Soro Glicosado 5% como base (Prático Enfermaria).</p>
      </div>
      
      <div class="grid-3" style="margin-bottom: 12px;">
        <div><label>Peso (kg)</label><input type="number" step="0.1" id="ht-peso" placeholder="Ex: 10"></div>
        <div><label>% Holliday</label><input type="number" id="ht-pct" value="100"></div>
        <div><label>Etapas em 24h</label>
          <select id="ht-etapas" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ccc;">
            <option value="1">1 de 24h</option>
            <option value="2">2 de 12h</option>
            <option value="3">3 de 8h</option>
            <option value="4" selected>4 de 6h</option>
            <option value="6">6 de 4h</option>
          </select>
        </div>
      </div>

      <div class="grid-2" style="margin-bottom: 12px;">
        <div><label>Na⁺ (mEq/kg/dia)</label><input type="number" id="ht-na" value="3" step="0.1"></div>
        <div><label>K⁺ (mEq/kg/dia)</label><input type="number" id="ht-k" value="2" step="0.1"></div>
      </div>
      <div class="grid-2">
        <div><label>Ca²⁺ 10% (mL/kg/dia)</label><input type="number" id="ht-ca" value="1" step="0.1"></div>
        <div><label>Mg²⁺ 10% (mEq/kg/dia)</label><input type="number" id="ht-mg" value="0" step="0.1"></div>
      </div>

      <button class="calc-btn" id="btn-calc-ht">Calcular Manutenção Padrão</button>
      <div id="res-ht" class="result-box"></div>
    </div>

    <!-- BLOCO 1B: HOLLIDAY-SEGAR PLANILHA (UTI) -->
    <div class="card" style="border-left: 5px solid #8e44ad;">
      <div class="card-header" style="border: none; padding-left: 0;">
        <h2 style="color: #8e44ad;">1B. Manutenção Avançada (Por Litro - mEq/L)</h2>
        <p style="font-size: 0.85rem; color: #5f7382; margin-top: 4px;">Usa Água Destilada + Glicose 50% (Padrão Planilha CTI).</p>
      </div>
      
      <div class="grid-3" style="margin-bottom: 12px;">
        <div><label>Peso (kg)</label><input type="number" step="0.1" id="hp-peso" placeholder="Ex: 10"></div>
        <div><label>% Holliday</label><input type="number" id="hp-pct" value="100"></div>
        <div><label>Etapas em 24h</label>
          <select id="hp-etapas" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ccc;">
            <option value="1">1 de 24h</option>
            <option value="2">2 de 12h</option>
            <option value="3">3 de 8h</option>
            <option value="4" selected>4 de 6h</option>
            <option value="6">6 de 4h</option>
          </select>
        </div>
      </div>

      <div class="grid-3" style="margin-bottom: 12px;">
        <div><label>Na⁺ (mEq/L)</label><input type="number" id="hp-na" value="130"></div>
        <div><label>K⁺ (mEq/L)</label><input type="number" id="hp-k" value="30"></div>
        <div><label>Glicose (g/kg/dia)</label><input type="number" id="hp-glic" value="2" step="0.1"></div>
      </div>
      <div class="grid-2">
        <div><label>Ca²⁺ 10% (mL/kg/dia)</label><input type="number" id="hp-ca" value="1" step="0.1"></div>
        <div><label>Mg²⁺ 10% (mEq/kg/dia)</label><input type="number" id="hp-mg" value="0" step="0.1"></div>
      </div>

      <button class="calc-btn" id="btn-calc-hp" style="background: #8e44ad;">Calcular Manutenção Avançada</button>
      <div id="res-hp" class="result-box"></div>
    </div>

    <!-- BLOCO REFERÊNCIA: DIRETRIZES E DOSES -->
    <div class="card" style="background: #fffdf5; border: 1px solid #f39c12;">
      <div class="card-header" style="border: none; padding-left: 0; margin-bottom: 5px;">
        <h2 style="color: #945d00; font-size: 1rem;">📌 Doses Sugeridas & Diretrizes Clínicas</h2>
      </div>
      
      <!-- Tabela Importada do Excel -->
      <div style="overflow-x: auto; margin-bottom: 15px; border-radius: 8px; border: 1px solid #ddd;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.75rem; text-align: left; background: #fff; min-width: 650px;">
          <thead>
            <tr style="background: #f39c12; color: #fff;">
              <th style="padding: 8px; border-right: 1px solid #ddd;">Idade</th>
              <th style="padding: 8px; border-right: 1px solid #ddd;">Glicose 50%<br>(g/kg/dia)</th>
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
        <p><strong>👶 Dicas Clínicas:</strong><br>
        • RN e lactentes pequenos possuem maior risco de sobrecarga hídrica, avalie rigorosamente o volume.<br>
        • Pacientes neurológicos, pós-operatórios ou sépticos: Preferir soluções isotônicas (ex: NaCl 0,9%) para evitar hiponatremia.</p>
        
        <p><strong>💧 Soro Clássico Pediátrico ("1000/40/10"):</strong><br>
        1000 mL de SG 5% + 40 mEq de Na⁺ + 10 mEq de K⁺</p>

        <p><strong>⚖️ Osmolaridade de Manutenção:</strong><br>
        • <strong>Hipo-osmolar</strong> (Ex: SG5% + NaCl 0,2%): Uso cada vez mais restrito (risco de hiponatremia iatrogênica).<br>
        • <strong>Iso/Normo-osmolar</strong> (Ex: SG5% + NaCl 0,9%): Recomendado pelas diretrizes modernas (AAP) para manutenção hospitalar e profilaxia de hiponatremia.<br>
        • <strong>Hiper-osmolar</strong>: Usado em correções específicas e VIG muito alto (pode requerer acesso central).</p>
      </div>
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
    <div class="card" style="border-left: 5px solid #d35400;">
      <div class="card-header" style="border: none; padding-left: 0;">
        <h2 style="color: #d35400;">3. Preparo de Soro Glicosado (Mistura)</h2>
      </div>
      <div class="grid-2" style="margin-bottom: 12px;">
        <div><label>Volume Total (mL)</label><input type="number" id="mix-vol" placeholder="Ex: 100"></div>
        <div><label>Concentração Alvo (%)</label><input type="number" id="mix-alvo" placeholder="Ex: 10"></div>
        <div><label>Solução A Disponível (%)</label><input type="number" id="mix-sga" value="5"></div>
        <div><label>Solução B Disponível (%)</label><input type="number" id="mix-sgb" value="50"></div>
      </div>
      <button class="calc-btn" id="btn-calc-mix" style="background: #d35400;">Calcular Mistura de SG</button>
      <div id="res-mix" class="result-box"></div>
    </div>

    <!-- BLOCO 4: DÉFICIT DE ÁGUA LIVRE (ATUALIZADO) -->
    <div class="card" style="border-left: 5px solid #2980b9;">
      <div class="card-header" style="border: none; padding-left: 0;">
        <h2 style="color: #2980b9;">4. Déficit de Água Livre (Hipernatremia)</h2>
      </div>
      
      <div class="grid-2" style="margin-bottom: 12px;">
        <div>
          <label>Perfil do Paciente</label>
          <select id="agua-perfil" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ccc;">
            <option value="rn">RN (até 28 dias) - ACT 75%</option>
            <option value="lactente_crianca" selected>Lactente / Criança - ACT 60%</option>
            <option value="adol_m">Adol. Masculino - ACT 60%</option>
            <option value="adol_f">Adol. Feminino - ACT 50%</option>
          </select>
        </div>
        <div><label>Peso (kg)</label><input type="number" id="agua-peso" step="0.1" placeholder="Ex: 15"></div>
      </div>

      <div class="grid-2">
        <div><label>Na⁺ Atual (mEq/L)</label><input type="number" id="agua-na-atual" placeholder="Ex: 155"></div>
        <div><label>Na⁺ Alvo (mEq/L)</label><input type="number" id="agua-na-alvo" value="140"></div>
      </div>
      
      <button class="calc-btn" id="btn-calc-agua" style="background: #2980b9; margin-top: 15px;">Calcular Déficit e Plano</button>
      <div id="res-agua" class="result-box"></div>
    </div>
  `;

  // Listeners
  byId('btn-calc-ht')?.addEventListener('click', handleHolTradicional);
  byId('btn-calc-hp')?.addEventListener('click', handleHolPlanilha);
  byId('btn-calc-vig')?.addEventListener('click', handleVIG);
  byId('btn-calc-mix')?.addEventListener('click', handleMix);
  byId('btn-calc-agua')?.addEventListener('click', handleAgua);
}

// === HANDLERS DE CÁLCULO ===

function handleHolTradicional() {
  const p = {
    peso: parseFloat(byId('ht-peso').value),
    pctHol: parseFloat(byId('ht-pct').value),
    naKg: parseFloat(byId('ht-na').value),
    kKg: parseFloat(byId('ht-k').value),
    caKg: parseFloat(byId('ht-ca').value),
    mgKg: parseFloat(byId('ht-mg').value)
  };
  const etapas = parseInt(byId('ht-etapas').value) || 1;

  if (!p.peso || p.peso <= 0) return renderHTML('res-ht', 'Preencha o peso.');

  const res = calcHolTradicional(p);
  
  let warn = res.sg5_vol < 0 ? `<div style="color: #c0392b; background: #fadbd8; padding: 10px; border-radius: 6px; margin-bottom: 12px; font-weight: bold;">⚠️ Volume do solvente negativo! Componentes ultrapassam o total do Holliday.</div>` : '';

  const h_sg = (res.sg5_vol / etapas).toFixed(1);
  const h_nacl = (res.nacl20_vol / etapas).toFixed(1);
  const h_kcl = (res.kcl19_vol / etapas).toFixed(1);
  const h_ca = (res.ca_vol / etapas).toFixed(1);
  const h_mg = (res.mg_vol / etapas).toFixed(1);
  const h_total = (res.volTotal / etapas).toFixed(1);
  const h_rate = (res.volTotal / 24).toFixed(1);

  let html = `${warn}<strong>📊 Prescrição: Montar ${etapas} etapa(s) de ${24/etapas}h</strong><br><br>`;
  html += `• Soro Glicosado 5%: <strong>${h_sg} mL</strong><br>`;
  if (res.nacl20_vol > 0) html += `• NaCl 20%: <strong>${h_nacl} mL</strong><br>`;
  if (res.kcl19_vol > 0) html += `• KCl 19,1%: <strong>${h_kcl} mL</strong><br>`;
  if (res.ca_vol > 0) html += `• Gluconato de Ca²⁺ 10%: <strong>${h_ca} mL</strong><br>`;
  if (res.mg_vol > 0) html += `• Sulfato de Mg²⁺ 10%: <strong>${h_mg} mL</strong><br>`;
  html += `<hr style="border: 0; border-top: 1px dashed rgba(0,0,0,0.1); margin: 10px 0;">`;
  html += `<strong>Volume Final da Etapa: ${h_total} mL</strong><br>`;
  html += `<strong style="color: var(--primary);">Correr a: ${h_rate} mL/h</strong>`;

  renderHTML('res-ht', html);
}

function handleHolPlanilha() {
  const p = {
    peso: parseFloat(byId('hp-peso').value),
    pctHol: parseFloat(byId('hp-pct').value),
    naL: parseFloat(byId('hp-na').value),
    kL: parseFloat(byId('hp-k').value),
    glicKg: parseFloat(byId('hp-glic').value),
    caKg: parseFloat(byId('hp-ca').value),
    mgKg: parseFloat(byId('hp-mg').value)
  };
  const etapas = parseInt(byId('hp-etapas').value) || 1;

  if (!p.peso || p.peso <= 0) return renderHTML('res-hp', 'Preencha o peso.');

  const res = calcHolPlanilha(p);
  
  let warn = res.ad_vol < 0 ? `<div style="color: #c0392b; background: #fadbd8; padding: 10px; border-radius: 6px; margin-bottom: 12px; font-weight: bold;">⚠️ Volume de Água Destilada negativo! Os componentes ultrapassam o total do Holliday.</div>` : '';

  const h_ad = (res.ad_vol / etapas).toFixed(1);
  const h_glic = (res.glic_vol / etapas).toFixed(1);
  const h_nacl = (res.nacl20_vol / etapas).toFixed(1);
  const h_kcl = (res.kcl19_vol / etapas).toFixed(1);
  const h_ca = (res.ca_vol / etapas).toFixed(1);
  const h_mg = (res.mg_vol / etapas).toFixed(1);
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
  html += `<strong style="color: #8e44ad;">Correr a: ${h_rate} mL/h</strong>`;

  renderHTML('res-hp', html);
}

function handleVIG() {
  const p = {
    peso: parseFloat(byId('vig-peso').value),
    vig: parseFloat(byId('vig-alvo').value),
    volMlKgDia: parseFloat(byId('vig-vol').value),
    naMeqKg: parseFloat(byId('vig-na').value),
    kMeqKg: parseFloat(byId('vig-k').value),
    caMlKg: parseFloat(byId('vig-ca').value),
    mgMeqKg: parseFloat(byId('vig-mg').value)
  };

  if (!p.peso || !p.vig || !p.volMlKgDia) return renderHTML('res-vig', 'Preencha peso, VIG e volume alvo.');

  const res = calcVIGCompleto(p);
  let warn = res.ad_vol < 0 ? `<div style="color: #c0392b; background: #fadbd8; padding: 10px; border-radius: 6px; margin-bottom: 12px; font-weight: bold;">⚠️ Volume de Água Destilada negativo!</div>` : '';

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
  html += `• Soro Glicosado ${res.cLow}%: <strong style="color: #d35400;">${res.vLow.toFixed(1)} mL</strong><br>`;
  html += `• Soro Glicosado ${res.cHigh}%: <strong style="color: #d35400;">${res.vHigh.toFixed(1)} mL</strong><br>`;

  renderHTML('res-mix', html);
}

function handleAgua() {
  const peso = parseFloat(byId('agua-peso').value);
  const naAtual = parseFloat(byId('agua-na-atual').value);
  const naAlvo = parseFloat(byId('agua-na-alvo').value);
  const perfil = byId('agua-perfil').value;

  if (!peso || !naAtual || !naAlvo) return renderHTML('res-agua', 'Preencha peso e os valores de Sódio.');

  const res = calcAguaLivre(peso, naAtual, naAlvo, perfil);
  if (res.error) return renderHTML('res-agua', `<span style="color:#c0392b; font-weight:bold;">${res.error}</span>`);

  let html = `<strong>💧 Déficit de Água Livre Estimado</strong><br><br>`;
  html += `• Fração de Água Corporal (ACT): <strong>${res.tbwFactor * 100}%</strong><br>`;
  html += `• Volume a repor: <strong style="color: #2980b9; font-size: 1.1rem;">${res.deficitL.toFixed(2)} Litros (${res.deficitMl.toFixed(0)} mL)</strong><br><br>`;

  html += `<strong>📝 Orientações Clínicas de Reposição:</strong><br>`;
  html += `<ul style="margin: 5px 0 0 15px; padding: 0; font-size: 0.9rem; line-height: 1.5; color: #34495e;">`;
  html += `<li><strong style="color:#c0392b;">Hipovolemia?</strong> Se o paciente estiver instável, faça expansão com <strong>SF 0,9% (10-20 mL/kg)</strong> ANTES de repor água livre.</li>`;
  html += `<li><strong>Solução recomendada:</strong> Soro Glicosado 5% (SG 5%) ou NaCl 0,45% (se houver déficit de sódio associado).</li>`;
  html += `<li><strong>Tempo de infusão:</strong> Distribuir uniformemente ao longo de <strong>48 a 72 horas</strong>.</li>`;
  html += `<li><strong>Velocidade de Redução:</strong> Queda máxima do Na⁺ de <strong>10 a 12 mEq/L em 24h</strong> (aprox. 0,5 mEq/L/hora). Evite correções rápidas (Risco de Edema Cerebral).</li>`;
  html += `<li><strong>Atenção:</strong> Adicione este volume ao soro de manutenção basal do paciente.</li>`;
  html += `</ul>`;

  renderHTML('res-agua', html);
}

function renderHTML(elementId, htmlString) {
  const box = byId(elementId);
  if (box) {
      box.innerHTML = htmlString;
      box.style.display = 'block';
  }
}
