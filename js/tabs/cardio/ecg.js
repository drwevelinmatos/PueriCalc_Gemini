// tabs/cardio/ecg.js

export function initECGCard() {
    const slot = document.getElementById('cardio-ecg-slot');
    if (!slot) return;

    // 1. Injeção Segura da Interface Principal (Input)
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

            <button id="btn-calcular-ecg" style="width: 100%; padding: 12px; border: none; border-radius: 6px; font-weight: bold; font-size: 14px; cursor: pointer; background-color: var(--azul, #2563eb); color: white; transition: 0.2s;">
                Gerar Laudo Clínico
            </button>

            <div id="ecg_resultado_container" style="display: none; margin-top: 24px;"></div>
        </div>
    `;

    document.getElementById('btn-calcular-ecg')?.addEventListener('click', ecgSintetizarLaudo);
}

// ==========================================
// BANCO DE DADOS E LÓGICA DE NEGÓCIO
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

function ecgSintetizarLaudo() {
    let nome = document.getElementById('ecg_nome').value || "Não informado";
    let anos = parseInt(document.getElementById('ecg_anos').value) || 0;
    let meses = parseInt(document.getElementById('ecg_meses').value) || 0;
    let dias = parseInt(document.getElementById('ecg_dias').value) || 0;
    let idadeStr = `${anos} anos, ${meses} meses e ${dias} dias`;
    
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
        alert('Por favor, preencha as derivações e o intervalo R-R.');
        return;
    }

    // Cálculos
    let fc = Math.round(1500 / rr);
    let saqrs = ecgCalcularEixoQRS(qrs_d1, qrs_avf);
    let sap = ecgCalcularEixoP(p_d1, p_avf);
    
    let pr_ms = !isNaN(pr) ? pr * 40 : null;
    let qt_ms = !isNaN(qt) ? qt * 40 : null;
    let qtc = !isNaN(qt) ? Math.round(qt_ms / Math.sqrt(rr * 0.04)) : null;

    let ref = isPediatrico ? (ECG_DAVIGNON.find(d => totalDias >= d.minDias && totalDias <= d.maxDias) || ECG_DAVIGNON[ECG_DAVIGNON.length - 1]) : ECG_SBC_ADULTO;
    let refNome = isPediatrico ? "Tabela de Davignon" : "Diretrizes SBC (Adulto)";

    let isNormal = true;

    // Redação: Ritmo e FC
    let isRitmoSinusal = (sap >= 0 && sap <= 90);
    let isFcNormal = (fc >= ref.fc[0] && fc <= ref.fc[1]);
    let textoRitmo = `Ritmo ${isRitmoSinusal ? 'sinusal' : 'não sinusal'}, com frequência cardíaca de ${fc} bpm`;
    if (!isFcNormal) {
        textoRitmo += fc < ref.fc[0] ? ' (bradicardia para a idade)' : ' (taquicardia para a idade)';
        isNormal = false;
    }
    textoRitmo += ';';

    // Redação: Onda P
    let textoP = isRitmoSinusal 
        ? `Onda P de morfologia, duração e amplitude normais. SÂP a ${sap}°;` 
        : `Onda P com eixo fora do quadrante normal. SÂP a ${sap}°;`;
    if (!isRitmoSinusal) isNormal = false;

    // Redação: PR
    let textoPR = "";
    if (pr_ms) {
        if (pr_ms >= ref.pr[0] && pr_ms <= ref.pr[1]) {
            textoPR = `Intervalo PR normal, medindo ${pr_ms} ms;`;
        } else if (pr_ms < ref.pr[0]) {
            textoPR = `Intervalo PR curto (condução acelerada), medindo ${pr_ms} ms;`;
            isNormal = false;
        } else {
            textoPR = `Intervalo PR prolongado (sugestivo de BAV), medindo ${pr_ms} ms;`;
            isNormal = false;
        }
    }

    // Redação: QRS
    let isQrsNormal = (saqrs >= -30 && saqrs <= 90);
    let textoQRS = isQrsNormal 
        ? `Complexo QRS de duração, amplitude e morfologias normais. SÂQRS a ${saqrs}°;`
        : `Complexo QRS com desvio de eixo frontal. SÂQRS a ${saqrs}°;`;
    if (!isQrsNormal) isNormal = false;

    // Redação: QTc
    let textoQTc = "";
    if (qtc) {
        if (qtc <= ref.qtc) {
            textoQTc = `Repolarização ventricular normal, com QTc (Bazett) de ${qtc} ms.`;
        } else {
            textoQTc = `Repolarização ventricular com intervalo prolongado, com QTc (Bazett) de ${qtc} ms.`;
            isNormal = false;
        }
    }

    // Redação: Conclusão
    let textoConclusao = isNormal 
        ? `Eletrocardiograma dentro dos padrões fisiológicos de normalidade para a cronologia do paciente.`
        : `Eletrocardiograma apresentando as alterações descritas acima. Correlacionar com dados clínicos.`;

    // Monta o texto puro para o Clipboard
    let laudoTextoPuro = `${textoRitmo}\n${textoP}\n${textoPR}\n${textoQRS}\n${textoQTc}\n\n${textoConclusao}`.replace(/\n\n\n/g, '\n\n').trim();

    // Renderiza a Interface Exata da Imagem
    const container = document.getElementById('ecg_resultado_container');
    container.innerHTML = `
        <div style="border: 1px solid #cbd5e1; border-radius: 8px; background-color: #f8fafc; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            
            <h2 style="color: #1e293b; font-weight: 800; font-size: 18px; text-align: center; margin-bottom: 8px; letter-spacing: 0.5px;">LAUDO DE ELETROCARDIOGRAMA</h2>
            
            <p style="text-align: center; color: #475569; font-size: 14px; margin-bottom: 24px; font-weight: 500;">
                Paciente: <span style="font-weight: 700; color: #0f172a;">${nome}</span> | Idade: <span style="font-weight: 700; color: #0f172a;">${idadeStr}</span>
            </p>
            
            <div id="texto-laudo-render" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; text-align: center; color: #334155; font-size: 15px; line-height: 1.8; margin-bottom: 24px;">
                <p style="margin: 0;">${textoRitmo}</p>
                <p style="margin: 0;">${textoP}</p>
                ${textoPR ? `<p style="margin: 0;">${textoPR}</p>` : ''}
                <p style="margin: 0;">${textoQRS}</p>
                ${textoQTc ? `<p style="margin: 0;">${textoQTc}</p>` : ''}
                <p style="margin: 20px 0 0 0; font-weight: 600; color: #0f172a;">${textoConclusao}</p>
            </div>

            <div style="display: flex; justify-content: center; gap: 16px; margin-bottom: 16px; flex-wrap: wrap;">
                <button id="btn-copiar-ecg" style="background-color: #3b82f6; color: white; padding: 10px 20px; border: none; border-radius: 6px; font-weight: 600; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.2s;">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
                    Copiar Laudo
                </button>
                <button id="btn-limpar-ecg" style="background-color: #ef4444; color: white; padding: 10px 20px; border: none; border-radius: 6px; font-weight: 600; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.2s;">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>
                    Limpar Formulário
                </button>
            </div>

            <p style="text-align: center; color: #94a3b8; font-size: 12px; margin: 0;">Tabela de Referência: ${refNome}</p>
        </div>
    `;

    container.style.display = 'block';

    // Ancorar Ações dos Botões Novos
    document.getElementById('btn-copiar-ecg').addEventListener('click', () => {
        navigator.clipboard.writeText(laudoTextoPuro).then(() => {
            const btn = document.getElementById('btn-copiar-ecg');
            btn.innerHTML = `✅ Copiado!`;
            btn.style.backgroundColor = '#16a34a'; // Fica verde
            setTimeout(() => {
                btn.innerHTML = `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg> Copiar Laudo`;
                btn.style.backgroundColor = '#3b82f6'; // Volta a cor azul
            }, 2000);
        });
    });

    document.getElementById('btn-limpar-ecg').addEventListener('click', () => {
        document.getElementById('ecg_nome').value = '';
        document.getElementById('ecg_anos').value = '0';
        document.getElementById('ecg_meses').value = '0';
        document.getElementById('ecg_dias').value = '0';
        document.getElementById('ecg_qrs_d1').value = '';
        document.getElementById('ecg_qrs_avf').value = '';
        document.getElementById('ecg_p_d1').value = '';
        document.getElementById('ecg_p_avf').value = '';
        document.getElementById('ecg_rr').value = '';
        document.getElementById('ecg_pr').value = '';
        document.getElementById('ecg_qt').value = '';
        container.style.display = 'none';
        container.innerHTML = '';
        document.getElementById('ecg_nome').focus();
    });
}
