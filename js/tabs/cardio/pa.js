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
        <div class="card-header" style="margin-bottom: 10px;">
            <h2>Classificação de Pressão Arterial (SBP / DBHA 2025)</h2>
        </div>
        
        <div class="grid-2" style="margin-bottom: 10px;">
            <div>
                <label>Faixa Etária</label>
                <select id="cardio-faixa" style="width: 100%; padding: 6px; border-radius: 6px; border: 1px solid #ccc;">
                    <option value="maior">Criança/Adolescente (≥ 1 ano)</option>
                    <option value="menor">Lactente (< 1 ano)</option>
                </select>
            </div>
            <div>
                <label id="lbl-idade">Idade (anos)</label>
                <input type="number" id="cardio-idade" min="0" max="18" step="0.5" placeholder="Ex: 5.5" style="padding: 6px;">
            </div>
        </div>

        <div class="grid-2" style="margin-bottom: 10px;" id="box-estatura">
            <div>
                <label>Sexo</label>
                <select id="cardio-sexo" style="width: 100%; padding: 6px; border-radius: 6px; border: 1px solid #ccc;">
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                </select>
            </div>
            <div>
                <label>Estatura (cm)</label>
                <input type="number" id="cardio-estatura" step="0.1" placeholder="Ex: 110.5" style="padding: 6px;">
            </div>
        </div>

        <div class="grid-2" style="margin-bottom: 12px;">
            <div>
                <label>PAS Medida (mmHg)</label>
                <input type="number" id="cardio-pas" placeholder="Ex: 115" style="padding: 6px;">
            </div>
            <div>
                <label>PAD Medida (mmHg)</label>
                <input type="number" id="cardio-pad" placeholder="Ex: 75" style="padding: 6px;">
            </div>
        </div>

        <div style="display: flex; gap: 10px;">
            <button class="calc-btn" id="btn-calc-pa" style="flex: 1; margin: 0; padding: 8px;">Calcular Percentil e PA</button>
            <button class="clear-btn" id="btn-limpar-pa" style="background: #e2e8f0; color: #475569; padding: 8px 15px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Limpar</button>
        </div>

        <div id="res-pa" class="result-box" style="display: none; margin-top: 15px; padding: 12px;"></div>
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
        pas50: sbpData.p50[m], pas90: sbpData.p90[m], pas95: sbpData.p95[m], pas99: sbpData.p99[m],
        pad50: dbpData.p50[m], pad90: dbpData.p90[m], pad95: dbpData.p95[m], pad99: dbpData.p99[m]
    };

    let classif = "Normal";
    let color = "#27ae60";

    if (pas >= ref.pas99 || pad >= ref.pad99) { classif = "Significativamente Alta (≥ P99)"; color = "#c0392b"; } 
    else if (pas >= ref.pas95 || pad >= ref.pad95) { classif = "Alta (≥ P95 a < P99)"; color = "#e67e22"; } 
    else if (pas >= ref.pas90 || pad >= ref.pad90) { classif = "PA Elevada (≥ P90 a < P95)"; color = "#f1c40f"; }

    let adaptacaoParaDBHA = classif === 'Normal' ? 'Normal' : (classif.includes('Elevada') ? 'PA Elevada' : (classif.includes('Alta (≥ P95') ? 'Hipertensão Estágio 1' : 'Hipertensão Estágio 2'));
    let recomendacaoDBHA = obterRecomendacoesDBHA2025(adaptacaoParaDBHA);

    const html = `
        <div style="font-size: 13px; line-height: 1.4; color: #34495e;">
            • <strong>Valores:</strong> PAS ${pas} | PAD ${pad} mmHg <br>
            • <strong>Limites:</strong> P50: ${ref.pas50}/${ref.pad50} | P90: ${ref.pas90}/${ref.pad90} | P95: ${ref.pas95}/${ref.pad95} | P99: ${ref.pas99}/${ref.pad99}
        </div>
        <div style="font-size: 14px; margin-top: 8px; padding: 6px 10px; background: #f8fafc; border-left: 4px solid ${color}; border-radius: 4px;">
            <strong>🚨 Classificação:</strong> <span style="color: ${color}; font-weight: 800;">${classif}</span>
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
    if (!dataIdade) return alert("Erro ao acessar dados de PA.");

    const pctEstBruto = calcularPercentilEstatura(idadeAnos, est, sexo);
    let pctEstTabela = 50;
    const percentisTabela = [5, 10, 25, 50, 75, 90, 95];
    let menorDiff = Infinity;

    for (let p of percentisTabela) {
        let diff = Math.abs(pctEstBruto - p);
        if (diff < menorDiff) { menorDiff = diff; pctEstTabela = p; }
    }

    const ref = dataIdade[pctEstTabela];
    let pas95Mais12 = ref.pas95 + 12;
    let pad95Mais12 = ref.pad95 + 12;

    const { class: classificacao, color } = classificarPASBP2021(pas, pad, ref, idadeAnos);

    let avisoAdolescente = idadeAnos >= 13 ? ' <span style="font-size:11px; color:#7f8c8d; font-weight:normal;">(*Critério adulto aplicado ≥ 13a)</span>' : '';
    let recomendacaoDBHA = obterRecomendacoesDBHA2025(classificacao);

    const html = `
        <div style="font-size: 13px; line-height: 1.4; color: #34495e;">
            • <strong>Valores:</strong> PAS ${pas} | PAD ${pad} mmHg <br>
            • <strong>Estatura:</strong> P${pctEstBruto.toFixed(1)} (Ajustado P${pctEstTabela})<br>
            • <strong>Limites:</strong> P50: ${ref.pas50}/${ref.pad50} | P90: ${ref.pas90}/${ref.pad90} | P95: ${ref.pas95}/${ref.pad95} | P95+12: ${pas95Mais12}/${pad95Mais12}
        </div>
        <div style="font-size: 14px; margin-top: 8px; padding: 6px 10px; background: #f8fafc; border-left: 4px solid ${color}; border-radius: 4px;">
            <strong>🚨 Classificação:</strong> <span style="color: ${color}; font-weight: 800;">${classificacao}</span>${avisoAdolescente}
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
        if (pas >= pasEstagio2 || pad >= padEstagio2 || pas >= 140 || pad >= 90) return { class: 'Hipertensão Estágio 2', color: '#c0392b' };
        if ((pas >= ref.pas95 && pas < pasEstagio2) || (pad >= ref.pad95 && pad < padEstagio2) || (pas >= 130 && pas <= 139) || (pad >= 80 && pad <= 89)) return { class: 'Hipertensão Estágio 1', color: '#e67e22' };
        if ((pas >= ref.pas90 && pas < ref.pas95) || (pad >= ref.pad90 && pad < ref.pad95) || (pas >= 120 && pas < ref.pas95 && pad < 80)) return { class: 'PA Elevada', color: '#f1c40f' };
        return { class: 'Normal', color: '#27ae60' };
    }
}

