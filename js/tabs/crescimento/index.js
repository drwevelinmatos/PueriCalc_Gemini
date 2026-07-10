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
        <div></div>
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
          <label>Idade Cronológica</label>
          <div style="display: flex; gap: 5px;">
            <input type="number" id="cresc-ic-anos" placeholder="Anos">
            <input type="number" id="cresc-ic-meses" placeholder="Meses">
          </div>
        </div>
      </div>
    </div>

    <button class="calc-btn" id="btn-calc-cresc">Calcular Crescimento</button>
    <div id="res-cresc" class="result-box"></div>
  `;

  // 1) Preencher Data Atual automaticamente
  document.getElementById('cresc-data2').valueAsDate = new Date();

  // Evento de cálculo
  document.getElementById('btn-calc-cresc').addEventListener('click', calcularCrescimento);
}

function calcularCrescimento() {
  // Coletar Datas
  const d1 = new Date(document.getElementById('cresc-data1').value);
  const d2 = new Date(document.getElementById('cresc-data2').value);
  
  // Coletar Medidas
  const pc1 = parseFloat(document.getElementById('cresc-pc1').value) || 0;
  const pc2 = parseFloat(document.getElementById('cresc-pc2').value) || 0;
  const peso1 = parseFloat(document.getElementById('cresc-peso1').value) || 0;
  const peso2 = parseFloat(document.getElementById('cresc-peso2').value) || 0;
  const est1 = parseFloat(document.getElementById('cresc-est1').value) || 0;
  const est2 = parseFloat(document.getElementById('cresc-est2').value) || 0;

  // Coletar Alvo Parental e Idades
  const sexo = document.getElementById('cresc-sexo').value;
  const mae = parseFloat(document.getElementById('cresc-mae').value) || 0;
  const pai = parseFloat(document.getElementById('cresc-pai').value) || 0;
  
  const ioAnos = parseInt(document.getElementById('cresc-io-anos').value) || 0;
  const ioMeses = parseInt(document.getElementById('cresc-io-meses').value) || 0;
  const icAnos = parseInt(document.getElementById('cresc-ic-anos').value) || 0;
  const icMeses = parseInt(document.getElementById('cresc-ic-meses').value) || 0;

  // Cálculo de tempo em meses e anos
  let diffMeses = 0;
  let diffAnos = 0;
  if (!isNaN(d1) && !isNaN(d2)) {
    diffMeses = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
    const diasExtra = d2.getDate() - d1.getDate();
    if (diasExtra < 0) diffMeses -= 1; // Ajuste fino de dias
    diffAnos = diffMeses / 12;
  }

  // Cálculo de Velocidades (por ano)
  let velPC = 0, velPeso = 0, velEst = 0;
  if (diffAnos > 0) {
    velPC = (pc2 - pc1) / diffAnos;
    velPeso = (peso2 - peso1) / diffAnos;
    velEst = (est2 - est1) / diffAnos;
  }

  // Cálculo Alvo Parental (Tanner)
  let alvo = 0;
  if (mae > 0 && pai > 0) {
    alvo = sexo === 'M' ? (pai + mae + 13) / 2 : (pai + mae - 13) / 2;
  }

  // Formatação Idades
  const strIO = ioAnos > 0 || ioMeses > 0 ? \`\${ioAnos}a \${ioMeses}m\` : "Não informada";
  const strIC = icAnos > 0 || icMeses > 0 ? \`\${icAnos}a \${icMeses}m\` : "Não informada";

  // Construção do Resultado Final (Formatado exatamente como solicitado)
  let html = \`<strong>BLOCO 1 - Medidas e Velocidade</strong><br>\`;
  html += \`- PC: \${pc2 ? pc2.toFixed(1) + ' cm' : '--'} (\${velPC ? velPC.toFixed(1) + ' cm/ano' : '--'})<br>\`;
  html += \`- Peso: \${peso2 ? peso2.toFixed(2) + ' kg' : '--'} (\${velPeso ? velPeso.toFixed(2) + ' kg/ano' : '--'})<br>\`;
  html += \`- Estatura: \${est2 ? est2.toFixed(1) + ' cm' : '--'} (\${velEst ? velEst.toFixed(1) + ' cm/ano' : '--'})<br><br>\`;

  html += \`<strong>BLOCO 2 - Referência para a Idade</strong><br>\`;
  html += \`- PC: [Aguardando tabela de referência]<br>\`;
  html += \`- Peso: [Aguardando tabela de referência]<br>\`;
  html += \`- Estatura: [Aguardando tabela de referência]<br><br>\`;

  html += \`<strong>ALVO PARENTAL E DESENVOLVIMENTO ÓSSEO</strong><br>\`;
  if (alvo > 0) {
    html += \`- Alvo parental: \${alvo.toFixed(1)} cm<br>\`;
    html += \`- Faixa: \${(alvo - 5).toFixed(1)} a \${(alvo + 5).toFixed(1)} cm<br>\`;
  } else {
    html += \`- Alvo parental: Dados dos pais incompletos<br>\`;
  }
  html += \`- Idade óssea: \${strIO}<br>\`;
  html += \`- Idade Cronológica: \${strIC}<br>\`;
  html += \`- Desvio padrão calculado: [Aguardando integração Z-Score]<br>\`;

  const resBox = document.getElementById('res-cresc');
  resBox.style.display = 'block';
  resBox.innerHTML = html;
}
