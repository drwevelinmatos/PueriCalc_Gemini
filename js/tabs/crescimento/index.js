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

export function renderCrescimento() {
  const container = document.getElementById('tab-cresc');
  if (!container) return;

  const avisoErro = erroDados ? `
    <div style="background: #fff5f5; border: 1px solid #d32f2f; color: #d32f2f; padding: 12px; border-radius: 8px; margin-bottom: 15px; font-size: 0.85rem; text-align: left;">
      <strong>⚠️ Atenção Clínico-Tecnológica:</strong> O arquivo <code>who_data.js</code> não foi detectado ou contém erros de sintaxe.<br>
      <small>Erro: ${erroDados}</small>
    </div>
  ` : '';

  container.innerHTML = `
    ${avisoErro}
    <div class="card">
      <div class="card-header">
        <h2>Velocidade de Crescimento</h2>
      </div>
      
      <div class="grid-2">
        <div>
          <label>Data Inicial (Consulta Anterior)</label>
          <input type="date" id="cresc-data1">
        </div>
        <div>
          <label>Data Final (Consulta Atual)</label>
          <input type="date" id="cresc-data2">
        </div>
      </div>

      <div class="grid-2" style="margin-top: 14px;">
        <div style="border-right: 1px dashed #ccc; padding-right: 10px;">
          <h3 style="font-size: 0.9rem; color: var(--primary);">Medidas Anteriores</h3>
          <label>PC (cm)</label>
          <input type="number" step="0.1" id="cresc-pc1" placeholder="Ex: 35.0">
          
          <label>Unidade de Peso Anterior</label>
          <select id="cresc-unidade-peso1" style="margin-bottom: 8px; width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ccc;">
            <option value="kg" selected>Quilogramas (kg)</option>
            <option value="g">Gramas (g)</option>
          </select>
          <label>Peso Anterior</label>
          <input type="number" step="0.01" id="cresc-peso1" placeholder="Ex: 3.2 ou 3200">
          
          <label>Estatura Anterior (cm)</label>
          <input type="number" step="0.1" id="cresc-est1" placeholder="Ex: 50.0">
        </div>
        
        <div style="padding-left: 10px;">
          <h3 style="font-size: 0.9rem; color: var(--primary);">Medidas Atuais</h3>
          <label>PC (cm)</label>
          <input type="number" step="0.1" id="cresc-pc2" placeholder="Ex: 42.0">
          
          <label>Unidade de Peso Atual</label>
          <select id="cresc-unidade-peso2" style="margin-bottom: 8px; width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ccc;">
            <option value="kg" selected>Quilogramas (kg)</option>
            <option value="g">Gramas (g)</option>
          </select>
          <label>Peso Atual</label>
          <input type="number" step="0.01" id="cresc-peso2" placeholder="Ex: 6.5 ou 6500">
          
          <label>Estatura Atual (cm)</label>
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
          <label>Data de Nasc. (Obrigatório para Bloco 2)</label>
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

  document.getElementById('cresc-data2').valueAsDate = new Date();
  document.getElementById('btn-calc-cresc').addEventListener('click', calcularCrescimento);
}

// Resolve problemas de fuso horário na leitura de strings de data HTML
defaut function parseHTMLDate(str) {
  if (!str) return null;
  const partes = str.split('-');
  if (partes.length !== 3) return null;
  return new Date(parseInt(partes[0]), parseInt(partes[1]) - 1, parseInt(partes[2]));
}

// Busca tolerante: encontra a chave numérica mais próxima no objeto de dados
function obterDadosProximos(tabelaParametro, idadeAlvo) {
  if (!tabelaParametro) return null;
  const chaves = Object.keys(tabelaParametro).map(Number).sort((a, b) => a - b);
  if (chaves.length === 0) return null;
  
  // Encontra a chave com a menor diferença absoluta
  let chaveMaisProxima = chaves[0];
  let menorDiff = Math.abs(chaveMaisProxima - idadeAlvo);
  
  for (let i = 1; i < chaves.length; i++) {
    let diff = Math.abs(chaves[i] - idadeAlvo);
    if (diff < menorDiff) {
      menorDiff = diff;
      chaveMaisProxima = chaves[i];
    }
  }
  // Se a distância for absurdamente grande (ex: mais de 30 dias/meses de desvio), rejeita por segurança
  if (menorDiff > 45) return null; 
  
  return tabelaParametro[chaveMaisProxima];
}

function calcularZScoreOMS(medida, l, m, s) {
  if (!medida || l === undefined || m === undefined || s === undefined) return null;
  if (l === 0) return Math.log(medida / m) / s;
  return (Math.pow(medida / m, l) - 1) / (l * s);
}

function calcularCrescimento() {
  // Tratamento seguro de datas
  const d1 = parseHTMLDate(document.getElementById('cresc-data1').value);
  const d2 = parseHTMLDate(document.getElementById('cresc-data2').value);
  const nasc = parseHTMLDate(document.getElementById('cresc-nasc').value);
  
  // Captura de Medidas
  const pc1 = parseFloat(document.getElementById('cresc-pc1').value) || 0;
  const pc2 = parseFloat(document.getElementById('cresc-pc2').value) || 0;
  const est1 = parseFloat(document.getElementById('cresc-est1').value) || 0;
  const est2 = parseFloat(document.getElementById('cresc-est2').value) || 0;

  // Captura de Pesos e Normalização Automática para KG
  let peso1 = parseFloat(document.getElementById('cresc-peso1').value) || 0;
  let peso2 = parseFloat(document.getElementById('cresc-peso2').value) || 0;
  const unidPeso1 = document.getElementById('cresc-unidade-peso1').value;
  const unidPeso2 = document.getElementById('cresc-unidade-peso2').value;

  if (unidPeso1 === 'g' && peso1 > 0) peso1 = peso1 / 1000;
  if (unidPeso2 === 'g' && peso2 > 0) peso2 = peso2 / 1000;

  const sexo = document.getElementById('cresc-sexo').value;
  const mae = parseFloat(document.getElementById('cresc-mae').value) || 0;
  const pai = parseFloat(document.getElementById('cresc-pai').value) || 0;
  
  const ioAnos = parseInt(document.getElementById('cresc-io-anos').value) || 0;
  const ioMeses = parseInt(document.getElementById('cresc-io-meses').value) || 0;
  const icRxAnos = parseInt(document.getElementById('cresc-ic-rx-anos').value) || 0;
  const icRxMeses = parseInt(document.getElementById('cresc-ic-rx-meses').value) || 0;

  // Cálculo preciso de diferença de tempo em anos para velocidade
  let diffAnosVelocidade = 0;
  if (d1 && d2 && d2 > d1) {
    const diffTime = d2 - d1;
    diffAnosVelocidade = diffTime / (1000 * 60 * 60 * 24 * 365.25);
  }

  // Idades Cronológicas exatas para busca na OMS (Dias e Meses de vida hoje)
  let idadeTotalDias = 0;
  let idadeTotalMeses = 0;
  if (nasc && d2 && d2 >= nasc) {
    const diffTime = d2 - nasc;
    idadeTotalDias = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    let mesesTotais = (d2.getFullYear() - nasc.getFullYear()) * 12 + (d2.getMonth() - nasc.getMonth());
    if (d2.getDate() < nasc.getDate()) mesesTotais -= 1;
    idadeTotalMeses = mesesTotais;
  }

  // Cálculos de Velocidade de Crescimento (Bloco 1)
  let velPC = (diffAnosVelocidade > 0 && pc1 > 0 && pc2 > 0) ? (pc2 - pc1) / diffAnosVelocidade : null;
  let velPeso = (diffAnosVelocidade > 0 && peso1 > 0 && peso2 > 0) ? (peso2 - peso1) / diffAnosVelocidade : null;
  let velEst = (diffAnosVelocidade > 0 && est1 > 0 && est2 > 0) ? (est2 - est1) / diffAnosVelocidade : null;

  // Cálculo Alvo Parental (Tanner)
  let alvo = 0;
  if (mae > 0 && pai > 0) {
    alvo = sexo === 'M' ? (pai + mae + 13) / 2 : (pai + mae - 13) / 2;
  }

  // === PROCESSAMENTO DOS Z-SCORES REAIS (OMS) ===
  let zPC = null, zPeso = null, zEst = null, zAlvo = null;

  if (nasc && WHO_DATA && WHO_DATA[sexo]) {
    const tabelas = WHO_DATA[sexo];
    
    // Regra da OMS: Menos de 5 anos (61 meses) busca por DIAS. Acima disso, busca por MESES.
    const chaveBusca = idadeTotalMeses < 61 ? idadeTotalDias : idadeTotalMeses;

    if (pc2 > 0 && tabelas.pc) {
      const ref = obterDadosProximos(tabelas.pc, chaveBusca);
      if (ref) zPC = calcularZScoreOMS(pc2, ref.l, ref.m, ref.s);
    }
    if (peso2 > 0 && tabelas.peso) {
      // Como as planilhas de peso "wfa" da OMS geralmente vão até 60 ou 120 meses, garantimos a busca em meses caso passe de 5 anos
      const refChavePeso = idadeTotalMeses < 61 ? idadeTotalDias : idadeTotalMeses;
      const ref = obterDadosProximos(tabelas.peso, refChavePeso);
      if (ref) zPeso = calcularZScoreOMS(peso2, ref.l, ref.m, ref.s);
    }
    if (est2 > 0 && tabelas.estatura) {
      const ref = obterDadosProximos(tabelas.estatura, chaveBusca);
      if (ref) zEst = calcularZScoreOMS(est2, ref.l, ref.m, ref.s);
    }

    // Alvo parental comparado com estatura final de 19 anos (228 meses)
    if (alvo > 0 && tabelas.estatura && tabelas.estatura[228]) {
      const refAlvo = tabelas.estatura[228];
      zAlvo = calcularZScoreOMS(alvo, refAlvo.l, refAlvo.m, refAlvo.s);
    }
  }

  // Formatação das Strings de Saída
  const strIO = ioAnos > 0 || ioMeses > 0 ? `${ioAnos}a ${ioMeses}m` : "Não informada";
  const strIC = icRxAnos > 0 || icRxMeses > 0 ? `${icRxAnos}a ${icRxMeses}m` : "Não informada";

  const fmtZ = (val) => {
    if (!document.getElementById('cresc-nasc').value) return "Requer data de nascimento";
    if (val === null || isNaN(val)) return "Dados de referência não encontrados no arquivo";
    return (val > 0 ? "+" : "") + val.toFixed(2) + " SD";
  };

  const fmtVel = (val, tipo) => {
    if (val === null || isNaN(val)) return "Requer 2 datas e medidas completas";
    const sulfixo = tipo === 'peso' ? " kg/ano" : " cm/ano";
    return (val >= 0 ? "+" : "") + val.toFixed(tipo === 'peso' ? 2 : 1) + sulfixo;
  };

  // Exibição do Peso Atual na unidade visualmente mais limpa
  const pesoExibicao = document.getElementById('cresc-unidade-peso2').value === 'g' 
    ? (peso2 * 1000).toFixed(0) + ' g' 
    : peso2.toFixed(2) + ' kg';

  // === RENDERIZAÇÃO DA ESTRUTURA CLÍNICA SOLICITADA ===
  let html = `<strong>Bloco 1</strong><br>`;
  html += `- PC: ${pc2 ? pc2.toFixed(1) + ' cm' : '--'} (${fmtVel(velPC, 'pc')})<br>`;
  html += `- Peso: ${peso2 ? pesoExibicao : '--'} (${fmtVel(velPeso, 'peso')})<br>`;
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

  const resBox = document.getElementById('res-cresc');
  if (resBox) {
    resBox.style.display = 'block';
    resBox.innerHTML = html;
  }
}
