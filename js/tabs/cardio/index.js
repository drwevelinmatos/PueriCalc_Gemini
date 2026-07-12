// tabs/cardio/index.js
import { byId, showResult } from '../../utils/dom.js';
import { SBP_DATA, TASKFORCE_DATA } from './PA_data.js';

// Importa WHO_DATA para cálculo de percentil de estatura (≥ 1 ano)
let WHO_DATA = null;
import('../crescimento/who_data.js')
    .then(m => WHO_DATA = m.WHO_DATA)
    .catch(e => console.warn("Aviso: WHO_DATA não carregado para percentil de estatura."));

export function renderCardio() {
    const root = byId('tab-cardio');
    if (!root) return;

    root.innerHTML = `
    <div class="card">
        <div class="card-header">
            <h2>Classificação de Pressão Arterial (SBP)</h2>
        </div>
        
        <div class="grid-2" style="margin-bottom: 15px;">
            <div>
                <label>Faixa Etária</label>
                <select id="cardio-faixa" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ccc;">
                    <option value="maior">Criança/Adolescente (≥ 1 ano)</option>
                    <option value="menor">Lactente (< 1 ano)</option>
                </select>
            </div>
            <div>
                <label id="lbl-idade">Idade (anos)</label>
                <input type="number" id="cardio-idade" min="0" max="18" step="0.1" placeholder="Ex: 5">
            </div>
        </div>

        <div class="grid-2" style="margin-bottom: 15px;">
            <div>
                <label>Sexo</label>
                <select id="cardio-sexo" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ccc;">
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                </select>
            </div>
            <div>
                <label>Estatura (cm)</label>
                <input type="number" id="cardio-est" min="40" max="200" step="0.1" placeholder="Ex: 110">
            </div>
        </div>

        <div class="grid-3" style="background: #f8fbfd; padding: 15px; border-radius: 8px; border: 1px solid #d8e2ea;">
            <div>
                <label>PAS (mmHg)</label>
                <input type="number" id="cardio-pas" placeholder="Sistólica">
            </div>
            <div>
                <label>PAD (mmHg)</label>
                <input type="number" id="cardio-pad" placeholder="Diastólica">
            </div>
            <div>
                <label>PAM (mmHg)</label>
                <input type="number" id="cardio-pam" readonly style="background: #eef2f5; cursor: not-allowed; font-weight: bold; color: var(--azul);">
            </div>
        </div>
        
        <button class="calc-btn" id="btn-calc-pa" style="margin-top:20px;">Classificar PA</button>
        <div id="res-pa" class="result-box" style="margin-top:15px; white-space:pre-wrap; line-height: 1.6; display: none;"></div>
    </div>
    `;

    // Listeners
    byId('cardio-faixa').addEventListener('change', toggleIdadeLabel);
    byId('cardio-pas').addEventListener('input', calcularPAM);
    byId('cardio-pad').addEventListener('input', calcularPAM);
    byId('btn-calc-pa').addEventListener('click', classificarPA);
}

// === INTERAÇÕES DE UI ===
function toggleIdadeLabel() {
    const isLactente = byId('cardio-faixa').value === 'menor';
    byId('lbl-idade').innerText = isLactente ? 'Idade (meses)' : 'Idade (anos)';
    byId('cardio-idade').placeholder = isLactente ? 'Ex: 6.5' : 'Ex: 5';
}

function calcularPAM() {
    const pas = parseFloat(byId('cardio-pas').value);
    const pad = parseFloat(byId('cardio-pad').value);
    const pamField = byId('cardio-pam');
    
    if (pas > 0 && pad > 0) {
        const pam = Math.round((pas + 2 * pad) / 3);
        pamField.value = pam;
    } else {
        pamField.value = '';
    }
}

// === MOTOR PRINCIPAL ===
function classificarPA() {
    const isLactente = byId('cardio-faixa').value === 'menor';
    const idade = parseFloat(byId('cardio-idade').value);
    const est = parseFloat(byId('cardio-est').value);
    const sexo = byId('cardio-sexo').value;
    const pas = parseFloat(byId('cardio-pas').value);
    const pad = parseFloat(byId('cardio-pad').value);

    if (isNaN(idade) || isNaN(est) || isNaN(pas) || isNaN(pad)) {
        return alert("Por favor, preencha Idade, Estatura, PAS e PAD para o cálculo correto.");
    }

    if (isLactente) {
        processarMenor1Ano(idade, sexo, pas, pad);
    } else {
        processarMaior1Ano(idade, est, sexo, pas, pad);
    }
}

