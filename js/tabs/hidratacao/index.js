// tabs/hidratacao/index.js

export function renderHidratacao() {
  const container = document.getElementById('tab-hidra');
  if (!container) return;

  container.innerHTML = `
    <div class="card" style="border-left: 5px solid var(--primary);">
      <div class="card-header" style="border-left: none; padding-left: 0;">
        <h2 style="color: var(--primary);">1. Manutenção Padrão (Holliday-Segar)</h2>
      </div>
      
      <div class="grid-2" style="margin-bottom: 14px;">
        <div>
          <label>Peso do Paciente (kg)</label>
          <input type="number" step="0.1" id="hol-peso" placeholder="Ex: 12.5">
        </div>
        <div>
          <label>Nº de Etapas (24h)</label>
          <select id="hol-etapas" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ccc;">
            <option value="1">1 de 24h</option>
            <option value="2">2 de 12h</option>
            <option value="3">3 de 8h</option>
            <option value="4" selected>4 de 6h</option>
            <option value="6">6 de 4h</option>
          </select>
        </div>
      </div>

      <div style="border-top: 1px dashed #ccc; padding-top: 14px;">
        <h3 style="font-size: 0.9rem; color: var(--text); margin-bottom: 10px;">Eletrólitos (por 100 mL de solução)</h3>
        <div class="grid-3">
          <div>
            <label>Na+ (mEq)</label>
            <input type="number" step="0.1" id="hol-na" value="3.0">
          </div>
          <div>
            <label>K+ (mEq)</label>
            <input type="number" step="0.1" id="hol-k" value="2.0">
          </div>
          <div>
            <label>Cálcio (mL de Gluc. 10%)</label>
            <input type="number" step="0.1" id="hol-ca" value="1.0">
          </div>
        </div>
      </div>

      <button class="calc-btn" id="btn-calc-hol" style="margin-top: 16px;">Calcular Holliday</button>
      <div id="res-hol" class="result-box" style="display: none; margin-top: 14px; background: rgba(40, 90, 129, 0.04);"></div>
    </div>

    <div class="card" style="border-left: 5px solid #16a085; margin-top: 20px;">
      <div class="card-header" style="border-left: none; padding-left: 0;">
        <h2 style="color: #16a085;">2. Aporte Metabólico Avançado (VIG)</h2>
      </div>
      
      <div class="grid-3" style="margin-bottom: 14px;">
        <div>
          <label>Peso (kg)</label>
          <input type="number" step="0.1" id="vig-peso" placeholder="Ex: 12.5">
        </div>
        <div>
          <label>VIG Alvo (mg/kg/min)</label>
          <input type="number" step="0.1" id="vig-alvo" placeholder="Ex: 5.0" value="5.0">
        </div>
        <div>
          <label>Nº de Etapas (24h)</label>
          <select id="vig-etapas" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ccc;">
            <option value="1">1 de 24h</option>
            <option value="2">2 de 12h</option>
            <option value="3">3 de 8h</option>
            <option value="4" selected>4 de 6h</option>
            <option value="6">6 de 4h</option>
          </select>
        </div>
      </div>

      <div style="border-top: 1px dashed #ccc; padding-top: 14px;">
        <h3 style="font-size: 0.9rem; color: var(--text); margin-bottom: 10px;">Eletrólitos (por 100 mL de solução)</h3>
        <div class="grid-3">
          <div>
            <label>Na+ (mEq)</label>
            <input type="number" step="0.1" id="vig-na" value="3.0">
          </div>
          <div>
            <label>K+ (mEq)</label>
            <input type="number" step="0.1" id="vig-k" value="2.0">
          </div>
          <div>
            <label>Cálcio (mL de Gluc. 10%)</label>
            <input type="number" step="0.1" id="vig-ca" value="1.0">
          </div>
        </div>
      </div>

      <button class="calc-btn" id="btn-calc-vig" style="margin-top: 16px; background-color: #16a085;">Calcular VIG</button>
      <div id="res-vig" class="result-box" style="display: none; margin-top: 14px; border-color: #16a085; background: rgba(22, 160, 133, 0.04);"></div>
    </div>
  `;

  // Atrelar eventos aos botões de forma independente
  document.getElementById('btn-calc-hol').addEventListener('click', calcularHolliday);
  document.getElementById('btn-calc-vig').addEventListener('click', calcularVIG);
}

