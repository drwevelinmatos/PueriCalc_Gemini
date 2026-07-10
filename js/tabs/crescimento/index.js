export function renderCrescimento() {
  const container = document.getElementById('tab-cresc');

  container.innerHTML = `
    <div class="card">
      <div class="card-header">
        <h2>Velocidade de Crescimento</h2>
      </div>
      
      <div class="grid-2">
        <div>
          <label>Data Inicial</label>
          <input type="date" id="cresc-data1">
        </div>
        <div>
          <label>Data Atual (Final)</label>
          <input type="date" id="cresc-data2">
        </div>
      </div>

      <div class="grid-2" style="margin-top: 14px;">
        <div style="border-right: 1px dashed #ccc; padding-right: 10px;">
          <h3 style="font-size: 0.9rem; color: var(--primary);">Medidas Anteriores</h3>
          <label>PC (cm)</label>
          <input type="number" step="0.1" id="cresc-pc1" placeholder="Ex: 35.0">
          <label>Peso (kg)</label>
          <input type="number" step="0.01" id="cresc-peso1" placeholder="Ex: 3.2">
          <label>Estatura (cm)</label>
          <input type="number" step="0.1" id="cresc-est1" placeholder="Ex: 50.0">
        </div>
        <div style="padding-left: 10px;">
          <h3 style="font-size: 0.9rem; color: var(--primary);">Medidas Atuais</h3>
          <label>PC (cm)</label>
          <input type="number" step="0.1" id="cresc-pc2" placeholder="Ex: 42.0">
          <label>Peso (kg)</label>
          <input type="number" step="0.01" id="cresc-peso2" placeholder="Ex: 6.5">
          <label>Estatura (cm)</label>
          <input type="number" step="0.1" id="cresc-est2" placeholder="Ex: 62.0">
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h2>Alvo Parental e Idade Óssea</h2>
      </div>
      <div class="grid-2">
        <div>
          <label>Sexo do Paciente</label>
          <select id="cresc-sexo">
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>
        </div>
        <div>
          <label>Data de Nasc. (Para Z-Score Atual)</label>
          <input type="date" id="cresc-nasc">
        </div>
        <div>
          <label>Altura da Mãe (cm)</label>
          <input type="number" step="0.1" id="cresc-mae" placeholder="Ex: 165">
        </div>
        <div>
          <label>Altura do Pai (cm)</label>
          <input type="number" step="0.1" id="cresc-pai" placeholder="Ex: 178">
        </div>
      </div>
      
      <div class="grid-2" style="margin-top: 10px;">
        <div>
          <label>Idade Óssea (No Raio-X)</label>
          <div style="display: flex; gap: 5px;">
            <input type="number" id="cresc-io-anos" placeholder="Anos">
            <input type="number" id="cresc-io-meses" placeholder="Meses">
          </div>
        </div>
        <div>
          <label>Idade Cronológica (Na data do Raio-X)</label>
          <div style="display: flex; gap: 5px;">
            <input type="number" id="cresc-ic-rx-anos" placeholder="Anos">
            <input type="number" id="cresc-ic-rx-meses" placeholder="Meses">
          </div>
        </div>
      </div>
    </div>

    <button class="calc-btn" id="btn-calc-cresc">Calcular Crescimento</button>
    <div id="res-cresc" class="result-box"></div>
  `;

  // Preencher Data Atual automaticamente
  document.getElementById('cresc-data2').valueAsDate = new Date();

  // Evento de cálculo
  document.getElementById('btn-calc-cresc').addEventListener('click', calcularCrescimento);
}

// Motor de Cálculo OMS (Método LMS)
function calcularZScoreOMS(medida, l, m, s) {
  if (!medida || !l || !m || !s) return null;
  if (l === 0) return Math.log(medida / m) / s;
  return (Math.pow(medida / m, l) - 1) / (l * s);
}

