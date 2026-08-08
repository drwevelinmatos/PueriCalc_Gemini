// tabs/cardio/pa.js
import { byId } from '../../utils/dom.js';
import { SBP_DATA, TASKFORCE_DATA } from './PA_data.js';

// Importa WHO_DATA para cálculo de percentil de estatura (≥ 1 ano)
let WHO_DATA = null;
import('../crescimento/who_data.js')
    .then(m => WHO_DATA = m.WHO_DATA)
    .catch(e => console.warn("Aviso: WHO_DATA não carregado para percentil de estatura."));

export function initPACard() {
    const slot = byId('cardio-pa-slot');
    if (!slot) return;

    slot.innerHTML = `
    <div class="card">
        <div class="card-header">
            <h2>Classificação de Pressão Arterial (SBP / DBHA 2025)</h2>
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
                <input type="number" id="cardio-idade" min="0" max="18" step="0.5" placeholder="Ex: 5.5">
            </div>
        </div>

        <div class="grid-2" style="margin-bottom: 15px;" id="box-estatura">
            <div>
                <label>Sexo</label>
                <select id="cardio-sexo" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ccc;">
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                </select>
            </div>
            <div>
                <label>Estatura (cm)</label>
                <input type="number" id="cardio-estatura" step="0.1" placeholder="Ex: 110.5">
            </div>
        </div>

        <div class="grid-2" style="margin-bottom: 15px;">
            <div>
                <label>PAS Medida (mmHg)</label>
                <input type="number" id="cardio-pas" placeholder="Ex: 115">
            </div>
            <div>
                <label>PAD Medida (mmHg)</label>
                <input type="number" id="cardio-pad" placeholder="Ex: 75">
            </div>
        </div>

        <div style="display: flex; gap: 10px;">
            <button class="calc-btn" id="btn-calc-pa" style="flex: 1; margin: 0;">Calcular Percentil e PA</button>
            <button class="clear-btn" id="btn-limpar-pa" style="background: #e2e8f0; color: #475569; padding: 10px 15px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Limpar</button>
        </div>

        <div id="res-pa" class="result-box" style="display: none; margin-top: 15px;"></div>
    </div>
    `;

    byId('cardio-faixa').addEventListener('change', (e) => {
        const isMenor = e.target.value === 'menor';
        byId('box-estatura').style.display = isMenor ? 'none' : 'grid';
        byId('lbl-idade').innerText = isMenor ? 'Idade (meses)' : 'Idade (anos)';
        byId('cardio-idade').placeholder = isMenor ? 'Ex: 6' : 'Ex: 5.5';
    });

    byId('btn-calc-pa').addEventListener('click', processarPA);
    byId('btn-limpar-pa').addEventListener('click', () => {
        byId('cardio-idade').value = '';
        byId('cardio-estatura').value = '';
        byId('cardio-pas').value = '';
        byId('cardio-pad').value = '';
        byId('res-pa').style.display = 'none';
    });
}

function processarPA() {
    const isMenor = byId('cardio-faixa').value === 'menor';
    const idade = parseFloat(byId('cardio-idade').value);
    const pas = parseFloat(byId('cardio-pas').value);
    const pad = parseFloat(byId('cardio-pad').value);
    const sexo = byId('cardio-sexo').value;

    if (isNaN(idade) || isNaN(pas) || isNaN(pad)) {
        return alert("Preencha idade e valores da PA.");
    }

    if (isMenor) {
        calcularPABebe(idade, pas, pad, sexo);
    } else {
        const est = parseFloat(byId('cardio-estatura').value);
        if (isNaN(est)) return alert("Preencha a estatura.");
        calcularPACrianca(idade, est, pas, pad, sexo);
    }
}