// === LÓGICA < 1 ANO (TASKFORCE_DATA) ===
function processarMenor1Ano(idadeMeses, sexo, pas, pad) {
    const c = TASKFORCE_DATA[sexo];
    if (!c) return showResult('res-pa', "Dados de lactente não encontrados no banco.");

    // Interpolação para encontrar as referências exatas baseadas nos meses decimais
    const ref = {
        sbp: {
            p50: interpCurve(c.sbp.p50, idadeMeses),
            p75: interpCurve(c.sbp.p75, idadeMeses),
            p90: interpCurve(c.sbp.p90, idadeMeses),
            p95: interpCurve(c.sbp.p95, idadeMeses)
        },
        dbp: {
            p50: interpCurve(c.dbp.p50, idadeMeses),
            p75: interpCurve(c.dbp.p75, idadeMeses),
            p90: interpCurve(c.dbp.p90, idadeMeses),
            p95: interpCurve(c.dbp.p95, idadeMeses)
        }
    };

    const pasPct = estimatePercentile(pas, ref.sbp.p50, ref.sbp.p75, ref.sbp.p90, ref.sbp.p95);
    const padPct = estimatePercentile(pad, ref.dbp.p50, ref.dbp.p75, ref.dbp.p90, ref.dbp.p95);
    const maxPct = Math.max(pasPct, padPct);

    let classificacao = "Normal";
    let color = "#27ae60"; // Verde

    if (maxPct >= 95) {
        classificacao = "Elevada (> P95) - Investigar e Confirmar";
        color = "#c0392b"; // Vermelho
    }
    else if (maxPct >= 90) {
        classificacao = "Limítrofe (P90 - P95)";
        color = "#f39c12"; // Laranja
    }

    const html = `<strong>📋 RESULTADOS (Lactente < 1 ano)</strong>
• <strong>Percentil Estimado:</strong> PAS ~P${Math.round(pasPct)} / PAD ~P${Math.round(padPct)}
• <strong>Referência (P50):</strong> PAS ${Math.round(ref.sbp.p50)} / PAD ${Math.round(ref.dbp.p50)} mmHg
• <strong>Referência (P90):</strong> PAS ${Math.round(ref.sbp.p90)} / PAD ${Math.round(ref.dbp.p90)} mmHg

<strong>🚨 Classificação (Task Force):</strong> <span style="color: ${color}; font-weight: 800;">${classificacao}</span>`;

    renderHTML('res-pa', html);
}

function interpCurve(arr, m) {
    const x = Math.max(0, Math.min(12, m));
    const i = Math.floor(x);
    const j = Math.min(12, i + 1);
    const t = x - i;
    return arr[i] + (arr[j] - arr[i]) * t;
}

function estimatePercentile(value, p50, p75, p90, p95) {
    if (value <= p50) return Math.max(50 * (value / Math.max(p50, 1)), 1);
    if (value <= p75) return 50 + (value - p50) / (p75 - p50) * 25;
    if (value <= p90) return 75 + (value - p75) / (p90 - p75) * 15;
    if (value <= p95) return 90 + (value - p90) / (p95 - p90) * 5;
    return 95 + Math.min(4, (value - p95) / Math.max(1, (p95 - p90)) * 4);
}


