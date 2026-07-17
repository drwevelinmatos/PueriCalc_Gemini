// tabs/cardio/ecg.js

export function initECGCard() {
    const slot = document.getElementById('cardio-ecg-slot');
    if (!slot) return;

    // 1. Injeção Segura da Interface (DOM)
    slot.innerHTML = `
        <div class="w-full bg-white p-4 md:p-6 rounded-xl border border-gray-100" style="margin-top: 20px;">
            <h2 class="text-xl font-extrabold mb-4 pb-2 border-b border-gray-100" style="color: var(--azul, #1e3a8a);">Análise Avançada de ECG Pediátrico</h2>
            
            <div class="p-4 rounded-lg mb-4" style="background-color: #f8fafc; border: 1px solid #e2e8f0;">
                <h3 class="font-bold text-xs uppercase mb-3 tracking-wider" style="color: #475569;">1. Dados Cronológicos do Paciente</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px;">
                    <div style="grid-column: span 2;">
                        <label class="block text-[11px] font-bold uppercase mb-1" style="color: #475569;">Nome do Paciente</label>
                        <input type="text" id="ecg_nome" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 14px;" placeholder="Nome completo">
                    </div>
                    <div>
                        <label class="block text-[11px] font-bold uppercase mb-1" style="color: #475569;">Anos</label>
                        <input type="number" id="ecg_anos" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 14px;" value="0" min="0">
                    </div>
                    <div>
                        <label class="block text-[11px] font-bold uppercase mb-1" style="color: #475569;">Meses</label>
                        <input type="number" id="ecg_meses" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 14px;" value="0" min="0" max="11">
                    </div>
                    <div>
                        <label class="block text-[11px] font-bold uppercase mb-1" style="color: #475569;">Dias</label>
                        <input type="number" id="ecg_dias" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 14px;" value="0" min="0" max="31">
                    </div>
                </div>
            </div>

            <div class="p-4 rounded-lg mb-6" style="background-color: #eff6ff; border: 1px solid #bfdbfe;">
                <h3 class="font-bold text-xs uppercase mb-3 tracking-wider" style="color: var(--azul, #1e3a8a);">2. Vetorcardiografia e Intervalos</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                    
                    <div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0;">
                        <h4 class="font-semibold text-xs mb-2" style="color: #334155;">QRS Resultante (R-S)</h4>
                        <div style="display: flex; gap: 8px;">
                            <div style="flex: 1;">
                                <label style="font-size: 10px; font-weight: bold; color: #64748b; display: block; margin-bottom: 4px;">D1</label>
                                <input type="number" id="ecg_qrs_d1" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 14px;" placeholder="Ex: 5">
                            </div>
                            <div style="flex: 1;">
                                <label style="font-size: 10px; font-weight: bold; color: #64748b; display: block; margin-bottom: 4px;">aVF</label>
                                <input type="number" id="ecg_qrs_avf" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 14px;" placeholder="Ex: 4">
                            </div>
                        </div>
                    </div>

                    <div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0;">
                        <h4 class="font-semibold text-xs mb-2" style="color: #334155;">Onda P Resultante</h4>
                        <div style="display: flex; gap: 8px;">
                            <div style="flex: 1;">
                                <label style="font-size: 10px; font-weight: bold; color: #64748b; display: block; margin-bottom: 4px;">D1</label>
                                <input type="number" id="ecg_p_d1" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 14px;" placeholder="Ex: 1">
                            </div>
                            <div style="flex: 1;">
                                <label style="font-size: 10px; font-weight: bold; color: #64748b; display: block; margin-bottom: 4px;">aVF</label>
                                <input type="number" id="ecg_p_avf" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 14px;" placeholder="Ex: 1">
                            </div>
                        </div>
                    </div>

                    <div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0;">
                        <h4 class="font-semibold text-xs mb-2" style="color: #334155;">Intervalos Temporais</h4>
                        <div style="display: flex; gap: 8px;">
                            <div style="flex: 1;">
                                <label style="font-size: 10px; font-weight: bold; color: #64748b; display: block; margin-bottom: 4px;">R-R</label>
                                <input type="number" id="ecg_rr" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 14px;" placeholder="Ex: 15">
                            </div>
                            <div style="flex: 1;">
                                <label style="font-size: 10px; font-weight: bold; color: #64748b; display: block; margin-bottom: 4px;">PR</label>
                                <input type="number" id="ecg_pr" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 14px;" placeholder="Ex: 3">
                            </div>
                            <div style="flex: 1;">
                                <label style="font-size: 10px; font-weight: bold; color: #64748b; display: block; margin-bottom: 4px;">QT</label>
                                <input type="number" id="ecg_qt" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 14px;" placeholder="Ex: 8">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <button id="btn-calcular-ecg" style="width: 100%; padding: 12px; border: none; border-radius: 6px; font-weight: bold; font-size: 14px; cursor: pointer; background-color: var(--azul, #2563eb); color: white;">
                Processar Vetores e Gerar Laudo Cardio
            </button>

            <div id="ecg_resultado" style="display: none; margin-top: 24px;">
                <div style="border: 1px solid #cbd5e1; padding: 24px; border-radius: 8px; background-color: #f8fafc;">
                    <h2 style="font-size: 18px; font-weight: bold; text-align: center; margin-bottom: 16px; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px; text-transform: uppercase;">Laudo do Exame de ECG</h2>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px; font-size: 14px;">
                        <p><strong>Paciente:</strong> <span id="ecg_out_nome"></span></p>
                        <p><strong>Idade:</strong> <span id="ecg_out_idade"></span> (<span id="ecg_out_dias"></span> dias)</p>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; font-size: 14px;">
                        <div style="background: white; padding: 12px; border-radius: 4px; border: 1px solid #e2e8f0;">
                            <h3 style="font-weight: bold; font-size: 11px; text-transform: uppercase; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">Resultados Vetoriais</h3>
                            <p style="margin-bottom: 4px;"><strong>Ritmo:</strong> <span id="ecg_out_ritmo"></span></p>
                            <p style="margin-bottom: 4px;"><strong>SÂP (Eixo P):</strong> <span id="ecg_out_sap"></span>°</p>
                            <p><strong>SÂQRS (Eixo QRS):</strong> <span id="ecg_out_saqrs"></span>°</p>
                        </div>
                        <div style="background: white; padding: 12px; border-radius: 4px; border: 1px solid #e2e8f0;">
                            <h3 style="font-weight: bold; font-size: 11px; text-transform: uppercase; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">Métricas Temporais</h3>
                            <p style="margin-bottom: 4px;"><strong>Frequência Cardíaca:</strong> <span id="ecg_out_fc"></span> bpm</p>
                            <p style="margin-bottom: 4px;"><strong>Intervalo PR:</strong> <span id="ecg_out_pr"></span> ms</p>
                            <p><strong>QT / QTc (Bazett):</strong> <span id="ecg_out_qt"></span> ms / <span id="ecg_out_qtc"></span> ms</p>
                        </div>
                    </div>

                    <div style="background-color: #fefce8; padding: 16px; border-radius: 6px; border: 1px solid #fef08a; margin-bottom: 16px; font-size: 14px;">
                        <h3 style="font-weight: bold; color: #713f12; margin-bottom: 8px;">Análise Comparativa (<span id="ecg_out_ref_nome"></span>)</h3>
                        <ul id="ecg_lista_alertas" style="padding-left: 20px; margin: 0; line-height: 1.5;"></ul>
                    </div>

                    <div style="background-color: #eff6ff; padding: 16px; border-radius: 6px; border: 1px solid #bfdbfe; font-size: 14px;">
                        <h3 style="font-weight: bold; color: #1e3a8a;">Conclusão Médica Sugerida:</h3>
                        <p id="ecg_out_conclusao" style="color: #172554; margin-top: 4px; font-weight: 600;"></p>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 2. Ancoragem de Eventos e Lógica (Agora rodando 100% seguro no módulo)
    const btnCalcular = document.getElementById('btn-calcular-ecg');
    if (btnCalcular) {
        btnCalcular.addEventListener('click', calcularECGModulo);
    }
}

// ==========================================
// BANCO DE DADOS E LÓGICA DE NEGÓCIO PEDIÁTRICA
// ==========================================

const ECG_DAVIGNON = [
    { minDias: 0, maxDias: 30, fc: [110, 150], pr: [80, 160], qrs: [40, 80], qtc: 460 },
    { minDias: 31, maxDias: 90, fc: [115, 160], pr: [80, 150], qrs: [40, 80], qtc: 460 },
    { minDias: 91, maxDias: 180, fc: [110, 150], pr: [80, 150], qrs: [40, 80], qtc: 450 },
    { minDias: 181, maxDias: 365, fc: [100, 150], pr: [80, 160], qrs: [40, 80], qtc: 450 },
    { minDias: 366, maxDias: 1095, fc: [90, 130], pr: [90, 160], qrs: [40, 80], qtc: 440 },    // 1 a 3 anos
    { minDias: 1096, maxDias: 1825, fc: [80, 120], pr: [100, 170], qrs: [40, 80], qtc: 440 },   // 3 a 5 anos
    { minDias: 1826, maxDias: 2920, fc: [70, 110], pr: [100, 170], qrs: [40, 80], qtc: 440 },   // 5 a 8 anos
    { minDias: 2921, maxDias: 4380, fc: [60, 100], pr: [110, 180], qrs: [40, 90], qtc: 440 },   // 8 a 12 anos
    { minDias: 4381, maxDias: 5840, fc: [60, 100], pr: [110, 180], qrs: [40, 90], qtc: 440 }    // 12 a 16 anos
];

const ECG_SBC_ADULTO = { fc: [50, 100], pr: [120, 200], qrs: [60, 100], qtc: 450 };

function ecgCalcularEixoQRS(d1, avf) {
    let rad = Math.atan2(avf, d1);
    let graus = rad * (180 / Math.PI);
    return Math.round(graus > 180 ? graus - 360 : graus);
}

function ecgCalcularEixoP(d1, avf) {
    let rad = Math.atan2(avf, d1);
    let graus = rad * (180 / Math.PI);
    return Math.round((graus + 360) % 360);
}

function calcularECGModulo() {
    let anos = parseInt(document.getElementById('ecg_anos').value) || 0;
    let meses = parseInt(document.getElementById('ecg_meses').value) || 0;
    let dias = parseInt(document.getElementById('ecg_dias').value) || 0;
    
    // Cálculo em dias totais
    let totalDias = Math.floor((anos * 365.25) + (meses * 30.4375) + dias);
    let isPediatrico = totalDias <= 5840;

    let qrs_d1 = parseFloat(document.getElementById('ecg_qrs_d1').value);
    let qrs_avf = parseFloat(document.getElementById('ecg_qrs_avf').value);
    let p_d1 = parseFloat(document.getElementById('ecg_p_d1').value);
    let p_avf = parseFloat(document.getElementById('ecg_p_avf').value);
    let rr = parseFloat(document.getElementById('ecg_rr').value);
    let pr = parseFloat(document.getElementById('ecg_pr').value);
    let qt = parseFloat(document.getElementById('ecg_qt').value);

    if (isNaN(rr) || isNaN(qrs_d1) || isNaN(qrs_avf) || isNaN(p_d1) || isNaN(p_avf)) {
        alert('Aba ECG: Preencha os vetores (D1/aVF) e o intervalo R-R para realizar a análise.');
        return;
    }

    // Fórmulas
    let fc = Math.round(1500 / rr);
    let pr_ms = pr * 40;
    let qt_ms = qt * 40;
    let rr_seg = rr * 0.04;
    let qtc = Math.round(qt_ms / Math.sqrt(rr_seg));
    
    let saqrs = ecgCalcularEixoQRS(qrs_d1, qrs_avf);
    let sap = ecgCalcularEixoP(p_d1, p_avf);
    let ritmo = (sap >= 0 && sap <= 90) ? "Sinusal" : "Não Sinusal";

    let ref = isPediatrico ? ECG_DAVIGNON.find(d => totalDias >= d.minDias && totalDias <= d.maxDias) || ECG_DAVIGNON[ECG_DAVIGNON.length - 1] : ECG_SBC_ADULTO;
    let refNome = isPediatrico ? "Tabela de Davignon" : "Diretrizes SBC (Adulto)";

    let alertas = [];
    let isNormal = true;

    // SÂQRS Frontal
    if (saqrs >= -30 && saqrs <= 90) { alertas.push(`SÂQRS: ${saqrs}° (Eixo Frontal Normal)`); }
    else if (saqrs > 90 && saqrs <= 180) { alertas.push(`SÂQRS: ${saqrs}° (Desvio do Eixo para a Direita)`); isNormal = false; }
    else if (saqrs >= -90 && saqrs < -30) { alertas.push(`SÂQRS: ${saqrs}° (Desvio do Eixo para a Esquerda)`); isNormal = false; }
    else { alertas.push(`SÂQRS: ${saqrs}° (Desvio Indeterminado/Extremo)`); isNormal = false; }

    // Frequência Cardíaca
    if (fc < ref.fc[0]) { alertas.push(`FC: ${fc} bpm (Bradicardia para a faixa etária. Ref: ${ref.fc[0]}-${ref.fc[1]} bpm)`); isNormal = false; }
    else if (fc > ref.fc[1]) { alertas.push(`FC: ${fc} bpm (Taquicardia para a faixa etária. Ref: ${ref.fc[0]}-${ref.fc[1]} bpm)`); isNormal = false; }
    else { alertas.push(`FC: ${fc} bpm (Normal para a idade em dias. Ref: ${ref.fc[0]}-${ref.fc[1]} bpm)`); }

    // PR
    if (!isNaN(pr)) {
        if (pr_ms < ref.pr[0]) { alertas.push(`Intervalo PR: ${pr_ms} ms (PR Curto / Condução Acelerada. Ref: ${ref.pr[0]}-${ref.pr[1]} ms)`); isNormal = false; }
        else if (pr_ms > ref.pr[1]) { alertas.push(`Intervalo PR: ${pr_ms} ms (PR Longo / Sugestivo de BAV 1º Grau. Ref: ${ref.pr[0]}-${ref.pr[1]} ms)`); isNormal = false; }
        else { alertas.push(`Intervalo PR: ${pr_ms} ms (Condução AV Normal. Ref: ${ref.pr[0]}-${ref.pr[1]} ms)`); }
    }

    // QTc
    if (!isNaN(qt)) {
        if (qtc > ref.qtc) { alertas.push(`QTc (Bazett): ${qtc} ms (Intervalo QT Prolongado. Limite máximo: ${ref.qtc} ms)`); isNormal = false; }
        else { alertas.push(`QTc (Bazett): ${qtc} ms (Repolarização Ventricular Normal dentro do limite de ${ref.qtc} ms)`); }
    }

    // Ritmo
    if (ritmo !== "Sinusal") { alertas.push(`Ritmo Não Sinusal (Eixo de P fora do quadrante inferior esquerdo: ${sap}°)`); isNormal = false; }
    else { alertas.push(`Ritmo Sinusal Confirmado (SÂP em ${sap}°)`); }

    // Alimentação da UI
    document.getElementById('ecg_out_nome').innerText = document.getElementById('ecg_nome').value || "Não Especificado";
    document.getElementById('ecg_out_idade').innerText = `${anos}a, ${meses}m, ${dias}d`;
    document.getElementById('ecg_out_dias').innerText = totalDias;
    document.getElementById('ecg_out_ritmo').innerText = ritmo;
    document.getElementById('ecg_out_sap').innerText = sap;
    document.getElementById('ecg_out_saqrs').innerText = saqrs;
    document.getElementById('ecg_out_fc').innerText = fc;
    document.getElementById('ecg_out_pr').innerText = isNaN(pr) ? "--" : pr_ms;
    document.getElementById('ecg_out_qt').innerText = isNaN(qt) ? "--" : qt_ms;
    document.getElementById('ecg_out_qtc').innerText = isNaN(qt) ? "--" : qtc;
    document.getElementById('ecg_out_ref_nome').innerText = refNome;

    let lista = document.getElementById('ecg_lista_alertas');
    lista.innerHTML = "";
    alertas.forEach(a => {
        let li = document.createElement('li');
        li.innerText = a;
        li.style.color = (a.includes("Normal") || a.includes("Confirmado") || a.includes("dentro do limite")) ? "#15803d" : "#dc2626"; // Verde Escuro vs Vermelho
        li.style.fontWeight = (a.includes("Normal") || a.includes("Confirmado") || a.includes("dentro do limite")) ? "500" : "bold";
        li.style.marginBottom = "4px";
        lista.appendChild(li);
    });

    document.getElementById('ecg_out_conclusao').innerText = isNormal ? "Eletrocardiograma dentro dos padrões fisiológicos de normalidade para a cronologia do paciente." : "Eletrocardiograma apresentando alterações vetoriais ou cronotrópicas listadas acima. Proceder com correlação clínica.";
    
    document.getElementById('ecg_resultado').style.display = 'block';
}
