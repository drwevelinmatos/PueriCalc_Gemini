// tabs/hidratacao/index.js

export function renderHidratacao() {
  const container = document.getElementById('tab-hidra');
  if (!container) return;

  container.innerHTML = `
    <div class="card">
      <div class="card-header">
        <h2>Cálculo de Hidratação Venosa (Manutenção e VIG)</h2>
      </div>
      
      <div class="grid-3" style="margin-bottom: 14px;">
        <div>
          <label>Peso do Paciente (kg)</label>
          <input type="number" step="0.1" id="hidra-peso" placeholder="Ex: 12.5">
        </div>
        <div>
          <label>VIG Alvo (mg/kg/min)</label>
          <input type="number" step="0.1" id="hidra-vig" placeholder="Ex: 5.0" value="5.0">
        </div>
        <div>
          <label>Nº de Etapas (24h)</label>
          <select id="hidra-etapas" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ccc;">
            <option value="1">1 de 24h</option>
            <option value="2">2 de 12h</option>
            <option value="3">3 de 8h</option>
            <option value="4" selected>4 de 6h</option>
            <option value="6">6 de 4h</option>
          </select>
        </div>
      </div>

      <div style="border-top: 1px solid #eee; padding-top: 14px; margin-top: 14px;">
        <h3 style="font-size: 0.9rem; color: var(--primary); margin-bottom: 10px;">Eletrólitos e Minerais Basais (por 100 mL de solução)</h3>
        <div class="grid-3">
          <div>
            <label>Na+ (mEq/100mL)</label>
            <input type="number" step="0.1" id="hidra-na" value="3.0">
          </div>
          <div>
            <label>K+ (mEq/100mL)</label>
            <input type="number" step="0.1" id="hidra-k" value="2.0">
          </div>
          <div>
            <label>Cálcio (mL/100mL de Gluc. Ca 10%)</label>
            <input type="number" step="0.1" id="hidra-ca" value="1.0">
          </div>
        </div>
      </div>
    </div>

    <button class="calc-btn" id="btn-calc-hidra">Calcular Prescrições</button>
    <div id="res-hidra" class="result-box"></div>
  `;

  document.getElementById('btn-calc-hidra').addEventListener('click', calcularDuplaHidratacao);
}