function calcularPABebe(meses, pas, pad, sexo) {
    let m = Math.floor(meses);
    if (m > 12) m = 12;

    const dataSexo = TASKFORCE_DATA[sexo];
    const sbpData = dataSexo.sbp;
    const dbpData = dataSexo.dbp;

    const ref = {
        pas50: sbpData.p50[m],
        pas90: sbpData.p90[m],
        pas95: sbpData.p95[m],
        pas99: sbpData.p99[m],
        pad50: dbpData.p50[m],
        pad90: dbpData.p90[m],
        pad95: dbpData.p95[m],
        pad99: dbpData.p99[m]
    };

    let classif = "Normal";
    let color = "#27ae60";

    if (pas >= ref.pas99 || pad >= ref.pad99) {
        classif = "Significativamente Alta (≥ P99)";
        color = "#c0392b";
    } else if (pas >= ref.pas95 || pad >= ref.pad95) {
        classif = "Alta (≥ P95 a < P99)";
        color = "#e67e22";
    } else if (pas >= ref.pas90 || pad >= ref.pad90) {
        classif = "PA Elevada (≥ P90 a < P95)";
        color = "#f1c40f";
    }

    let adaptacaoParaDBHA = classif === 'Normal' ? 'Normal' : (classif.includes('Elevada') ? 'PA Elevada' : (classif.includes('Alta (≥ P95') ? 'Hipertensão Estágio 1' : 'Hipertensão Estágio 2'));
    let recomendacaoDBHA = obterRecomendacoesDBHA2025(adaptacaoParaDBHA);

    const html = `
        <div style="font-size: 15px; margin-bottom: 8px;">
            • <strong>PAS:</strong> ${pas} mmHg | <strong>PAD:</strong> ${pad} mmHg <br>
            • <strong>PA Esperada (P50):</strong> PAS ${ref.pas50} / PAD ${ref.pad50} mmHg<br>
            • <strong>Limite Elevada (P90):</strong> PAS ${ref.pas90} / PAD ${ref.pad90} mmHg<br>
            • <strong>Limite Alta (P95):</strong> PAS ${ref.pas95} / PAD ${ref.pad95} mmHg<br>
            • <strong>Limite Muito Alta (P99):</strong> PAS ${ref.pas99} / PAD ${ref.pad99} mmHg
        </div>
        <div style="font-size: 16px; margin-top: 15px; padding: 10px; background: #f8fafc; border-left: 4px solid ${color}; border-radius: 4px;">
            <strong>🚨 Classificação (Task Force):</strong> <span style="color: ${color}; font-weight: 800;">${classif}</span>
        </div>
        ${recomendacaoDBHA}
    `;

    renderHTML('res-pa', html);
}

function calcularPACrianca(idadeAnos, est, pas, pad, sexo) {
    let ageKey = Math.floor(idadeAnos);
    if (ageKey < 1) ageKey = 1;
    if (ageKey > 17) ageKey = 17;

    const dataIdade = SBP_DATA[sexo][ageKey];
    if (!dataIdade) return alert("Erro ao acessar dados de PA para essa idade.");

    const pctEstBruto = calcularPercentilEstatura(idadeAnos, est, sexo);
    let pctEstTabela = 50;

    const percentisTabela = [5, 10, 25, 50, 75, 90, 95];
    let menorDiff = Infinity;

    for (let p of percentisTabela) {
        let diff = Math.abs(pctEstBruto - p);
        if (diff < menorDiff) {
            menorDiff = diff;
            pctEstTabela = p;
        }
    }

    const ref = dataIdade[pctEstTabela];
    let pas95Mais12 = ref.pas95 + 12;
    let pad95Mais12 = ref.pad95 + 12;

    const { class: classificacao, color } = classificarPASBP2021(pas, pad, ref, idadeAnos);

    let avisoAdolescente = '';
    if (idadeAnos >= 13) {
        avisoAdolescente = '<br><small style="color: #7f8c8d; font-weight: normal; margin-top:4px; display:inline-block;">*Para adolescentes ≥ 13 anos, aplicam-se os limites absolutos padrão (ex: ≥ 120/80 mmHg).</small>';
    }

    let p50Str = `PAS ${ref.pas50} / PAD ${ref.pad50}`;

    // Extração das recomendações baseadas no DBHA 2025
    let recomendacaoDBHA = obterRecomendacoesDBHA2025(classificacao);

    const html = `
        <div style="font-size: 15px; margin-bottom: 8px;">
            • <strong>PAS:</strong> ${pas} mmHg | <strong>PAD:</strong> ${pad} mmHg <br>
            • <strong>Estatura do Paciente:</strong> Percentil ${pctEstBruto.toFixed(1)} (Ajustado para P${pctEstTabela} na tabela)<br>
            • <strong>PA Esperada (P50):</strong> ${p50Str} mmHg<br>
            • <strong>Limite Elevada (P90):</strong> PAS ${ref.pas90} / PAD ${ref.pad90} mmHg<br>
            • <strong>Limite Estágio 1 (P95):</strong> PAS ${ref.pas95} / PAD ${ref.pad95} mmHg<br>
            • <strong>Limite Estágio 2 (P95+12):</strong> PAS ${pas95Mais12} / PAD ${pad95Mais12} mmHg
        </div>
        <div style="font-size: 16px; margin-top: 15px; padding: 10px; background: #f8fafc; border-left: 4px solid ${color}; border-radius: 4px;">
            <strong>🚨 Classificação (AAP/DBHA):</strong> <span style="color: ${color}; font-weight: 800;">${classificacao}</span>${avisoAdolescente}
        </div>
        ${recomendacaoDBHA}
    `;

    renderHTML('res-pa', html);
}

