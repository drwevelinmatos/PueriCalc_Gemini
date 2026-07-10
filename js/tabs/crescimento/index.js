// tabs/crescimento/index.js

let WHO_DATA = null;
let erroDados = null;

try {
  const modulo = await import('./who_data.js');
  WHO_DATA = modulo.WHO_DATA;
} catch (e) {
  erroDados = e.message;
  console.warn("Aviso: Não foi possível carregar o arquivo who_data.js", e);
}

// === REFERÊNCIAS CLÍNICAS DE VELOCIDADE ===
export const REF_CRESCIMENTO = {
  peso_g_dia: [
    { minM: 0, maxM: 3, ref: '20–30 g/dia' },
    { minM: 4, maxM: 6, ref: '20 g/dia' },
    { minM: 7, maxM: 9, ref: '15 g/dia' },
    { minM: 10, maxM: 12, ref: '10 g/dia' }
  ],
  pc_cm_mes: [
    { minM: 0, maxM: 3, ref: '≈ 2 cm/mês' },
    { minM: 4, maxM: 6, ref: '≈ 1 cm/mês' },
    { minM: 7, maxM: 12, ref: '≈ 0,5 cm/mês' }
  ],
  alt_cm_ano: [
    { minM: 0, maxM: 12, ref: '≈ 25 cm/ano' },
    { minM: 12, maxM: 24, ref: '≈ 12 cm/ano' },
    { minM: 24, maxM: 48, ref: '≈ 7–8 cm/ano' }
  ]
};

