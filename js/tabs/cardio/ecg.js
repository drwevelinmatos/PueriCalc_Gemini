// tabs/cardio/ecg.js

export function initECGCard() {
    const slot = document.getElementById('cardio-ecg-slot');
    if (!slot) return;

    // 1. INJEÇÃO DA INTERFACE COMPLETA E DO CSS DE IMPRESSÃO
    slot.innerHTML = `
        <style>
            /* ESTILOS PARA COMPOSIÇÃO E IMPRESSÃO DO LAUDO TIMBRADO DIGITALMENTE */
            @media print {
                @page {
                    size: A5 portrait;
                    margin: 0; /* Remove margens do navegador */
                }
                body * { visibility: hidden; }
                #ecg-print-area, #ecg-print-area * { visibility: visible; }
                
                #ecg-print-area {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 148mm;
                    height: 210mm;
                    margin: 0;
                    padding: 0 !important;
                    box-sizing: border-box;
                    background: white !important;
                    border: none !important;
                    box-shadow: none !important;
                    overflow: hidden;
                }
                .no-print { display: none !important; }
            }
        </style>

        <div class="w-full bg-white p-4 md:p-6 rounded-xl border border-gray-100 no-print" style="margin-top: 20px;">
            <h2 class="text-xl font-extrabold mb-4 pb-2 border-b border-gray-100" style="color: var(--azul, #1e3a8a);">Eletrocardiograma - Emissão com Timbre Digital</h2>
            
            <div class="p-4 rounded-lg mb-4" style="background-color: #f8fafc; border: 1px solid #e2e8f0;">
                <h3 class="font-bold text-xs uppercase mb-3 tracking-wider" style="color: #475569;">1. Identificação</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px; margin-bottom: 12px;">
                    <div style="grid-column: span 2;">
                        <label class="block text-[11px] font-bold uppercase mb-1" style="color: #475569;">Nome do Paciente</label>
                        <input type="text" id="ecg_nome" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 14px;" placeholder="Nome">
                    </div>
                    <div>
                        <label class="block text-[11px] font-bold uppercase mb-1" style="color: #475569;">Sexo</label>
                        <select id="ecg_sexo" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 14px;">
                            <option value="Masculino">Masculino</option>
                            <option value="Feminino">Feminino</option>
                        </select>
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
                <div style="display: grid; grid-template-columns: 1fr 1fr 2fr; gap: 12px;">
                    <div>
                        <label class="block text-[11px] font-bold uppercase mb-1" style="color: #475569;">Peso (kg)</label>
                        <input type="number" id="ecg_peso" step="0.1" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 14px;" placeholder="Ex: 32.5">
                    </div>
                    <div>
                        <label class="block text-[11px] font-bold uppercase mb-1" style="color: #475569;">Altura (cm)</label>
                        <input type="number" id="ecg_altura" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 14px;" placeholder="Ex: 140">
                    </div>
                    <div>
                        <label class="block text-[11px] font-bold uppercase mb-1" style="color: #475569;">Indicação</label>
                        <input type="text" id="ecg_indicacao" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 14px;" placeholder="Ex: Avaliação pré-operatória">
                    </div>
                </div>
            </div>

            <div class="p-4 rounded-lg mb-4" style="background-color: #eff6ff; border: 1px solid #bfdbfe;">
                <h3 class="font-bold text-xs uppercase mb-3 tracking-wider" style="color: var(--azul, #1e3a8a);">2. Eixos e Medidas (Quadradinhos)</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px;">
                    <div style="background: white; padding: 10px; border-radius: 6px; border: 1px solid #e2e8f0;">
                        <h4 class="font-semibold text-[11px] mb-2 uppercase" style="color: #334155;">Eixo QRS</h4>
                        <div style="display: flex; gap: 8px;">
                            <input type="number" id="ecg_qrs_d1" style="width: 50%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 13px;" placeholder="D1">
                            <input type="number" id="ecg_qrs_avf" style="width: 50%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 13px;" placeholder="aVF">
                        </div>
                    </div>
                    <div style="background: white; padding: 10px; border-radius: 6px; border: 1px solid #e2e8f0;">
                        <h4 class="font-semibold text-[11px] mb-2 uppercase" style="color: #334155;">Eixo P</h4>
                        <div style="display: flex; gap: 8px;">
                            <input type="number" id="ecg_p_d1" style="width: 50%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 13px;" placeholder="D1">
                            <input type="number" id="ecg_p_avf" style="width: 50%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 13px;" placeholder="aVF">
                        </div>
                    </div>
                    <div style="background: white; padding: 10px; border-radius: 6px; border: 1px solid #e2e8f0; grid-column: span 2;">
                        <h4 class="font-semibold text-[11px] mb-2 uppercase" style="color: #334155;">Intervalos</h4>
                        <div style="display: flex; gap: 8px;">
                            <input type="number" id="ecg_rr" style="flex: 1; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 13px;" placeholder="R-R">
                            <input type="number" id="ecg_pr" style="flex: 1; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 13px;" placeholder="PR">
                            <input type="number" id="ecg_qrs_dur" style="flex: 1; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 13px;" placeholder="QRS">
                            <input type="number" id="ecg_qt" style="flex: 1; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 13px;" placeholder="QT">
                        </div>
                    </div>
                </div>
            </div>

            <div class="p-4 rounded-lg mb-6" style="background-color: #fefce8; border: 1px solid #fef08a;">
                <h3 class="font-bold text-xs uppercase mb-3 tracking-wider" style="color: #854d0e;">3. Sobrecargas e Condução (Opcional)</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
                    <div>
                        <label class="block text-[11px] font-bold uppercase mb-1" style="color: #854d0e;">Sobrecarga Atrial</label>
                        <input type="text" id="ecg_sobre_atrial" style="width: 100%; padding: 8px; border: 1px solid #fde047; border-radius: 4px; font-size: 13px;" placeholder="Ex: Ausente">
                    </div>
                    <div>
                        <label class="block text-[11px] font-bold uppercase mb-1" style="color: #854d0e;">Sobrecarga Ventricular</label>
                        <input type="text" id="ecg_sobre_vent" style="width: 100%; padding: 8px; border: 1px solid #fde047; border-radius: 4px; font-size: 13px;" placeholder="Ex: Ausente">
                    </div>
                    <div>
                        <label class="block text-[11px] font-bold uppercase mb-1" style="color: #854d0e;">Condução Intraventricular</label>
                        <input type="text" id="ecg_cond_intra" style="width: 100%; padding: 8px; border: 1px solid #fde047; border-radius: 4px; font-size: 13px;" placeholder="Ex: Normal">
                    </div>
                </div>
            </div>

            <button id="btn-calcular-ecg" style="width: 100%; padding: 14px; border: none; border-radius: 6px; font-weight: bold; font-size: 15px; cursor: pointer; background-color: var(--azul, #2563eb); color: white; transition: 0.2s;">
                Gerar Laudo Pediátrico Timbrado
            </button>
        </div>

        <div id="ecg_resultado_container" style="display: none; margin-top: 24px; display: flex; flex-direction: column; align-items: center;">
            
            <div id="ecg-print-area" style="background: white; border: 1px solid #cbd5e1; border-radius: 4px; width: 100%; max-width: 148mm; min-height: 210mm; position: relative; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); font-family: 'Arial', sans-serif; color: #000; line-height: 1.5; box-sizing: border-box;">
                
                <div style="position: absolute; top: 10mm; left: 0; width: 100%; text-align: center; z-index: 1;">
                    <img src="Receituário A5_cabeçalho.ai.png" style="max-width: 80%; height: auto; display: inline-block;">
                </div>

                <div style="position: absolute; bottom: 10mm; left: 0; width: 100%; text-align: center; z-index: 1;">
                    <img src="Receituário A5_rodapé.ai.png" style="max-width: 90%; height: auto; display: inline-block;">
                </div>

                <div style="position: absolute; top: 50%; right: 10mm; transform: translateY(-50%); opacity: 0.15; pointer-events: none; text-align: right; z-index: 2;">
                    <img src="Receituário A5_marca dagua transp.ai.png" style="max-width: 120mm; height: auto;">
                </div>

                <div style="position: relative; padding: 45mm 15mm 30mm 15mm; z-index: 10; font-size: 13px;">
                    <h1 style="text-align: center; font-size: 15px; font-weight: bold; margin-bottom: 20px; letter-spacing: 1px; text-decoration: underline;">ELETROCARDIOGRAMA</h1>
                    
                    <div id="a5-content">
                        </div>
                </div>
            </div>

            <div class="no-print" style="display: flex; justify-content: center; gap: 16px; margin-top: 24px; flex-wrap: wrap; width: 100%;">
                <button id="btn-imprimir-ecg" style="background-color: #475569; color: white; padding: 10px 20px; border: none; border-radius: 6px; font-weight: 600; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                    🖨️ Imprimir/Gerar PDF
                </button>
                <button id="btn-copiar-ecg" style="background-color: #3b82f6; color: white; padding: 10px 20px; border: none; border-radius: 6px; font-weight: 600; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                    📋 Copiar Texto
                </button>
                <button id="btn-limpar-ecg" style="background-color: #ef4444; color: white; padding: 10px 20px; border: none; border-radius: 6px; font-weight: 600; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                    🗑️ Limpar
                </button>
            </div>
        </div>
    `;

    document.getElementById('ecg_resultado_container').style.display = 'none';
    document.getElementById('btn-calcular-ecg')?.addEventListener('click', ecgSintetizarLaudo);
}