function classificarPASBP2021(pas, pad, ref, idadeAnos) {
    if (idadeAnos >= 13) {
        if (pas >= 140 || pad >= 90) return { class: 'Hipertensão Estágio 2', color: '#c0392b' };
        if ((pas >= 130 && pas <= 139) || (pad >= 80 && pad <= 89)) return { class: 'Hipertensão Estágio 1', color: '#e67e22' };
        if ((pas >= 120 && pas <= 129) && pad < 80) return { class: 'PA Elevada', color: '#f1c40f' };
        return { class: 'Normal', color: '#27ae60' };
    } else {
        const pasEstagio2 = ref.pas95 + 12;
        const padEstagio2 = ref.pad95 + 12;

        if (pas >= pasEstagio2 || pad >= padEstagio2 || pas >= 140 || pad >= 90) {
            return { class: 'Hipertensão Estágio 2', color: '#c0392b' };
        }
        if ((pas >= ref.pas95 && pas < pasEstagio2) || (pad >= ref.pad95 && pad < padEstagio2) || (pas >= 130 && pas <= 139) || (pad >= 80 && pad <= 89)) {
            return { class: 'Hipertensão Estágio 1', color: '#e67e22' };
        }
        if ((pas >= ref.pas90 && pas < ref.pas95) || (pad >= ref.pad90 && pad < ref.pad95) || (pas >= 120 && pas < ref.pas95 && pad < 80)) { 
            return { class: 'PA Elevada', color: '#f1c40f' };
        }
        return { class: 'Normal', color: '#27ae60' };
    }
}

