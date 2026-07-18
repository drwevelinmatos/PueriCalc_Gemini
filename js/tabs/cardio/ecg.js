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
                    margin: 0; 
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

            <button id="btn-calcular-ecg" style="width: 100%; padding: 14px; border: none; border-radius: 6px; font-weight: bold; font-size: 15px; cursor: pointer; background-color: var(--azul, #2563eb); color: white;
