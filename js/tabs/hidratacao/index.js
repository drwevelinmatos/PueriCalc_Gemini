// tabs/hidratacao/index.js

export function renderHidratacao() {
  const container = document.getElementById('tab-hidra');
  if (!container) return;

  container.innerHTML = `
    <div class="card">
      <div class="card-header">
        <h2>Hidratação Venosa de Manutenção (Holliday-Segar)</h2>
      </div>
      
      <div class="grid-2" style="margin-bottom: 14px;">
        <div>
          <label>Peso (kg)</label>
          <input type="number" step="0.1" id="hidra-peso" placeholder="Ex: 12.5">
        </div>
        <div>
          <label>VIG Alvo (mg/kg/min)</label>
          <input type="number" step="0.1" id="hidra-vig" placeholder="Ex: 5.0" value="5.0">
        </div>
      </div>

      <div style="border-top: 1px solid #eee; padding-top: 14px; margin-top: 14px;">
        <h3 style="font-size: 0.9rem; color: var(--primary); margin-bottom: 10px;">Eletrólitos e Minerais (por 100 mL de solução)</h3>
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
            <label>Cálcio (mL/100mL)</label>
            <small style="font-size: 0.65rem; color: #666; display: block; margin-bottom: 4px;">Gluconato 10%</small>
            <input type="number" step="0.1" id="hidra-ca" value="1.0">
          </div>
        </div>
      </div>
    </div>

    <button class="calc-btn" id="btn-calc-hidra">Calcular Prescrição</button>
    <div id="res-hidra" class="result-box"></div>
  `;

  // Acionar o evento de cálculo
  document.getElementById('btn-calc-hidra').addEventListener('click', calcularHidratacao);
}

function calcularHidratacao() {
  const peso = parseFloat(document.getElementById('hidra-peso').value);
  if (!peso || peso <= 0) {
    alert("Por favor, insira um peso válido.");
    return;
  }

  // === 1. CÁLCULO DE VOLUME (HOLLIDAY-SEGAR) ===
  let volTotal = 0;
  if (peso <= 10) {
    volTotal = peso * 100;
  } else if (peso <= 20) {
    volTotal = 1000 + ((peso - 10) * 50);
  } else {
    volTotal = 1500 + ((peso - 20) * 20);
  }

  // === 2. CÁLCULO DE ELETRÓLITOS E CÁLCIO ===
  // Captura as requisições a cada 100mL
  const naPor100 = parseFloat(document.getElementById('hidra-na').value) || 0;
  const kPor100 = parseFloat(document.getElementById('hidra-k').value) || 0;
  const caPor100 = parseFloat(document.getElementById('hidra-ca').value) || 0;

  // Fator multiplicador para o volume total de 24h
  const fatorVol = volTotal / 100;

  // Totais em mEq e mL
  const totalNa_mEq = naPor100 * fatorVol;
  const totalK_mEq = kPor100 * fatorVol;
  const volGlucCa10 = caPor100 * fatorVol; // ml Totais de Gluconato de Ca 10%

  // Conversão para Ampolas (Soluções Padrão)
  // NaCl 20% tem 3,4 mEq/mL
  const volNaCl20 = totalNa_mEq / 3.4;
  // KCl 19,1% tem 2,5 mEq/mL (alguns lugares usam 10% que é 1,34mEq/mL, adotando 19,1% padrão)
  const volKCl19 = totalK_mEq / 2.5;

  const volEletrolitosTotal = volNaCl20 + volKCl19 + volGlucCa10;

  // === 3. CÁLCULO DA VIG E MISTURA GLICOSADA ===
  const vigAlvo = parseFloat(document.getElementById('hidra-vig').value) || 0;
  
  // Fórmula VIG = (Conc * Vol) / (Peso * 144) -> Isolando a Concentração Alvo (%)
  const concAlvo = (vigAlvo * peso * 144) / volTotal;
  
  // Gramas de glicose necessárias para 24h
  const glicoseTotal_g = volTotal * (concAlvo / 100);

  // Volume que sobra para adicionar fluidos após colocar os eletrólitos/cálcio
  const volSoroLivre = volTotal - volEletrolitosTotal;

  let volG50 = 0;
  let volSG5 = 0;
  let volAD = 0;
  let usarAD = false;

  // Matemática da Mistura (Isolando variáveis)
  // V_SG5 + V_G50 = volSoroLivre
  // (V_SG5 * 0.05) + (V_G50 * 0.50) = glicoseTotal_g
  // Resulta em: V_G50 = (glicoseTotal_g - (volSoroLivre * 0.05)) / 0.45
  volG50 = (glicoseTotal_g - (volSoroLivre * 0.05)) / 0.45;

  if (volG50 < 0) {
    // Se volG50 é negativo, significa que a concentração alvo é < 5%. 
    // Devemos misturar Água Destilada (0%) com Glicose 50%
    usarAD = true;
    volG50 = glicoseTotal_g / 0.50;
    volAD = volSoroLivre - volG50;
  } else {
    volSG5 = volSoroLivre - volG50;
  }

  // === 4. RENDERIZAÇÃO DA PRESCRIÇÃO ===
  // Formatação em mL/h para a Bomba de Infusão Contínua (BIC)
  const taxaBIC = volTotal / 24;

  let html = `<strong>RESUMO METABÓLICO</strong><br>`;
  html += `- Volume Total (24h): <strong>${volTotal.toFixed(0)} mL</strong><br>`;
  html += `- VIG Calculada: <strong>${vigAlvo.toFixed(2)} mg/kg/min</strong><br>`;
  html += `- Concentração de Glicose na Solução: <strong>${concAlvo.toFixed(2)}%</strong><br><br>`;

  html += `<strong>PRESCRIÇÃO - SOLUÇÃO BASE (24 HORAS)</strong><br>`;
  
  if (usarAD) {
    html += `- Água Destilada (AD): ${volAD.toFixed(1)} mL<br>`;
  } else {
    html += `- Soro Glicosado 5% (SG 5%): ${volSG5.toFixed(1)} mL<br>`;
  }
  html += `- Glicose 50% (G50%): ${volG50.toFixed(1)} mL<br>`;
  html += `- NaCl 20%: ${volNaCl20.toFixed(1)} mL<br>`;
  html += `- KCl 19,1%: ${volKCl19.toFixed(1)} mL<br>`;
  
  if (volGlucCa10 > 0) {
    html += `- Gluconato de Cálcio 10%: ${volGlucCa10.toFixed(1)} mL<br>`;
  }

  html += `<br><strong>INFUSÃO</strong><br>`;
  html += `- Correr em Bomba de Infusão Contínua (BIC) a <strong>${taxaBIC.toFixed(1)} mL/h</strong><br>`;

  const resBox = document.getElementById('res-hidra');
  resBox.style.display = 'block';
  resBox.innerHTML = html;
}