// === GERAÇÃO DA CONDUTA DBHA 2025 ===
function obterRecomendacoesDBHA2025(classificacao) {
    let conduta = "";
    let exames = "";
    let tratamento = "";

    if (classificacao === 'Normal') {
        conduta = "Aferir a PA anualmente a partir dos 3 anos de idade[cite: 2561].";
        exames = "Sem indicação laboratorial de rotina para rastreio primário em indivíduos de baixo risco.";
        tratamento = "Orientação e estímulo à manutenção de hábitos de vida saudáveis.";
    } else if (classificacao === 'PA Elevada' || classificacao === 'Pré-hipertensão') {
        conduta = "A MAPA está indicada se as medidas de consultório compatíveis com pré-hipertensão persistirem por pelo menos 1 ano[cite: 2561]. Acompanhar evolução ambulatorialmente.";
        exames = "Pesquisar comorbidades se houver presença de sobrepeso ou obesidade.";
        tratamento = "Recomenda-se a dieta DASH para crianças e adolescentes, medidas de controle do estresse, redução do peso corporal e prática de atividades físicas regulares (Medidas Não Medicamentosas - MNM)[cite: 2561].";
    } else if (classificacao === 'Hipertensão Estágio 1') {
        conduta = "Confirmar o diagnóstico de HA com a MAPA caso os valores compatíveis com Estágio 1 se mantenham em três consultas ambulatoriais[cite: 2561]. Avaliar lesão em órgãos-alvo (LOA).";
        exames = "A pesquisa de proteinúria é obrigatória. Recomenda-se a investigação de HAB e HA secundária nas crianças prematuras, e naquelas com DRC, DM, AOS e obesidade[cite: 2561]. <br><i style='color: #7f8c8d'>*A avaliação extensa para HA secundária é dispensável em pacientes ≥ 6 anos com sobrepeso ou obesidade e histórico familiar positivo sem achados de risco ao exame clínico[cite: 2556].</i>";
        tratamento = "Iniciar MNM (dieta DASH, exercícios). Recomenda-se início de terapêutica medicamentosa (IECA, BRA, BCC de ação prolongada ou tiazídico) para HA sintomática, presença de LOA, HA secundária ou persistente/não responsiva à MNM (quando a PA se mantiver ≥ P95 em crianças ou ≥ 130/80 mmHg em adolescentes ≥ 13 anos)[cite: 2561]. Em casos de HA secundária a DRC, DM ou proteinúria, iniciar preferencialmente com IECA ou BRA[cite: 2561].";
    } else if (classificacao === 'Hipertensão Estágio 2') {
        conduta = "Confirmação do diagnóstico, avaliação clínica imediata e pesquisa de lesões em órgãos-alvo (LOA).";
        exames = "A pesquisa de proteinúria é obrigatória[cite: 2561]. Prosseguir com rastreio de etiologias de HA secundária (especialmente se o paciente não apresentar causa modificável aparente)[cite: 2561].";
        tratamento = "Início imediato de terapêutica medicamentosa (IECA, BRA, BCC de ação prolongada ou diurético tiazídico) concomitante às medidas não medicamentosas (dieta DASH, etc)[cite: 2561]. Iniciar preferencialmente com IECA ou BRA em caso de HA secundária a DRC, DM e/ou proteinúria[cite: 2561].";
    }

    if (!conduta) return "";

    return `
        <div style="margin-top: 15px; padding: 15px; background: #eef2f5; border-radius: 6px; border: 1px solid #d8e2ea;">
            <h4 style="margin: 0 0 10px 0; color: #2c3e50; font-size: 14px; display: flex; align-items: center; gap: 6px;">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm.93 11.532a.5.5 0 0 1-.86 0L4.5 7.5a.5.5 0 0 1 .5-.866h2V3a.5.5 0 0 1 1 0v3.634h2a.5.5 0 0 1 .5.866l-3.57 3.998z"/></svg>
                DBHA 2025: Conduta, Exames e Tratamento (Pediatria)
            </h4>
            <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #34495e; line-height: 1.6;">
                <li style="margin-bottom: 6px;"><strong>Conduta:</strong> ${conduta}</li>
                <li style="margin-bottom: 6px;"><strong>Exames:</strong> ${exames}</li>
                <li><strong>Tratamento:</strong> ${tratamento}</li>
            </ul>
        </div>
    `;
}

// === FUNÇÕES DE APOIO ===
function renderHTML(elementId, htmlString) {
    const box = byId(elementId);
    if (box) {
        box.innerHTML = htmlString;
        box.style.display = 'block';
    }
}

function calcularPercentilEstatura(idadeAnos, est, sexo) {
    if (!WHO_DATA || !WHO_DATA[sexo]) return 50;
    const meses = idadeAnos * 12;
    const ref = WHO_DATA[sexo].estatura['m' + Math.round(meses)] || WHO_DATA[sexo].estatura['d' + Math.round(meses * 30.4375)];
    if (!ref) return 50;

    const L = ref.l;
    const M = ref.m;
    const S = ref.s;

    let z = 0;
    if (L === 0) {
        z = Math.log(est / M) / S;
    } else {
        z = (Math.pow(est / M, L) - 1) / (L * S);
    }

    const p = zParaPercentil(z);
    return Math.min(Math.max(p, 5), 95);
}

function zParaPercentil(z) {
    let sign = (z < 0) ? -1 : 1;
    let x = Math.abs(z) / Math.sqrt(2);
    let t = 1.0 / (1.0 + 0.3275911 * x);
    let a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429;
    let erf = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    let percentil = 0.5 * (1.0 + sign * erf) * 100;
    return percentil;
}