// ==========================================
// BANCO DE DADOS DAVIGNON PEDIÁTRICO
// ==========================================
const ECG_DAVIGNON = [
    { minDias: 0, maxDias: 30, fc: [110, 150], pr: [80, 160], qrs: [40, 80], qtc: 460 },
    { minDias: 31, maxDias: 90, fc: [115, 160], pr: [80, 150], qrs: [40, 80], qtc: 460 },
    { minDias: 91, maxDias: 180, fc: [110, 150], pr: [80, 150], qrs: [40, 80], qtc: 450 },
    { minDias: 181, maxDias: 365, fc: [100, 150], pr: [80, 160], qrs: [40, 80], qtc: 450 },
    { minDias: 366, maxDias: 1095, fc: [90, 130], pr: [90, 160], qrs: [40, 80], qtc: 440 },
    { minDias: 1096, maxDias: 1825, fc: [80, 120], pr: [100, 170], qrs: [40, 80], qtc: 440 },
    { minDias: 1826, maxDias: 2920, fc: [70, 110], pr: [100, 170], qrs: [40, 80], qtc: 440 },
    { minDias: 2921, maxDias: 4380, fc: [60, 100], pr: [110, 180], qrs: [40, 90], qtc: 440 },
    { minDias: 4381, maxDias: 5840, fc: [60, 100], pr: [110, 180], qrs: [40, 90], qtc: 440 }
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
    // 1. Coleta de Variáveis
    let nome = document.getElementById('ecg_nome').value || "Não informado";
    let sexo = document.getElementById('ecg_sexo').value;
    let anos = parseInt(document.getElementById('ecg_anos').value) || 0;
    let meses = parseInt(document.getElementById('ecg_meses').value) || 0;
    let dias = parseInt(document.getElementById('ecg_dias').value) || 0;
    
    let peso = document.getElementById('ecg_peso').value || "—";
    let altura = document.getElementById('ecg_altura').value || "—";
    let indicacao = document.getElementById('ecg_indicacao').value || "Não informada";
    
    let sobAtrial = document.getElementById('ecg_sobre_atrial').value || "—";
    let sobVent = document.getElementById('ecg_sobre_vent').value || "—";
    let condIntra = document.getElementById('ecg_cond_intra').value || "—";

    let totalDias = Math.floor((anos * 365.25) + (meses * 30.4375) + dias);
    let isPediatrico = totalDias <= 5840;

    let qrs_d1 = parseFloat(document.getElementById('ecg_qrs_d1').value);
    let qrs_avf = parseFloat(document.getElementById('ecg_qrs_avf').value);
    let p_d1 = parseFloat(document.getElementById('ecg_p_d1').value);
    let p_avf = parseFloat(document.getElementById('ecg_p_avf').value);
    
    let rr = parseFloat(document.getElementById('ecg_rr').value);
    let pr = parseFloat(document.getElementById('ecg_pr').value);
    let qrs_dur = parseFloat(document.getElementById('ecg_qrs_dur').value);
    let qt = parseFloat(document.getElementById('ecg_qt').value);

    if (isNaN(rr) || isNaN(qrs_d1) || isNaN(qrs_avf) || isNaN(p_d1) || isNaN(p_avf)) {
        alert('Os eixos (D1/aVF) e o intervalo R-R são obrigatórios para a análise primária.');
        return;
    }

    // 2. Cálculos Clínicos
    let fc = Math.round(1500 / rr);
    let rr_seg = rr * 0.04;
    let pr_ms = !isNaN(pr) ? Math.round(pr * 40) : "—";
    let qrs_ms = !isNaN(qrs_dur) ? Math.round(qrs_dur * 40) : "—";
    let qt_ms = !isNaN(qt) ? Math.round(qt * 40) : null;
