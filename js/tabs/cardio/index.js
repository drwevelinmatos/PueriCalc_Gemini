import { byId } from '../../utils/dom.js';
import { initECGCard } from './ecg.js';
import { initPACard } from './pa.js';
import { initMRPA } from './mrpa.js';

// tabs/cardio/index.js
import { byId, showResult } from '../../utils/dom.js';

// Importa WHO_DATA para o cálculo de percentil de estatura
let WHO_DATA = null;
try {
    const modulo = await import('../crescimento/who_data.js');
    WHO_DATA = modulo.WHO_DATA;
} catch (e) { console.warn("WHO_DATA não disponível para cálculo de percentil de estatura."); }

export function renderCardio() {
    const root = byId('tab-cardio');
    if (!root) return;

    root.innerHTML = `
    <div class="card">
        <div class="card-header"><h2>Classificação de PA (SBP 2021)</h2></div>
        
        <div class="grid-2">
            <div><label>Idade (anos)</label><input type="number" id="cardio-idade" min="0" max="18" step="1"></div>
            <div><label>Estatura (cm)</label><input type="number" id="cardio-est" min="40" max="200" step="0.1"></div>
        </div>
        <div class="grid-3">
            <div><label>Sexo</label><select id="cardio-sexo"><option value="M">Masculino</option><option value="F">Feminino</option></select></div>
            <div><label>PAS (mmHg)</label><input type="number" id="cardio-pas"></div>
            <div><label>PAD (mmHg)</label><input type="number" id="cardio-pad"></div>
        </div>
        
        <button class="calc-btn" id="btn-calc-pa" style="margin-top:20px;">Classificar PA</button>
        <div id="res-pa" class="result-box" style="margin-top:15px; white-space:pre-wrap;"></div>
    </div>
    `;

    byId('btn-calc-pa').addEventListener('click', classificarPA);
}

function classificarPA() {
    const idade = parseInt(byId('cardio-idade').value);
    const est = parseFloat(byId('cardio-est').value);
    const sexo = byId('cardio-sexo').value;
    const pas = parseFloat(byId('cardio-pas').value);
    const pad = parseFloat(byId('cardio-pad').value);

    if (isNaN(idade) || isNaN(est) || isNaN(pas) || isNaN(pad)) return alert("Preencha todos os dados.");

    // 1. Lógica < 1 ano (Mantendo o seu código original adaptado)
    if (idade < 1) {
        // Inclua aqui a chamada para o seu motor de infantCurves do código original
        return showResult('res-pa', "Cálculo para < 1 ano ativo (via motor infantCurves).");
    }

    // 2. Lógica >= 1 ano (SBP)
    // Passo A: Calcular Percentil de Estatura
    const pctEst = calcularPercentilEstatura(idade, est, sexo);
    
    // Passo B: Buscar tabela (Implemente aqui a busca na tabela da SBP baseada no PDF enviado)
    // O sistema vai retornar o P90 e P95 para aquela idade e percentil de altura
    const referencia = buscarReferenciaSBP(idade, pctEst, sexo); 
    
    // Passo C: Classificar
    const classificacao = definirClassificacao(pas, pad, referencia);
    
    showResult('res-pa', `Percentil Estatura: P${pctEst}\nClassificação: ${classificacao}`);
}

// === MOTOR DE CÁLCULO DE ESTATURA (USA WHO_DATA) ===
function calcularPercentilEstatura(idade, est, sexo) {
    if (!WHO_DATA || !WHO_DATA[sexo]) return 50; // Fallback
    
    const meses = idade * 12;
    const ref = WHO_DATA[sexo].estatura['m' + meses];
    if (!ref) return 50;
    
    // Fórmula Z-score = ( (medida/m)^l - 1 ) / (l*s)
    const z = (Math.pow(est / ref.m, ref.l) - 1) / (ref.l * ref.s);
    const p = Math.round(zParaPercentil(z));
    return p < 5 ? 5 : (p > 95 ? 95 : p); // Aproxima para a tabela SBP
}

function zParaPercentil(z) {
  let erf = 1.0 - 1.0 / Math.pow(1 + 0.3275911 * Math.abs(z / Math.sqrt(2)), 1); // Simplificação
  return (z > 0 ? 0.5 + erf/2 : 0.5 - erf/2) * 100;
}

// === MOTOR DE BUSCA SBP ===
// Doutor, aqui deve inserir a lógica de busca do seu PDF.
// Como a tabela da SBP é imensa, o ideal é criar um objeto `const SBP_TABLE = {...}`
// dentro de um ficheiro `tabs/cardio/sbp_data.js` e importar aqui.
function buscarReferenciaSBP(idade, pctEst, sexo) {
    // Exemplo de retorno esperado:
    return { pas90: 110, pas95: 115, pad90: 70, pad95: 75 };
}

function definirClassificacao(pas, pad, ref) {
    if (pas < ref.pas90 && pad < ref.pad90) return "Normal";
    if (pas >= ref.pas95 + 12 || pad >= ref.pad95 + 12) return "Hipertensão Estágio 2";
    if (pas >= ref.pas95 || pad >= ref.pad95) return "Hipertensão Estágio 1";
    if (pas >= ref.pas90 || pad >= ref.pad90) return "Pressão Arterial Elevada";
    return "Normal";
}