// === LÓGICA ≥ 1 ANO (SBP_DATA / AAP 2017) ===
function processarMaior1Ano(idadeAnos, est, sexo, pas, pad) {
    const idadeCalc = Math.floor(idadeAnos);
    const idadeTabela = Math.min(Math.max(1, idadeCalc), 17); // Tabelas vão de 1 a 17 anos

    // 1. Encontrar Percentil de Estatura
    const pctEstBruto = calcularPercentilEstatura(idadeCalc, est, sexo);
    const pctEstTabela = arredondarPercentilSBP(pctEstBruto);

    // 2. Buscar Referência no Banco de Dados
    if (!SBP_DATA[sexo] || !SBP_DATA[sexo][idadeTabela]) {
        return showResult('res-pa', "Dados de referência não encontrados no SBP_DATA.");
    }
    const ref = SBP_DATA[sexo][idadeTabela][pctEstTabela];
    if (!ref) {
        return showResult('res-pa', `Faltam os dados para P${pctEstTabela} na idade de ${idadeTabela} anos no SBP_DATA.`);
    }

    // 3. Classificação Rigorosa SBP (Aplica regra do "O que for menor")
    let classificacao = "Normal";
    let color = "#27ae60"; // Verde

    if (idadeAnos >= 13) {
        // Regra para >= 13 anos (Limites absolutos dominam)
        if (pas >= 140 || pad >= 90) {
            classificacao = "Hipertensão Estágio 2";
            color = "#c0392b"; // Vermelho
        }
        else if ((pas >= 130 && pas <= 139) || (pad >= 80 && pad <= 89)) {
            classificacao = "Hipertensão Estágio 1";
            color = "#e67e22"; // Laranja escuro
        }
        else if (pas >= 120 && pas <= 129 && pad < 80) {
            classificacao = "Pressão Arterial Elevada";
            color = "#f39c12"; // Laranja
        }
    } else {
        // Regra para 1 a 12 anos
        const tElevadaPas = Math.min(ref.pas90, 120);
        const tElevadaPad = Math.min(ref.pad90, 80);
        const tEstagio1Pas = Math.min(ref.pas95, 130);
        const tEstagio1Pad = Math.min(ref.pad95, 80);
        const tEstagio2Pas = Math.min(ref.pas95 + 12, 140);
        const tEstagio2Pad = Math.min(ref.pad95 + 12, 90);

        if (pas >= tEstagio2Pas || pad >= tEstagio2Pad) {
            classificacao = "Hipertensão Estágio 2";
            color = "#c0392b"; // Vermelho
        }
        else if (pas >= tEstagio1Pas || pad >= tEstagio1Pad) {
            classificacao = "Hipertensão Estágio 1";
            color = "#e67e22"; // Laranja escuro
        }
        else if (pas >= tElevadaPas || pad >= tElevadaPad) {
            classificacao = "Pressão Arterial Elevada";
            color = "#f39c12"; // Laranja
        }
    }

    // 4. Exibir
    const p50Str = (ref.pas50 && ref.pad50) ? `${ref.pas50} / ${ref.pad50}` : `Indisponível`;
    
    const html = `<strong>📋 RESULTADOS (Criança/Adolescente ≥ 1 ano)</strong>
• <strong>Estatura do Paciente:</strong> Percentil ${pctEstBruto} (Ajustado para P${pctEstTabela} na tabela)
• <strong>PA Esperada (P50):</strong> ${p50Str} mmHg
• <strong>Limite Elevada (P90):</strong> PAS ${ref.pas90} / PAD ${ref.pad90} mmHg
• <strong>Limite Estágio 1 (P95):</strong> PAS ${ref.pas95} / PAD ${ref.pad95} mmHg

<strong>🚨 Classificação (SBP 2021):</strong> <span style="color: ${color}; font-weight: 800;">${classificacao}</span>`;

    renderHTML('res-pa', html);
}

// === FUNÇÃO DE APOIO PARA RENDERIZAR HTML ===
function renderHTML(elementId, htmlString) {
    const box = byId(elementId);
    if (box) {
        box.innerHTML = htmlString;
        box.style.display = 'block'; // Mostra a caixa de resultado
    }
}

// Matemática de Apoio OMS
function calcularPercentilEstatura(idadeAnos, est, sexo) {
    if (!WHO_DATA || !WHO_DATA[sexo]) return 50;
    const meses = idadeAnos * 12;
    const ref = WHO_DATA[sexo].estatura['m' + meses] || WHO_DATA[sexo].estatura['d' + (meses * 30)];
    if (!ref) return 50;
    
    const z = (Math.pow(est / ref.m, ref.l) - 1) / (ref.l * ref.s);
    let erf = 1.0 - 1.0 / Math.pow(1 + 0.3275911 * Math.abs(z / Math.sqrt(2)), 1);
    let p = (z > 0 ? 0.5 + erf/2 : 0.5 - erf/2) * 100;
    return Math.round(p);
}

function arredondarPercentilSBP(p) {
    const colunasSBP = [5, 10, 25, 50, 75, 90, 95];
    return colunasSBP.reduce((prev, curr) => Math.abs(curr - p) < Math.abs(prev - p) ? curr : prev);
}