function calcularDuplaHidratacao() {
  const peso = parseFloat(document.getElementById('hidra-peso').value);
  if (!peso || peso <= 0) {
    alert("Por favor, insira um peso válido.");
    return;
  }

  const vigAlvo = parseFloat(document.getElementById('hidra-vig').value) || 0;
  const numEtapas = parseInt(document.getElementById('hidra-etapas').value) || 1;
  const duracaoEtapa = 24 / numEtapas;

  // Eletrólitos solicitados por cada 100 mL
  const naPor100 = parseFloat(document.getElementById('hidra-na').value) || 0;
  const kPor100 = parseFloat(document.getElementById('hidra-k').value) || 0;
  const caPor100 = parseFloat(document.getElementById('hidra-ca').value) || 0;

  // ==========================================================================
  // MATEMÁTICA DO BLOCO 1: HOLLIDAY-SEGAR (Volume basal fixo, Glicose padrão 5%)
  // ==========================================================================
  let volHolliday24h = 0;
  if (peso <= 10) {
    volHolliday24h = peso * 100;
  } else if (peso <= 20) {
    volHolliday24h = 1000 + ((peso - 10) * 50);
  } else {
    volHolliday24h = 1500 + ((peso - 20) * 20);
  }

  const fatorHolliday = volHolliday24h / 100;
  const naHolliday_mEq = naPor100 * fatorHolliday;
  const kHolliday_mEq = kPor100 * fatorHolliday;
  const caHolliday_mL = caPor100 * fatorHolliday;

  const nacl20Holliday_mL = naHolliday_mEq / 3.4;
  const kcl19Holliday_mL = kHolliday_mEq / 2.5;
  const eletrolitosHollidayTotal = nacl20Holliday_mL + kcl19Holliday_mL + caHolliday_mL;

  // No Holliday puro, a solução base é o próprio Soro Glicosado 5% ocupando o espaço livre
  const sg5Holliday_mL = volHolliday24h - eletrolitosHollidayTotal;
  const taxaBICHolliday = volHolliday24h / 24;

  // ==========================================================================
  // MATEMÁTICA DO BLOCO 2: VIG AVANÇADO (Volume Holliday, Concentração variável)
  // ==========================================================================
  // O volume total de infusão acompanha a mesma meta calórica volumétrica do Holliday
  const volVIG24h = volHolliday24h; 
  
  // Concentração necessária calculada pela fórmula clássica de infusão de carboidratos
  const concAlvoVIG = (vigAlvo * peso * 144) / volVIG24h;
  const glicoseNecessariaVIG_g = volVIG24h * (concAlvoVIG / 100);

  const fatorVIG = volVIG24h / 100;
  const naVIG_mEq = naPor100 * fatorVIG;
  const kVIG_mEq = kPor100 * fatorVIG;
  const caVIG_mL = caPor100 * fatorVIG;

  const nacl20VIG_mL = naVIG_mEq / 3.4;
  const kcl19VIG_mL = kVIG_mEq / 2.5;
  const eletrolitosVIGTotal = nacl20VIG_mL + kcl19VIG_mL + caVIG_mL;
  const volSoroLivreVIG = volVIG24h - eletrolitosVIGTotal;

  // Sistema de equações lineares para determinar o balanço SG5% e G50%
  let sg5VIG_mL = 0;
  let g50VIG_mL = 0;
  let adVIG_mL = 0;
  let usarADVIG = false;

  g50VIG_mL = (glicoseNecessariaVIG_g - (volSoroLivreVIG * 0.05)) / 0.45;

  if (g50VIG_mL < 0) {
    usarADVIG = true;
    g50VIG_mL = glicoseNecessariaVIG_g / 0.50;
    adVIG_mL = volSoroLivreVIG - g50VIG_mL;
  } else {
    sg5VIG_mL = volSoroLivreVIG - g50VIG_mL;
  }
  const taxaBICVIG = volVIG24h / 24;

  // ==========================================================================
  // COMPILAÇÃO VISUAL DA PRESCRIÇÃO
  // ==========================================================================
  let html = `<div style="text-align: left; font-family: monospace; line-height: 1.6;">`;

  // --- RENDICIONAMENTO DO BLOCO 1 ---
  html += `<div style="background: rgba(40, 90, 129, 0.04); padding: 14px; border-left: 4px solid var(--primary); margin-bottom: 20px; border-radius: 0 8px 8px 0;">`;
  html += `<span style="font-weight: bold; color: var(--primary); font-size: 1.1rem;">BLOCO 1: HIDRATAÇÃO DE MANUTENÇÃO (HOLLIDAY-SEGAR)</span><br>`;
  html += `<small style="color: #666;">Indicação: Manutenção metabólica basal standard (Glicose estável a 5%)</small><br><br>`;
  html += `• Volume Frasco 24h: ${volHolliday24h.toFixed(0)} mL<br>`;
  html += `• Taxa de Infusão BIC: <strong>${taxaBICHolliday.toFixed(1)} mL/h</strong><br><br>`;
  html += `<strong>Prescrição por Etapa (${numEtapas} etapa(s) de ${duracaoEtapa}h - Vol/Frasco: ${(volHolliday24h / numEtapas).toFixed(1)} mL):</strong><br>`;
  html += `- Soro Glicosado 5% (SG 5%): ${(sg5Holliday_mL / numEtapas).toFixed(1)} mL<br>`;
  html += `- NaCl 20%: ${(nacl20Holliday_mL / numEtapas).toFixed(1)} mL<br>`;
  html += `- KCl 19,1%: ${(kcl19Holliday_mL / numEtapas).toFixed(1)} mL<br>`;
  if (caHolliday_mL > 0) {
    html += `- Gluconato de Cálcio 10%: ${(caHolliday_mL / numEtapas).toFixed(1)} mL<br>`;
  }
  html += `</div>`;

  // --- RENDICIONAMENTO DO BLOCO 2 ---
  html += `<div style="background: rgba(22, 160, 133, 0.04); padding: 14px; border-left: 4px solid #16a085; border-radius: 0 8px 8px 0;">`;
  html += `<span style="font-weight: bold; color: #16a085; font-size: 1.1rem;">BLOCO 2: APORTE METABÓLICO AVANÇADO (VIG)</span><br>`;
  html += `<small style="color: #666;">Indicação: Controle glicêmico estrito / Jejum / Neonatologia</small><br><br>`;
  html += `• VIG Executada: ${vigAlvo.toFixed(1)} mg/kg/min<br>`;
  html += `• Concentração Final calculada: <strong>${concAlvoVIG.toFixed(2)}%</strong><br>`;
  html += `• Volume Frasco 24h: ${volVIG24h.toFixed(0)} mL<br>`;
  html += `• Taxa de Infusão BIC: <strong>${taxaBICVIG.toFixed(1)} mL/h</strong><br><br>`;
  html += `<strong>Prescrição por Etapa (${numEtapas} etapa(s) de ${duracaoEtapa}h - Vol/Frasco: ${(volVIG24h / numEtapas).toFixed(1)} mL):</strong><br>`;
  
  if (usarADVIG) {
    html += `- Água Destilada (AD): ${(adVIG_mL / numEtapas).toFixed(1)} mL<br>`;
  } else {
    html += `- Soro Glicosado 5% (SG 5%): ${(sg5VIG_mL / numEtapas).toFixed(1)} mL<br>`;
  }
  html += `- Glicose 50% (G 50%): ${(g50VIG_mL / numEtapas).toFixed(1)} mL<br>`;
  html += `- NaCl 20%: ${(nacl20VIG_mL / numEtapas).toFixed(1)} mL<br>`;
  html += `- KCl 19,1%: ${(kcl19VIG_mL / numEtapas).toFixed(1)} mL<br>`;
  if (caVIG_mL > 0) {
    html += `- Gluconato de Cálcio 10%: ${(caVIG_mL / numEtapas).toFixed(1)} mL<br>`;
  }
  html += `</div>`;

  html += `</div>`;

  const resBox = document.getElementById('res-hidra');
  if (resBox) {
    resBox.style.display = 'block';
    resBox.innerHTML = html;
  }
}
