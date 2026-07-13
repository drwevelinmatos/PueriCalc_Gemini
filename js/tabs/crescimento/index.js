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
      <strong>⚠️ Atenção:</strong> O ficheiro <code>who_data.js</code> não foi detetado.<br>
      <small>Erro: ${erroDados}</small>
    </div>
  ` : '';

  container.innerHTML = `
    ${avisoErro}
    
    <div class="card" style="border-left: 5px solid var(--primary); margin-bottom: 15px;">
      <div class="card-header" style="border: none; padding-left: 0;">
        <h2 style="color: var(--primary); margin-top: 0; font-size: 1.15rem;">1. Dados do Paciente e Medidas</h2>
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
          
          <label style="margin-top: 8px; color: #7f8c8d;">IMC Anterior (kg/m²)</label>
          <input type="text" id="cresc-imc1" readonly style="background: #eef2f5; border: 1px dashed #ccc; cursor: not-allowed;" placeholder="Automático">
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

          <label style="margin-top: 8px; color: var(--primary);">IMC Atual (kg/m²)</label>
          <input type="text" id="cresc-imc2" readonly style="background: rgba(40,90,129,0.05); border: 1px dashed var(--primary); font-weight: bold; cursor: not-allowed;" placeholder="Automático">
        </div>
      </div>
    </div>

    <div class="card" style="border-left: 5px solid #8e44ad; background: #faf5fc; margin-bottom: 15px;">
      <div class="card-header" style="border: none; padding-left: 0; margin-bottom: 5px;">
        <h2 style="color: #8e44ad; margin-top: 0; font-size: 1.15rem;">👶 2. Avaliação de Prematuros (Intergrowth / Fenton)</h2>
        <p style="font-size: 0.85rem; color: #5f7382; margin-top: 4px;">Preencha a Idade Gestacional ao nascer para ativar o cálculo de <strong>Idade Corrigida</strong> e habilitar as curvas neonatais específicas de UTIN.</p>
      </div>
      <div class="grid-2">
        <div>
          <label style="color: #8e44ad; font-weight: bold;">IG ao Nascer (Semanas) <span style="font-weight:normal; color:#7f8c8d;">(Opcional)</span></label>
          <input type="number" id="cresc-ig-sem" placeholder="Ex: 34" min="20" max="44" style="border-color: #d2b4de;">
        </div>
        <div>
          <label style="color: #8e44ad; font-weight: bold;">IG ao Nascer (Dias) <span style="font-weight:normal; color:#7f8c8d;">(Opcional)</span></label>
          <input type="number" id="cresc-ig-dias" placeholder="Ex: 2" min="0" max="6" style="border-color: #d2b4de;">
        </div>
      </div>
    </div>

    <div class="card" style="border-left: 5px solid #f39c12;">
      <div class="card-header" style="border: none; padding-left: 0;">
        <h2 style="color: #d35400; margin-top: 0; font-size: 1.15rem;">3. Alvo Parental e Idade Óssea</h2>
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
          <label>Idade Óssea (Raio-X)</label>
          <div style="display: flex; gap: 5px;">
            <input type="number" id="cresc-io-anos" placeholder="Anos">
            <input type="number" id="cresc-io-meses" placeholder="Meses">
          </div>
        </div>
        <div>
          <label>Idade Cronológica (Na data do RX)</label>
          <div style="display: flex; gap: 5px;">
            <input type="number" id="cresc-ic-rx-anos" placeholder="Anos">
            <input type="number" id="cresc-ic-rx-meses" placeholder="Meses">
          </div>
        </div>
      </div>
    </div>

    <button class="calc-btn" id="btn-calc-cresc">Calcular Crescimento Completo</button>
    <div id="res-cresc" class="result-box"></div>
  `;

  // Corrige a data local atual
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');
  document.getElementById('cresc-data2').value = `${ano}-${mes}-${dia}`;

  document.getElementById('btn-calc-cresc').addEventListener('click', calcularCrescimento);

  // Lógica de IMC Automático
  const p1 = document.getElementById('cresc-peso1');
  const e1 = document.getElementById('cresc-est1');
  const u1 = document.getElementById('cresc-unidade-peso1');
  const i1 = document.getElementById('cresc-imc1');

  const p2 = document.getElementById('cresc-peso2');
  const e2 = document.getElementById('cresc-est2');
  const u2 = document.getElementById('cresc-unidade-peso2');
  const i2 = document.getElementById('cresc-imc2');

  const calcIMC = (pNode, eNode, uNode, iNode) => {
    let p = parseFloat(pNode.value);
    let e = parseFloat(eNode.value);
    if (p > 0 && e > 0) {
      if (uNode.value === 'g') p = p / 1000;
      const imc = p / Math.pow(e / 100, 2);
      iNode.value = imc.toFixed(1);
    } else {
      iNode.value = '';
    }
  };

  [p1, e1, u1].forEach(el => el.addEventListener('input', () => calcIMC(p1, e1, u1, i1)));
  [p2, e2, u2].forEach(el => el.addEventListener('input', () => calcIMC(p2, e2, u2, i2)));
}

// === FUNÇÕES DE APOIO MATEMÁTICO ===
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

  const limiteTolerancia = prefixo === 'd' ? 45 : 2;
  if (menorDiff > limiteTolerancia) return null;

  return tabelaParametro[prefixo + chaveMaisProxima];
}

function calcularZScoreOMS(medida, l, m, s) {
  if (!medida || l === undefined || m === undefined || s === undefined) return null;
  if (l === 0) return Math.log(medida / m) / s;
  return (Math.pow(medida / m, l) - 1) / (l * s);
}

function zParaPercentil(z) {
  if (z === null || isNaN(z)) return null;
  let sign = (z < 0) ? -1 : 1;
  let x = Math.abs(z) / Math.sqrt(2);
  let t = 1.0 / (1.0 + 0.3275911 * x);
  let a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429;
  let erf = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  let percentil = 0.5 * (1.0 + sign * erf) * 100;
  
  if (percentil < 0.1) return 0.1;
  if (percentil > 99.9) return 99.9;
  return percentil;
}

function obterRefVelocidade(tipo, idadeMeses) {
  if (idadeMeses === null || isNaN(idadeMeses)) return "S/ Ref.";
  const faixas = REF_CRESCIMENTO[tipo];
  if (!faixas) return "";
  const faixaEncontrada = faixas.find(f => idadeMeses >= f.minM && idadeMeses <= f.maxM);
  return faixaEncontrada ? faixaEncontrada.ref : "Fora da faixa";
}

function classificarPC(z) {
  if (z === null) return "";
  if (z < -2) return "Microcefalia";
  if (z > 2) return "Macrocefalia";
  return "Normocefalia";
}

function classificarPeso(z, idadeMeses) {
  if (z === null) {
    if (idadeMeses !== null && idadeMeses > 120) return "Avaliado por IMC (>10 anos)";
    return "";
  }
  if (z < -3) return "Muito baixo peso";
  if (z < -2) return "Baixo peso";
  if (z > 2) return "Peso elevado";
  return "Peso adequado";
}

function classificarEstatura(z) {
  if (z === null) return "";
  if (z < -3) return "Muito baixa estatura";
  if (z < -2) return "Baixa estatura";
  if (z > 2) return "Alta estatura"; 
  return "Estatura adequada";
}

function classificarIMC(z, idadeMeses) {
  if (z === null) return "";
  if (idadeMeses <= 60) {
    if (z < -3) return "Magreza acentuada";
    if (z < -2) return "Magreza";
    if (z <= 1) return "Eutrofia";
    if (z <= 2) return "Risco de sobrepeso";
    if (z <= 3) return "Sobrepeso";
    return "Obesidade";
  } else {
    if (z < -3) return "Magreza acentuada";
    if (z < -2) return "Magreza";
    if (z <= 1) return "Eutrofia";
    if (z <= 2) return "Sobrepeso";
    if (z <= 3) return "Obesidade";
    return "Obesidade grave";
  }
}

// === FUNÇÃO PRINCIPAL DE CÁLCULO ===
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

  const sexo = document.getElementById('cresc-sexo').value;
  const mae = parseFloat(document.getElementById('cresc-mae').value) || 0;
  const pai = parseFloat(document.getElementById('cresc-pai').value) || 0;
  
  const ioAnos = parseInt(document.getElementById('cresc-io-anos').value) || 0;
  const ioMeses = parseInt(document.getElementById('cresc-io-meses').value) || 0;
  const icRxAnos = parseInt(document.getElementById('cresc-ic-rx-anos').value) || 0;
  const icRxMeses = parseInt(document.getElementById('cresc-ic-rx-meses').value) || 0;

  // DADOS DE PREMATURIDADE
  const igSem = parseInt(document.getElementById('cresc-ig-sem').value);
  const igDias = parseInt(document.getElementById('cresc-ig-dias').value) || 0;

  let diffDias = 0;
  if (d1 && d2 && d2 > d1) diffDias = (d2 - d1) / (1000 * 60 * 60 * 24);

  let idadeTotalDias = null, idadeTotalMeses = null;
  if (nasc && d2 && d2 >= nasc) {
    idadeTotalDias = Math.floor((d2 - nasc) / (1000 * 60 * 60 * 24));
    let mesesTotais = (d2.getFullYear() - nasc.getFullYear()) * 12 + (d2.getMonth() - nasc.getMonth());
    if (d2.getDate() < nasc.getDate()) mesesTotais -= 1;
    idadeTotalMeses = mesesTotais;
  }

  // === CÉREBRO: LÓGICA DE IDADE CORRIGIDA ===
  let isPrematuro = false;
  let diasCorrecao = 0;
  let idadeDiasPesoPC = idadeTotalDias;
  let idadeDiasEstIMC = idadeTotalDias;
  let idadePosMenstrualSemanas = null;

  if (!isNaN(igSem) && igSem < 37 && idadeTotalDias !== null) {
      isPrematuro = true;
      diasCorrecao = (40 * 7) - (igSem * 7 + igDias);
      
      // Idade Pós-Menstrual (Para uso do Intergrowth/Fenton futuramente)
      idadePosMenstrualSemanas = igSem + (igDias / 7) + (idadeTotalDias / 7);

      // Correção para Curva OMS
      if (idadeTotalDias <= 24 * 30.4375) idadeDiasPesoPC = Math.max(0, idadeTotalDias - diasCorrecao);
      if (idadeTotalDias <= 40 * 30.4375) idadeDiasEstIMC = Math.max(0, idadeTotalDias - diasCorrecao);
  }

  // === CÉREBRO: VELOCIDADES ===
  let velPC = null, velPeso = null, velEst = null;   
  if (diffDias > 0) {
    if (pc1 > 0 && pc2 > 0) velPC = (pc2 - pc1) / (diffDias / 30.4375);
    if (peso1Kg > 0 && peso2Kg > 0) velPeso = (peso2G - peso1G) / diffDias;
    if (est1 > 0 && est2 > 0) velEst = (est2 - est1) / (diffDias / 365.25);
  }

  const refPC = obterRefVelocidade('pc_cm_mes', idadeDiasPesoPC !== null ? Math.floor(idadeDiasPesoPC / 30.4375) : null);
  const refPeso = obterRefVelocidade('peso_g_dia', idadeDiasPesoPC !== null ? Math.floor(idadeDiasPesoPC / 30.4375) : null);
  const refEst = obterRefVelocidade('alt_cm_ano', idadeDiasEstIMC !== null ? Math.floor(idadeDiasEstIMC / 30.4375) : null);

  let alvo = (mae > 0 && pai > 0) ? (sexo === 'M' ? (pai + mae + 13) / 2 : (pai + mae - 13) / 2) : 0;
  const imcAtual = (peso2Kg > 0 && est2 > 0) ? (peso2Kg / Math.pow(est2 / 100, 2)) : 0;

  // === CÉREBRO: OMS ===
  let zPC = null, zPeso = null, zEst = null, zAlvo = null, zIMC = null;

  if (nasc && WHO_DATA && WHO_DATA[sexo]) {
    const tabelas = WHO_DATA[sexo];

    const buscarReferenciaDaTabela = (parametroTabela, idadeAlvoDias) => {
        if (!parametroTabela || idadeAlvoDias === null) return null;
        const idMeses = Math.floor(idadeAlvoDias / 30.4375);
        let prefixos = idMeses < 61 ? ['d', 'm'] : ['m', 'd'];
        for (let pref of prefixos) {
            let idBusca = pref === 'd' ? Math.round(idadeAlvoDias) : idMeses;
            let ref = obterDadosProximosPrefixo(parametroTabela, idBusca, pref);
            if (ref) return ref;
        }
        return null;
    };

    if (pc2 > 0) {
      const ref = buscarReferenciaDaTabela(tabelas.pc, idadeDiasPesoPC);
      if (ref) zPC = calcularZScoreOMS(pc2, ref.l, ref.m, ref.s);
    }
    
    if (peso2Kg > 0 && (idadeDiasPesoPC / 30.4375) <= 120) {
      const ref = buscarReferenciaDaTabela(tabelas.peso, idadeDiasPesoPC);
      if (ref) zPeso = calcularZScoreOMS(peso2Kg, ref.l, ref.m, ref.s);
    }
    
    if (est2 > 0) {
      const ref = buscarReferenciaDaTabela(tabelas.estatura, idadeDiasEstIMC);
      if (ref) zEst = calcularZScoreOMS(est2, ref.l, ref.m, ref.s);
    }
    
    if (imcAtual > 0) {
      const ref = buscarReferenciaDaTabela(tabelas.imc, idadeDiasEstIMC);
      if (ref) zIMC = calcularZScoreOMS(imcAtual, ref.l, ref.m, ref.s);
    }
    
    if (alvo > 0 && tabelas.estatura && tabelas.estatura['m228']) {
      const refAlvo = tabelas.estatura['m228']; 
      zAlvo = calcularZScoreOMS(alvo, refAlvo.l, refAlvo.m, refAlvo.s);
    }
  }

  // === EMISSÃO DE RESULTADOS UI ===
  const fmtZ = (val, isRaw = false) => {
    if (!document.getElementById('cresc-nasc').value) return "Requer idade";
    if (val === null || isNaN(val)) return "S/ Ref.";
    if (isRaw) return (val > 0 ? "+" : "") + val.toFixed(2);
    return (val > 0 ? "+" : "") + val.toFixed(2) + " SD";
  };

  const fmtPerc = (z) => {
    if (z === null) return "--";
    const p = zParaPercentil(z);
    if (p === null) return "--";
    let roundP = Math.round(p);
    if (roundP === 100) return "P>99";
    if (roundP === 0) return "P<1";
    return "P" + roundP;
  };

  const fmtVel = (val, tipo, refEsperada) => {
    if (val === null || isNaN(val)) return "Requer 2 medidas";
    let suf = tipo === 'pc' ? ' cm/mês' : (tipo === 'peso' ? ' g/dia' : ' cm/ano');
    let stringVel = (val >= 0 ? "+" : "") + val.toFixed(tipo === 'peso' ? 0 : 1) + suf; 
    if (refEsperada !== "S/ Ref." && refEsperada !== "") stringVel += ` <em style="color:#7f8c8d">(Ref: ${refEsperada})</em>`;
    return stringVel;
  };

  const txtPeso2 = unidPeso2 === 'g' ? peso2Raw.toFixed(0) + ' g' : peso2Raw.toFixed(2) + ' kg';

  let html = ``;

  // Alerta de Janela do Intergrowth / Fenton
  if (isPrematuro && idadePosMenstrualSemanas <= 64) {
      html += `<div style="background: #faf5fc; border-left: 5px solid #8e44ad; color: #8e44ad; padding: 12px; border-radius: 6px; margin-bottom: 15px;">
        <strong style="font-size: 1.05rem;">🧬 Análise Neonatal Específica (Idade Pós-Menstrual: ${idadePosMenstrualSemanas.toFixed(1)} semanas)</strong><br>
        <span style="font-size: 0.9rem; color: #5f7382;">O paciente encontra-se na janela de avaliação ideal do <strong>Intergrowth-21st / Fenton</strong>.</span><br>
        <span style="font-size: 0.85rem; font-weight: bold;">(Módulo em construção: Pronto para receber a nova base de dados.)</span>
      </div>`;
  }

  // Alerta de Idade Corrigida (OMS)
  if (isPrematuro) {
      let mCrono = Math.floor(idadeTotalDias / 30.4375);
      let mCronoD = Math.floor(idadeTotalDias % 30.4375);
      
      let mCorrPeso = Math.floor(idadeDiasPesoPC / 30.4375);
      let mCorrEst = Math.floor(idadeDiasEstIMC / 30.4375);

      html += `<div style="background: #fffdf5; border-left: 5px solid #f39c12; color: #d35400; padding: 12px; border-radius: 6px; margin-bottom: 15px;">
          <strong style="font-size: 1.05rem;">⚠️ Ajuste de Prematuridade Ativo na Curva OMS (${igSem} semanas)</strong><br>
          <span style="color:#7f8c8d; font-size: 0.85rem;">Idade Cronológica: ${mCrono} meses e ${mCronoD} dias</span><br>`;
      
      if (idadeTotalDias <= 24 * 30.4375) {
          html += `<span style="font-size: 0.9rem;">⚖️ Peso e PC analisados para a Idade Corrigida de <strong>${mCorrPeso} meses</strong>.</span><br>`;
      }
      if (idadeTotalDias <= 40 * 30.4375) {
          html += `<span style="font-size: 0.9rem;">📏 Estatura e IMC analisados para a Idade Corrigida de <strong>${mCorrEst} meses</strong>.</span><br>`;
      }
      html += `</div>`;
  }

  html += `<strong>Bloco 1 - Velocidades</strong><br>`;
  html += `- PC: ${pc2 ? pc2.toFixed(1) + ' cm' : '--'} (${fmtVel(velPC, 'pc', refPC)})<br>`;
  html += `- Peso: ${peso2Raw ? txtPeso2 : '--'} (${fmtVel(velPeso, 'peso', refPeso)})<br>`;
  html += `- Estatura: ${est2 ? est2.toFixed(1) + ' cm' : '--'} (${fmtVel(velEst, 'estatura', refEst)})<br><br>`;

  html += `<strong>Bloco 2 - Estado Nutricional (Classificação OMS)</strong><br>`;
  
  if (idadeTotalMeses !== null && idadeTotalMeses <= 24) {
    html += `- PC: ${fmtPerc(zPC)} <span style="color:#666;">(${classificarPC(zPC)})</span><br>`;
  } else {
    html += `- PC: <span style="color:#666;">(Aplicável até aos 2 anos)</span><br>`;
  }
  
  let idadeAnalisePadrao = idadeDiasPesoPC !== null ? Math.floor(idadeDiasPesoPC / 30.4375) : idadeTotalMeses;

  html += `- Peso: ${fmtPerc(zPeso)} <span style="color:#666;">(${classificarPeso(zPeso, idadeAnalisePadrao)})</span><br>`;
  html += `- Estatura: ${fmtPerc(zEst)} <span style="color:#666;">(${classificarEstatura(zEst)})</span><br>`;
  html += `- IMC (${imcAtual > 0 ? imcAtual.toFixed(1) : '--'} kg/m²): Z-Score ${fmtZ(zIMC, true)} <span style="color:var(--primary); font-weight:bold;">[${classificarIMC(zIMC, idadeAnalisePadrao)}]</span><br><br>`;

  html += `<strong>Bloco 3 - Alvo Parental e Desenvolvimento Ósseo</strong><br>`;
  if (alvo > 0) {
    html += `- Alvo parental: ${alvo.toFixed(1)} cm<br>`;
    html += `- Faixa: ${(alvo - 5).toFixed(1)} a ${(alvo + 5).toFixed(1)} cm<br>`;
    html += `- Desvio padrão (Z-Score) do alvo: ${fmtZ(zAlvo)}<br>`;
  } else {
    html += `- Alvo parental: Dados dos pais incompletos<br>- Faixa: --<br>`;
  }
  const strIO = ioAnos > 0 || ioMeses > 0 ? `${ioAnos}a ${ioMeses}m` : "Não informada";
  const strIC = icRxAnos > 0 || icRxMeses > 0 ? `${icRxAnos}a ${icRxMeses}m` : "Não informada";
  html += `- Idade óssea: ${strIO}<br>`;
  html += `- Idade Cronológica (Raio-X): ${strIC}<br>`;

  const resBox = document.getElementById('res-cresc');
  if (resBox) {
    resBox.style.display = 'block';
    resBox.innerHTML = html;
  }
}
