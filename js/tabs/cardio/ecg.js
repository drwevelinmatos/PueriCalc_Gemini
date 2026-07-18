// tabs/cardio/ecg.js

export function initECGCard() {
    const slot = document.getElementById('cardio-ecg-slot');
    if (!slot) return;

    // 1. Injeção da Interface de Entrada (no-print)
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
                    padding: 0 !important; /* Layout controlado internamente */
                    box-sizing: border-box;
                    background: white !important;
                    border: none !important;
                    box-shadow: none !important;
                    overflow: hidden; /* Evita quebra de página indesejada */
                }
                .no-print { display: none !important; }
            }
        </style>

        <div class="w-full bg-white p-4 md:p-6 rounded-xl border border-gray-100 no-print" style="margin-top: 20px;">
            <h2 class="text-xl font-extrabold mb-4 pb-2 border-b border-gray-100" style="color: var(--azul, #1e3a8a);">Eletrocardiograma - Emissão com Timbre Digital</h2>
            
            <button id="btn-calcular-ecg" style="width: 100%; padding: 14px; border: none; border-radius: 6px; font-weight: bold; font-size: 15px; cursor: pointer; background-color: var(--azul, #2563eb); color: white; transition: 0.2s;">
                Gerar Laudo Pediátrico Timbrado
            </button>
        </div>

        <div id="ecg_resultado_container" style="display: none; margin-top: 24px; display: flex; flex-direction: column; align-items: center;">
            
            <div id="ecg-print-area" style="background: white; border: 1px solid #cbd5e1; border-radius: 4px; width: 100%; max-width: 148mm; min-height: 210mm; position: relative; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); font-family: 'Arial', sans-serif; color: #000; line-height: 1.5; box-sizing: border-box;">
                
                <div style="position: absolute; top: 10mm; left: 0; width: 100%; text-align: center;">
                    <img src="Receituário A5_cabeçalho.ai.png" style="max-width: 80%; height: auto; display: inline-block;">
                </div>

                <div style="position: absolute; bottom: 10mm; left: 0; width: 100%; text-align: center;">
                    <img src="Receituário A5_rodapé.ai.png" style="max-width: 90%; height: auto; display: inline-block;">
                </div>

                <div style="position: absolute; top: 50%; right: 10mm; transform: translateY(-50%); opacity: 0.15; pointer-events: none; text-align: right;">
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
                </div>
        </div>
    `;

    document.getElementById('ecg_resultado_container').style.display = 'none';
    document.getElementById('btn-calcular-ecg')?.addEventListener('click', ecgSintetizarLaudo);
    // (As vinculações dos outros botões e a lógica de cálculo permanecem as mesmas da Turn 5...)
}