// === GERAÇÃO DA CONDUTA DBHA 2025 ===
function obterRecomendacoesDBHA2025(classificacao) {
    let conduta = "", exames = "", tratamento = "";

    if (classificacao === 'Normal') {
        conduta = "Aferir PA anualmente a partir dos 3 anos.";
        exames = "Sem indicação laboratorial de rotina.";
        tratamento = "Estímulo a hábitos saudáveis.";
    } else if (classificacao === 'PA Elevada' || classificacao === 'Pré-hipertensão') {
        conduta = "Reavaliar em 6m. MAPA se persistir por 1 ano.";
        exames = `Pesquisar se sobrepeso/obesidade:
            <ul style="margin: 2px 0 0 15px; padding: 0;">
                <li><strong>Lab:</strong> Glicemia jejum, HbA1c, Colesterol, Triglicerídeos, TGO e TGP.</li>
            </ul>`;
        tratamento = "MNM: Dieta DASH, redução de sódio/peso e atividade física.";
    } else if (classificacao === 'Hipertensão Estágio 1') {
        conduta = "Confirmar com MAPA. Pesquisar lesão de órgão-alvo (LOA) e causas secundárias.";
        exames = `
            <ul style="margin: 2px 0 0 15px; padding: 0;">
                <li><strong>Lab:</strong> EAS, Ureia, Cr, Na+, K+, Ácido Úrico, Perfil Lipídico e Glicemia.</li>
                <li><strong>Imagem:</strong> USG de Rins/Vias Urinárias e Ecocardiograma (HVE).</li>
            </ul>`;
        tratamento = `
            Iniciar MNM. <strong>Medicação</strong> se sintomática, LOA, secundária ou refratária.<br>
            <ul style="margin: 2px 0 0 15px; padding: 0;">
                <li><strong>Enalapril:</strong> 0,08-0,6 mg/kg/dia <em>(Máx: 40mg/dia)</em></li>
                <li><strong>Losartana:</strong> 0,7-1,4 mg/kg/dia 1x/dia <em>(Máx: 100mg/dia)</em></li>
                <li><strong>Anlodipino:</strong> 0,1-0,6 mg/kg/dia 1x/dia <em>(Máx: 10mg/dia)</em></li>
                <li><strong>HCTZ:</strong> 1-2 mg/kg/dia 1x/dia <em>(Máx: 50mg/dia)</em></li>
            </ul>`;
    } else if (classificacao === 'Hipertensão Estágio 2') {
        conduta = "Encaminhar especialista. Rastreio imediato de LOA e causas secundárias.";
        exames = `
            <ul style="margin: 2px 0 0 15px; padding: 0;">
                <li><strong>Lab:</strong> EAS, Ur, Cr, Na+, K+, Ác. Úrico, Perfil Lipídico, Glicemia. <em>(Considerar Renina, Aldosterona, TSH/T4L)</em>.</li>
                <li><strong>Imagem:</strong> USG Vias Urinárias com Doppler de Art. Renais, Ecocardiograma e Fundoscopia.</li>
            </ul>`;
        tratamento = `
            <strong>Início IMEDIATO de medicação</strong> + MNM.<br>
            <ul style="margin: 2px 0 0 15px; padding: 0;">
                <li><strong>Enalapril:</strong> 0,08-0,6 mg/kg/dia <em>(Máx: 40mg/dia)</em></li>
                <li><strong>Losartana:</strong> 0,7-1,4 mg/kg/dia 1x/dia <em>(Máx: 100mg/dia)</em></li>
                <li><strong>Anlodipino:</strong> 0,1-0,6 mg/kg/dia 1x/dia <em>(Máx: 10mg/dia)</em></li>
                <li><strong>HCTZ:</strong> 1-2 mg/kg/dia 1x/dia <em>(Máx: 50mg/dia)</em></li>
            </ul>`;
    }

    if (!conduta) return "";

    return `
        <div style="margin-top: 10px; padding: 10px; background: #eef2f5; border-radius: 6px; border: 1px solid #d8e2ea;">
            <h4 style="margin: 0 0 6px 0; color: #2c3e50; font-size: 13px; display: flex; align-items: center; gap: 4px;">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm.93 11.532a.5.5 0 0 1-.86 0L4.5 7.5a.5.5 0 0 1 .5-.866h2V3a.5.5 0 0 1 1 0v3.634h2a.5.5 0 0 1 .5.866l-3.57 3.998z"/></svg>
                DBHA 2025: Conduta, Exames e Tratamento
            </h4>
            <div style="font-size: 12px; color: #34495e; line-height: 1.4;">
                <p style="margin: 0 0 4px 0;"><strong>Conduta:</strong> ${conduta}</p>
                <p style="margin: 0 0 4px 0;"><strong>Exames:</strong> ${exames}</p>
                <p style="margin: 0;"><strong>Tratamento:</strong> ${tratamento}</p>
            </div>
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
    const { l: L, m: M, s: S } = ref;
    let z = L === 0 ? Math.log(est / M) / S : (Math.pow(est / M, L) - 1) / (L * S);
    return Math.min(Math.max(zParaPercentil(z), 5), 95);
}

function zParaPercentil(z) {
    let sign = (z < 0) ? -1 : 1;
    let x = Math.abs(z) / Math.sqrt(2);
    let t = 1.0 / (1.0 + 0.3275911 * x);
    let a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429;
    let erf = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return 0.5 * (1.0 + sign * erf) * 100;
}