// ==========================================
// MOTOR DE CÁLCULO 1: HOLLIDAY-SEGAR
// ==========================================
function calcularHolliday() {
  const peso = parseFloat(document.getElementById('hol-peso').value);
  if (!peso || peso <= 0) {
    alert("Insira um peso válido no bloco Holliday.");
    return;
  }

  const numEtapas = parseInt(document.getElementById('hol-etapas').value) || 1;
  const duracaoEtapa = 24 / numEtapas;

  const naPor100 = parseFloat(document.getElementById('hol-na').value) || 0;
  const kPor100 = parseFloat(document.getElementById('hol-k').value) || 0;
  const caPor100 = parseFloat(document.getElementById('hol-ca').value) || 0;

  // Cálculo de Volume Total 24h
  let vol24h = 0;
  if (peso <= 10) {
    vol24h = peso * 100;
  } else if (peso <= 20) {
    vol24h = 1000 + ((peso - 10) * 50);
  } else {
    vol24h = 1500 + ((peso - 20) * 20);
  }

  const fator = vol24h / 100;
  
  // Eletrólitos 24h
  const na_mEq = naPor100 * fator;
  const k_mEq = kPor100 * fator;
  const ca_mL = caPor100 * fator;

  // Ampolas 24h
  const nacl20_mL = na_mEq / 3.4;
  const kcl19_mL = k_mEq / 2.5;
  const eletrolitosTotal = nacl20_mL + kcl19_mL + ca_mL;

  // Solução Base
  const sg5_mL = vol24h - eletrolitosTotal;
  const taxaBIC = vol24h / 24;

  // Exibição
  let html = `<div style="text-align: left; font-family: monospace; line-height: 1.6;">`;
  html += `<span style="font-weight: bold; color: var(--primary); font-size: 1.1rem;">RESUMO HOLLIDAY-SEGAR</span><br>`;
  html += `• Volume Total 24h: ${vol24h.toFixed(0)} mL<br>`;
  html += `• Correr em BIC a: <strong>${taxaBIC.toFixed(1)} mL/h</strong><br><br>`;
  
  html += `<strong>Prescrição: Montar ${numEtapas} etapa(s) de ${duracaoEtapa}h<br>`;
  html += `(Volume final do frasco: ${(vol24h / numEtapas).toFixed(1)} mL)</strong><br>`;
  html += `- SG 5%: ${(sg5_mL / numEtapas).toFixed(1)} mL<br>`;
  html += `- NaCl 20%: ${(nacl20_mL / numEtapas).toFixed(1)} mL<br>`;
  html += `- KCl 19,1%: ${(kcl19_mL / numEtapas).toFixed(1)} mL<br>`;
  if (ca_mL > 0) {
    html += `- Gluconato de Cálcio 10%: ${(ca_mL / numEtapas).toFixed(1)} mL<br>`;
  }
  html += `</div>`;

  const resBox = document.getElementById('res-hol');
  resBox.style.display = 'block';
  resBox.innerHTML = html;
}

// ==========================================
// MOTOR DE CÁLCULO 2: VIG
// ==========================================
function calcularVIG() {
  const peso = parseFloat(document.getElementById('vig-peso').value);
  if (!peso || peso <= 0) {
    alert("Insira um peso válido no bloco VIG.");
    return;
  }

  const vigAlvo = parseFloat(document.getElementById('vig-alvo').value) || 0;
  const numEtapas = parseInt(document.getElementById('vig-etapas').value) || 1;
  const duracaoEtapa = 24 / numEtapas;

  const naPor100 = parseFloat(document.getElementById('vig-na').value) || 0;
  const kPor100 = parseFloat(document.getElementById('vig-k').value) || 0;
  const caPor100 = parseFloat(document.getElementById('vig-ca').value) || 0;

  // Volume segue a mesma meta hídrica do Holliday
  let vol24h = 0;
  if (peso <= 10) {
    vol24h = peso * 100;
  } else if (peso <= 20) {
    vol24h = 1000 + ((peso - 10) * 50);
  } else {
    vol24h = 1500 + ((peso - 20) * 20);
  }

  const concAlvo = (vigAlvo * peso * 144) / vol24h;
  const glicose_g = vol24h * (concAlvo / 100);

  const fator = vol24h / 100;
  const na_mEq = naPor100 * fator;
  const k_mEq = kPor100 * fator;
  const ca_mL = caPor100 * fator;

  const nacl20_mL = na_mEq / 3.4;
  const kcl19_mL = k_mEq / 2.5;
  const eletrolitosTotal = nacl20_mL + kcl19_mL + ca_mL;
  const volSoroLivre = vol24h - eletrolitosTotal;

  let sg5_mL = 0;
  let g50_mL = 0;
  let ad_mL = 0;
  let usarAD = false;

  g50_mL = (glicose_g - (volSoroLivre * 0.05)) / 0.45;

  if (g50_mL < 0) {
    usarAD = true;
    g50_mL = glicose_g / 0.50;
    ad_mL = volSoroLivre - g50_mL;
  } else {
    sg5_mL = volSoroLivre - g50_mL;
  }
  
  const taxaBIC = vol24h / 24;

  // Exibição
  let html = `<div style="text-align: left; font-family: monospace; line-height: 1.6;">`;
  html += `<span style="font-weight: bold; color: #16a085; font-size: 1.1rem;">RESUMO VIG AVANÇADO</span><br>`;
  html += `• VIG Alcançado: ${vigAlvo.toFixed(1)} mg/kg/min<br>`;
  html += `• Concentração de Glicose: <strong>${concAlvo.toFixed(2)}%</strong><br>`;
  html += `• Volume Total 24h: ${vol24h.toFixed(0)} mL<br>`;
  html += `• Correr em BIC a: <strong>${taxaBIC.toFixed(1)} mL/h</strong><br><br>`;
  
  html += `<strong>Prescrição: Montar ${numEtapas} etapa(s) de ${duracaoEtapa}h<br>`;
  html += `(Volume final do frasco: ${(vol24h / numEtapas).toFixed(1)} mL)</strong><br>`;
  
  if (usarAD) {
    html += `- Água Destilada (AD): ${(ad_mL / numEtapas).toFixed(1)} mL<br>`;
  } else {
    html += `- SG 5%: ${(sg5_mL / numEtapas).toFixed(1)} mL<br>`;
  }
  html += `- Glicose 50%: ${(g50_mL / numEtapas).toFixed(1)} mL<br>`;
  html += `- NaCl 20%: ${(nacl20_mL / numEtapas).toFixed(1)} mL<br>`;
  html += `- KCl 19,1%: ${(kcl19_mL / numEtapas).toFixed(1)} mL<br>`;
  if (ca_mL > 0) {
    html += `- Gluconato de Cálcio 10%: ${(ca_mL / numEtapas).toFixed(1)} mL<br>`;
  }
  html += `</div>`;

  const resBox = document.getElementById('res-vig');
  resBox.style.display = 'block';
  resBox.innerHTML = html;
}