export function renderCrescimento() {
  const container = document.getElementById('tab-cresc');
  if (!container) return;

  const avisoErro = erroDados ? `
    <div style="background: #fff5f5; border: 1px solid #d32f2f; color: #d32f2f; padding: 12px; border-radius: 8px; margin-bottom: 15px; font-size: 0.85rem; text-align: left;">
      <strong>⚠️ Atenção:</strong> O arquivo <code>who_data.js</code> não foi detectado.<br>
      <small>Erro: ${erroDados}</small>
    </div>
  ` : '';

  container.innerHTML = `
    ${avisoErro}
    <div class="card">
      <div class="card-header">
        <h2>Dados do Paciente e Medidas</h2>
      </div>
      
      <div class="grid-2" style="margin-bottom: 14px;">
        <div>
          <label>Sexo do Paciente</label>
          <select id="cresc-sexo" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ccc;">
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>
        </div>
        <div>
          <label>Data de Nascimento</label>
          <input type="date" id="cresc-nasc">
        </div>
      </div>

      <div class="grid-2" style="margin-bottom: 14px; padding-top: 10px; border-top: 1px solid #eee;">
        <div>
          <label>Data Inicial (Consulta Anterior)</label>
          <input type="date" id="cresc-data1">
        </div>
        <div>
          <label>Data Final (Consulta Atual)</label>
          <input type="date" id="cresc-data2">
        </div>
      </div>

      <div class="grid-2" style="margin-top: 14px; padding-top: 10px; border-top: 1px solid #eee;">
        <div style="border-right: 1px dashed #ccc; padding-right: 10px;">
          <h3 style="font-size: 0.9rem; color: var(--primary);">Medidas Anteriores</h3>
          <label>PC Anterior (cm)</label>
          <input type="number" step="0.1" id="cresc-pc1" placeholder="Ex: 35.0">
          
          <label>Unidade de Peso Anterior</label>
          <select id="cresc-unidade-peso1" style="margin-bottom: 8px; width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ccc;">
            <option value="kg">Quilogramas (kg)</option>
            <option value="g" selected>Gramas (g)</option>
          </select>
          <label>Peso Anterior</label>
          <input type="number" step="0.01" id="cresc-peso1" placeholder="Ex: 3200">
          
          <label>Estatura Anterior (cm)</label>
          <input type="number" step="0.1" id="cresc-est1" placeholder="Ex: 50.0">
        </div>
        
        <div style="padding-left: 10px;">
          <h3 style="font-size: 0.9rem; color: var(--primary);">Medidas Atuais</h3>
          <label>PC Atual (cm)</label>
          <input type="number" step="0.1" id="cresc-pc2" placeholder="Ex: 42.0">
          
          <label>Unidade de Peso Atual</label>
          <select id="cresc-unidade-peso2" style="margin-bottom: 8px; width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ccc;">
            <option value="kg">Quilogramas (kg)</option>
            <option value="g" selected>Gramas (g)</option>
          </select>
          <label>Peso Atual</label>
          <input type="number" step="0.01" id="cresc-peso2" placeholder="Ex: 8240">
          
          <label>Estatura Atual (cm)</label>
          <input type="number" step="0.1" id="cresc-est2" placeholder="Ex: 65.0">
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h2>Alvo Parental e Idade Óssea</h2>
      </div>
      
      <div class="grid-2">
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

  document.getElementById('cresc-data2').valueAsDate = new Date();
  document.getElementById('btn-calc-cresc').addEventListener('click', calcularCrescimento);
}

function parseHTMLDate(str) {
  if (!str) return null;
  const partes = str.split('-');
  return new Date(parseInt(partes[0]), parseInt(partes[1]) - 1, parseInt(partes[2]));
}

function obterDadosProximosPrefixo(tabelaParametro, idadeAlvo, prefixo) {
  if (!tabelaParametro) return null;
  const chavesFiltradas = Object.keys(tabelaParametro)
    .filter(k => k.startsWith(prefixo))
    .map(k => Number(k.replace(prefixo, '')))
    .sort((a, b) => a - b);
    
  if (chavesFiltradas.length === 0) return null;
  
  let chaveMaisProxima = chavesFiltradas[0];
  let menorDiff = Math.abs(chaveMaisProxima - idadeAlvo);
  
  for (let i = 1; i < chavesFiltradas.length; i++) {
    let diff = Math.abs(chavesFiltradas[i] - idadeAlvo);
    if (diff < menorDiff) {
      menorDiff = diff;
      chaveMaisProxima = chavesFiltradas[i];
    }
  }
  return tabelaParametro[prefixo + chaveMaisProxima];
}

function calcularZScoreOMS(medida, l, m, s) {
  if (!medida || l === undefined || m === undefined || s === undefined) return null;
  if (l === 0) return Math.log(medida / m) / s;
  return (Math.pow(medida / m, l) - 1) / (l * s);
}

function obterRefVelocidade(tipo, idadeMeses) {
  if (idadeMeses === null || isNaN(idadeMeses)) return "S/ Ref.";
  const faixas = REF_CRESCIMENTO[tipo];
  if (!faixas) return "";
  
  const faixaEncontrada = faixas.find(f => idadeMeses >= f.minM && idadeMeses <= f.maxM);
  return faixaEncontrada ? faixaEncontrada.ref : "Fora da faixa";
}

function calcularCrescimento() {
  const d1 = parseHTMLDate(document.getElementById('cresc-data1').value);
  const d2 = parseHTMLDate(document.getElementById('cresc-data2').value);
  const nasc = parseHTMLDate(document.getElementById('cresc-nasc').value);
  
  const pc1 = parseFloat(document.getElementById('cresc-pc1').value) || 0;
  const pc2 = parseFloat(document.getElementById('cresc-pc2').value) || 0;
  const est1 = parseFloat(document.getElementById('cresc-est1').value) || 0;
  const est2 = parseFloat(document.getElementById('cresc-est2').value) || 0;

  let peso1Raw = parseFloat(document.getElementById('cresc-peso1').value) || 0;
  let peso2Raw = parseFloat(document.getElementById('cresc-peso2').value) || 0;
  const unidPeso1 = document.getElementById('cresc-unidade-peso1').value;
  const unidPeso2 = document.getElementById('cresc-unidade-peso2').value;

  const peso1Kg = unidPeso1 === 'g' ? peso1Raw / 1000 : peso1Raw;
  const peso2Kg = unidPeso2 === 'g' ? peso2Raw / 1000 : peso2Raw;
  const peso1G = unidPeso1 === 'kg' ? peso1Raw * 1000 : peso1Raw;
  const peso2G = unidPeso2 === 'kg' ? peso2Raw * 1000 : peso2Raw;

  // Os dados de sexo e nascimento agora vêm do Bloco Superior, mas para o código não muda nada
  const sexo = document.getElementById('cresc-sexo').value;
  const mae = parseFloat(document.getElementById('cresc-mae').value) || 0;
  const pai = parseFloat(document.getElementById('cresc-pai').value) || 0;
  
  const ioAnos = parseInt(document.getElementById('cresc-io-anos').value) || 0;
  const ioMeses = parseInt(document.getElementById('cresc-io-meses').value) || 0;
  const icRxAnos = parseInt(document.getElementById('cresc-ic-rx-anos').value) || 0;
  const icRxMeses = parseInt(document.getElementById('cresc-ic-rx-meses').value) || 0;

  let diffDias = 0;
  if (d1 && d2 && d2 > d1) {
    diffDias = (d2 - d1) / (1000 * 60 * 60 * 24);
  }

  let idadeTotalDias = null;
  let idadeTotalMeses = null;
  if (nasc && d2 && d2 >= nasc) {
    idadeTotalDias = Math.floor((d2 - nasc) / (1000 * 60 * 60 * 24));
    let mesesTotais = (d2.getFullYear() - nasc.getFullYear()) * 12 + (d2.getMonth() - nasc.getMonth());
    if (d2.getDate() < nasc.getDate()) mesesTotais -= 1;
    idadeTotalMeses = mesesTotais;
  }

  let velPC = null;    
  let velPeso = null;  
  let velEst = null;   

  if (diffDias > 0) {
    if (pc1 > 0 && pc2 > 0) velPC = (pc2 - pc1) / (diffDias / 30.4375);
    if (peso1Kg > 0 && peso2Kg > 0) velPeso = (peso2G - peso1G) / diffDias;
    if (est1 > 0 && est2 > 0) velEst = (est2 - est1) / (diffDias / 365.25);
  }

  const refPC = obterRefVelocidade('pc_cm_mes', idadeTotalMeses);
  const refPeso = obterRefVelocidade('peso_g_dia', idadeTotalMeses);
  const refEst = obterRefVelocidade('alt_cm_ano', idadeTotalMeses);

  let alvo = 0;
  if (mae > 0 && pai > 0) {
    alvo = sexo === 'M' ? (pai + mae + 13) / 2 : (pai + mae - 13) / 2;
  }

  let zPC = null, zPeso = null, zEst = null, zAlvo = null;

  if (nasc && WHO_DATA && WHO_DATA[sexo]) {
    const tabelas = WHO_DATA[sexo];
    const prefixoBusca = idadeTotalMeses < 61 ? 'd' : 'm';
    const idadeBusca = idadeTotalMeses < 61 ? idadeTotalDias : idadeTotalMeses;

    if (pc2 > 0 && tabelas.pc) {
      const ref = obterDadosProximosPrefixo(tabelas.pc, idadeBusca, prefixoBusca);
      if (ref) zPC = calcularZScoreOMS(pc2, ref.l, ref.m, ref.s);
    }
    if (peso2Kg > 0 && tabelas.peso) {
      const ref = obterDadosProximosPrefixo(tabelas.peso, idadeBusca, prefixoBusca);
      if (ref) zPeso = calcularZScoreOMS(peso2Kg, ref.l, ref.m, ref.s);
    }
    if (est2 > 0 && tabelas.estatura) {
      const ref = obterDadosProximosPrefixo(tabelas.estatura, idadeBusca, prefixoBusca);
      if (ref) zEst = calcularZScoreOMS(est2, ref.l, ref.m, ref.s);
    }
    if (alvo > 0 && tabelas.estatura && tabelas.estatura['m228']) {
      const refAlvo = tabelas.estatura['m228']; 
      zAlvo = calcularZScoreOMS(alvo, refAlvo.l, refAlvo.m, refAlvo.s);
    }
  }

  const strIO = ioAnos > 0 || ioMeses > 0 ? `${ioAnos}a ${ioMeses}m` : "Não informada";
  const strIC = icRxAnos > 0 || icRxMeses > 0 ? `${icRxAnos}a ${icRxMeses}m` : "Não informada";

  const fmtZ = (val) => {
    if (!document.getElementById('cresc-nasc').value) return "Requer data de nascimento";
    if (val === null || isNaN(val)) return "Sem dados de referência para esta idade";
    return (val > 0 ? "+" : "") + val.toFixed(2) + " SD";
  };

  const fmtVel = (val, tipo, refEsperada) => {
    if (val === null || isNaN(val)) return "Requer 2 datas e medidas completas";
    let suf = tipo === 'pc' ? ' cm/mês' : (tipo === 'peso' ? ' g/dia' : ' cm/ano');
    let stringVel = (val >= 0 ? "+" : "") + val.toFixed(tipo === 'peso' ? 0 : 1) + suf; 
    
    if (refEsperada !== "S/ Ref." && refEsperada !== "") {
        stringVel += ` <em>(Ref: ${refEsperada})</em>`;
    }
    return stringVel;
  };

  const txtPeso2 = unidPeso2 === 'g' ? peso2Raw.toFixed(0) + ' g' : peso2Raw.toFixed(2) + ' kg';

  let html = `<strong>Bloco 1</strong><br>`;
  html += `- PC: ${pc2 ? pc2.toFixed(1) + ' cm' : '--'} (${fmtVel(velPC, 'pc', refPC)})<br>`;
  html += `- Peso: ${peso2Raw ? txtPeso2 : '--'} (${fmtVel(velPeso, 'peso', refPeso)})<br>`;
  html += `- Estatura: ${est2 ? est2.toFixed(1) + ' cm' : '--'} (${fmtVel(velEst, 'estatura', refEst)})<br><br>`;

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
    html += `- Alvo parental: Dados dos pais incompletos<br>- Faixa: --<br>`;
  }
  html += `- Idade ossea: ${strIO}<br>`;
  html += `- Idade Cronologica: ${strIC}<br>`;
  html += `- Desvio padrao calculado: ${fmtZ(zAlvo)}<br>`;

  const resBox = document.getElementById('res-cresc');
  if (resBox) {
    resBox.style.display = 'block';
    resBox.innerHTML = html;
  }
}