function calcularCrescimento() {
  // Coletar Datas
  const d1 = new Date(document.getElementById('cresc-data1').value);
  const d2 = new Date(document.getElementById('cresc-data2').value);
  const nasc = new Date(document.getElementById('cresc-nasc').value);
  
  // Coletar Medidas
  const pc1 = parseFloat(document.getElementById('cresc-pc1').value) || 0;
  const pc2 = parseFloat(document.getElementById('cresc-pc2').value) || 0;
  const peso1 = parseFloat(document.getElementById('cresc-peso1').value) || 0;
  const peso2 = parseFloat(document.getElementById('cresc-peso2').value) || 0;
  const est1 = parseFloat(document.getElementById('cresc-est1').value) || 0;
  const est2 = parseFloat(document.getElementById('cresc-est2').value) || 0;

  // Coletar Alvo Parental e Idades do Raio-X
  const sexo = document.getElementById('cresc-sexo').value;
  const mae = parseFloat(document.getElementById('cresc-mae').value) || 0;
  const pai = parseFloat(document.getElementById('cresc-pai').value) || 0;
  
  const ioAnos = parseInt(document.getElementById('cresc-io-anos').value) || 0;
  const ioMeses = parseInt(document.getElementById('cresc-io-meses').value) || 0;
  const icRxAnos = parseInt(document.getElementById('cresc-ic-rx-anos').value) || 0;
  const icRxMeses = parseInt(document.getElementById('cresc-ic-rx-meses').value) || 0;

  // Cálculo de tempo entre as consultas (Velocidade)
  let diffMesesVelocidade = 0;
  let diffAnosVelocidade = 0;
  if (!isNaN(d1) && !isNaN(d2)) {
    diffMesesVelocidade = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
    const diasExtra = d2.getDate() - d1.getDate();
    if (diasExtra < 0) diffMesesVelocidade -= 1;
    diffAnosVelocidade = diffMesesVelocidade / 12;
  }

  // Idade Cronológica Atual (Apenas oculta para o Motor OMS)
  let idadeTotalMeses = 0;
  if (!isNaN(nasc) && !isNaN(d2)) {
    let mesesTotais = (d2.getFullYear() - nasc.getFullYear()) * 12 + (d2.getMonth() - nasc.getMonth());
    if (d2.getDate() < nasc.getDate()) mesesTotais -= 1;
    idadeTotalMeses = mesesTotais;
  }

  // Cálculo de Velocidades (por ano)
  let velPC = 0, velPeso = 0, velEst = 0;
  if (diffAnosVelocidade > 0) {
    velPC = (pc2 - pc1) / diffAnosVelocidade;
    velPeso = (peso2 - peso1) / diffAnosVelocidade;
    velEst = (est2 - est1) / diffAnosVelocidade;
  }

  // Cálculo Alvo Parental (Tanner)
  let alvo = 0;
  if (mae > 0 && pai > 0) {
    alvo = sexo === 'M' ? (pai + mae + 13) / 2 : (pai + mae - 13) / 2;
  }

  // === INTEGRAÇÃO OMS (Mock Data) ===
  const omsData = {
      peso: { l: -0.1661, m: 7.1, s: 0.1111 },
      estatura: { l: 1, m: 65.9, s: 0.0364 },
      pc: { l: 1, m: 42.2, s: 0.0300 },
      alvoAdulto: { l: 1, m: 176.1, s: 0.04 }
  };

  const zPeso = calcularZScoreOMS(peso2, omsData.peso.l, omsData.peso.m, omsData.peso.s);
  const zEst = calcularZScoreOMS(est2, omsData.estatura.l, omsData.estatura.m, omsData.estatura.s);
  const zPC = calcularZScoreOMS(pc2, omsData.pc.l, omsData.pc.m, omsData.pc.s);
  const zAlvo = calcularZScoreOMS(alvo, omsData.alvoAdulto.l, omsData.alvoAdulto.m, omsData.alvoAdulto.s);

  // Formatação Idades
  const strIO = ioAnos > 0 || ioMeses > 0 ? `${ioAnos}a ${ioMeses}m` : "Não informada";
  const strIC_RX = icRxAnos > 0 || icRxMeses > 0 ? `${icRxAnos}a ${icRxMeses}m` : "Não informada";

  // Função auxiliar para formatar Z-Score
  const fmtZ = (val) => val !== null ? (val > 0 ? '+' : '') + val.toFixed(2) + ' SD' : 'Requer dados OMS';

  // Construção do Resultado Final
  let html = `<strong>BLOCO 1 - Medidas e Velocidade</strong><br>`;
  html += `- PC: ${pc2 ? pc2.toFixed(1) + ' cm' : '--'} (${velPC ? velPC.toFixed(1) + ' cm/ano' : '--'})<br>`;
  html += `- Peso: ${peso2 ? peso2.toFixed(2) + ' kg' : '--'} (${velPeso ? velPeso.toFixed(2) + ' kg/ano' : '--'})<br>`;
  html += `- Estatura: ${est2 ? est2.toFixed(1) + ' cm' : '--'} (${velEst ? velEst.toFixed(1) + ' cm/ano' : '--'})<br><br>`;

  html += `<strong>BLOCO 2 - Referência para a Idade (Z-Score OMS Atual)</strong><br>`;
  html += `- PC: ${fmtZ(zPC)}<br>`;
  html += `- Peso: ${fmtZ(zPeso)}<br>`;
  html += `- Estatura: ${fmtZ(zEst)}<br><br>`;

  html += `<strong>ALVO PARENTAL E DESENVOLVIMENTO ÓSSEO</strong><br>`;
  if (alvo > 0) {
    html += `- Alvo parental: ${alvo.toFixed(1)} cm<br>`;
    html += `- Faixa: ${(alvo - 5).toFixed(1)} a ${(alvo + 5).toFixed(1)} cm<br>`;
  } else {
    html += `- Alvo parental: Dados dos pais incompletos<br>`;
  }
  html += `- Idade Óssea: ${strIO}<br>`;
  html += `- Idade Cronológica (No momento do RX): ${strIC_RX}<br>`;
  html += `- Desvio padrão calculado (Alvo): ${fmtZ(zAlvo)}<br>`;

  const resBox = document.getElementById('res-cresc');
  resBox.style.display = 'block';
  resBox.innerHTML = html;
}
