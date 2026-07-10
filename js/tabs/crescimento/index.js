import { WHO_DATA } from './who_data.js';

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
          <label>Idade Óssea</label>
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

  // 1) Preencher Data Atual (Final) automaticamente com a data de hoje
  document.getElementById('cresc-data2').valueAsDate = new Date();

  // Acionar o evento de clique para o cálculo
  document.getElementById('btn-calc-cresc').addEventListener('click', calcularCrescimento);
}

// Equação oficial Box-Cox da OMS para cálculo de Z-Score
function calcularZScoreOMS(medida, l, m, s) {
  if (!medida || l === undefined || m === undefined || s === undefined) return null;
  if (l === 0) return Math.log(medida / m) / s;
  return (Math.pow(medida / m, l) - 1) / (l * s);
}

function calcularCrescimento() {
  // Captura de Elementos do DOM
  const d1 = new Date(document.getElementById('cresc-data1').value);
  const d2 = new Date(document.getElementById('cresc-data2').value);
  const nasc = new Date(document.getElementById('cresc-nasc').value);
  
  const pc1 = parseFloat(document.getElementById('cresc-pc1').value) || 0;
  const pc2 = parseFloat(document.getElementById('cresc-pc2').value) || 0;
  const peso1 = parseFloat(document.getElementById('cresc-peso1').value) || 0;
  const peso2 = parseFloat(document.getElementById('cresc-peso2').value) || 0;
  const est1 = parseFloat(document.getElementById('cresc-est1').value) || 0;
  const est2 = parseFloat(document.getElementById('cresc-est2').value) || 0;

  const sexo = document.getElementById('cresc-sexo').value;
  const mae = parseFloat(document.getElementById('cresc-mae').value) || 0;
  const pai = parseFloat(document.getElementById('cresc-pai').value) || 0;
  
  const ioAnos = parseInt(document.getElementById('cresc-io-anos').value) || 0;
  const ioMeses = parseInt(document.getElementById('cresc-io-meses').value) || 0;
  const icRxAnos = parseInt(document.getElementById('cresc-ic-rx-anos').value) || 0;
  const icRxMeses = parseInt(document.getElementById('cresc-ic-rx-meses').value) || 0;

  // Cálculo do tempo em anos para velocidade de crescimento anual
  let diffAnosVelocidade = 0;
  if (!isNaN(d1) && !isNaN(d2)) {
    let diffMeses = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
    if (d2.getDate() < d1.getDate()) diffMeses -= 1;
    diffAnosVelocidade = diffMeses / 12;
  }

  // Idade Cronológica Atual em meses completos (Para buscar nas tabelas OMS)
  let idadeTotalMeses = 0;
  if (!isNaN(nasc) && !isNaN(d2)) {
    let mesesTotais = (d2.getFullYear() - nasc.getFullYear()) * 12 + (d2.getMonth() - nasc.getMonth());
    if (d2.getDate() < nasc.getDate()) mesesTotais -= 1;
    idadeTotalMeses = mesesTotais;
  }

  // Cálculos de Velocidade de Crescimento (Bloco 1)
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

  // === PROCESSAMENTO DOS Z-SCORES REAIS (OMS) ===
  let zPC = null, zPeso = null, zEst = null, zAlvo = null;

  if (WHO_DATA && WHO_DATA[sexo]) {
    const tabelas = WHO_DATA[sexo];

    // Busca dos parâmetros L, M, S para a idade atual em meses
    if (idadeTotalMeses >= 0) {
      if (pc2 > 0 && tabelas.pc && tabelas.pc[idadeTotalMeses]) {
        const ref = tabelas.pc[idadeTotalMeses];
        zPC = calcularZScoreOMS(pc2, ref.l, ref.m, ref.s);
      }
      if (peso2 > 0 && tabelas.peso && tabelas.peso[idadeTotalMeses]) {
        const ref = tabelas.peso[idadeTotalMeses];
        zPeso = calcularZScoreOMS(peso2, ref.l, ref.m, ref.s);
      }
      if (est2 > 0 && tabelas.estatura && tabelas.estatura[idadeTotalMeses]) {
        const ref = tabelas.estatura[idadeTotalMeses];
        zEst = calcularZScoreOMS(est2, ref.l, ref.m, ref.s);
      }
    }

    // Cálculo do Desvio Padrão do Alvo Parental usando a tabela de estatura final adulta (19 anos / 228 meses)
    if (alvo > 0 && tabelas.estatura && tabelas.estatura[228]) {
      const refAlvo = tabelas.estatura[228];
      zAlvo = calcularZScoreOMS(alvo, refAlvo.l, refAlvo.m, refAlvo.s);
    }
  }

  // Formatação das Strings de Idade e Desvios Padrões
  const strIO = ioAnos > 0 || ioMeses > 0 ? `${ioAnos}a ${ioMeses}m` : "Não informada";
  const strIC = icRxAnos > 0 || icRxMeses > 0 ? `${icRxAnos}a ${icRxMeses}m` : "Não informada";

  const fmtZ = (val) => {
    if (val === null || isNaN(val)) return "Sem dados de referência";
    return (val > 0 ? "+" : "") + val.toFixed(2) + " SD";
  };

  const fmtVel = (val, unid) => {
    if (diffAnosVelocidade <= 0 || isNaN(val)) return "Requer 2 datas";
    return (val >= 0 ? "+" : "") + val.toFixed(unid === 'peso' ? 2 : 1) + (unid === 'peso' ? " kg/ano" : " cm/ano");
  };

  // === CONSTRUÇÃO DA EXIBIÇÃO FINAL EXATAMENTE CONFORME PROTOCOLO ===
  let html = `<strong>Bloco 1</strong><br>`;
  html += `- PC: ${pc2 ? pc2.toFixed(1) + ' cm' : '--'} (${fmtVel(velPC, 'pc')})<br>`;
  html += `- Peso: ${peso2 ? peso2.toFixed(2) + ' kg' : '--'} (${fmtVel(velPeso, 'peso')})<br>`;
  html += `- Estatura: ${est2 ? est2.toFixed(1) + ' cm' : '--'} (${fmtVel(velEst, 'estatura')})<br><br>`;

  html += `<strong>Bloco 2</strong><br>`;
  html += `Referencia para idade<br>`;
  html += `- PC: ${fmtZ(zPC)}<br>`;
  html += `- Peso: ${fmtZ(zPeso)}<br>`;
  html += `- Estatura: ${fmtZ(zEst)}<br><br>`;

  html += `<strong>Alvo parental: resultado seguir a seguinte estrutura abaixo</strong><br>`;
  if (alvo > 0) {
    html += `- Alvo parental: ${alvo.toFixed(1)} cm<br>`;
    html += `- Faixa: ${(alvo - 5).toFixed(1)} a ${(alvo + 5).toFixed(1)} cm<br>`;
  } else {
    html += `- Alvo parental: Dados dos pais incompletos<br>`;
    html += `- Faixa: --<br>`;
  }
  html += `- Idade ossea: ${strIO}<br>`;
  html += `- Idade Cronologica: ${strIC}<br>`;
  html += `- Desvio padrao calculado: ${fmtZ(zAlvo)}<br>`;

  // Renderizar a caixa de resultados na tela
  const resBox = document.getElementById('res-cresc');
  resBox.style.display = 'block';
  resBox.innerHTML = html;
}
