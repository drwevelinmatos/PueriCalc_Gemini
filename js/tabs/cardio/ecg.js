// tabs/cardio/ecg.js
import { byId } from '../../utils/dom.js';

export function initECGCard() {
    const slot = byId('cardio-ecg-slot');
    if (!slot) return;

    slot.innerHTML = `
        <div class="card" style="border-left: 5px solid #c0392b;">
            <div class="card-header" style="border: none; padding-left: 0; margin-bottom: 5px;">
                <h2 style="color: #c0392b; margin-top: 0; font-size: 1.15rem;">Análise de ECG e Geração de Laudo</h2>
                <p style="font-size: 0.85rem; color: #5f7382; margin-top: 4px;">Preencha os valores diretos ou use a <strong>calculadora de quadradinhos (mm)</strong> para conversão automática (Vel: 25 mm/s).</p>
            </div>

            <div class="grid-3" style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px dashed #d8e2ea;">
                <div><label>Idade (Anos)</label><input type="number" id="ecg-anos" min="0" placeholder="Ex: 5"></div>
                <div><label>Meses</label><input type="number" id="ecg-meses" min="0" max="11" placeholder="Ex: 2"></div>
                <div><label>Dias</label><input type="number" id="ecg-dias" min="0" max="31" placeholder="Ex: 0"></div>
            </div>

            <div class="grid-2" style="margin-bottom: 10px;">
                <div>
                    <label>Ritmo <span style="color:red">*</span></label>
                    <select id="ecg-ritmo" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ccc;">
                        <option value="sinusal">Sinusal</option>
                        <option value="nao_sinusal">Não Sinusal / Arritmia</option>
                    </select>
                </div>
                <div>
                    <label>Frequência Cardíaca <span style="color:red">*</span></label>
                    <div style="display:flex; gap: 5px;">
                        <input type="number" id="ecg-rr-mm" placeholder="R-R (mm)" style="width: 50%; border-color: #e74c3c;" title="Conte os quadradinhos entre os R-R">
                        <input type="number" id="ecg-fc" placeholder="BPM" style="width: 50%; font-weight: bold; color: #c0392b; background: #fadbd8;">
                    </div>
                </div>
            </div>

            <div class="grid-3" style="margin-bottom: 10px;">
                <div><label>Ângulo QRS (Graus)</label><input type="number" id="ecg-eixo" placeholder="Ex: 60"></div>
                <div>
                    <label>Duração Onda P</label>
                    <div style="display:flex; gap: 5px;">
                        <input type="number" id="ecg-p-dur-mm" placeholder="mm" style="width: 40%; border-color: #3498db;">
                        <input type="number" id="ecg-p-dur" placeholder="ms" style="width: 60%; background: #ebf5fb;">
                    </div>
                </div>
                <div><label>Amplitude Onda P (mm)</label><input type="number" id="ecg-p-amp" step="0.1" placeholder="Ex: 1.5"></div>
            </div>

            <div class="grid-3" style="margin-bottom: 15px;">
                <div>
                    <label>Intervalo PR</label>
                    <div style="display:flex; gap: 5px;">
                        <input type="number" id="ecg-pr-mm" placeholder="mm" style="width: 40%; border-color: #3498db;">
                        <input type="number" id="ecg-pr" placeholder="ms" style="width: 60%; background: #ebf5fb;">
                    </div>
                </div>
                <div>
                    <label>Duração do QRS</label>
                    <div style="display:flex; gap: 5px;">
                        <input type="number" id="ecg-qrs-mm" placeholder="mm" style="width: 40%; border-color: #3498db;">
                        <input type="number" id="ecg-qrs" placeholder="ms" style="width: 60%; background: #ebf5fb;">
                    </div>
                </div>
                <div>
                    <label>Intervalo QT</label>
                    <div style="display:flex; gap: 5px;">
                        <input type="number" id="ecg-qt-mm" placeholder="QT med (mm)" style="width: 50%; border-color: #9b59b6;" title="QT Medido em quadradinhos">
                        <input type="number" id="ecg-qtc" placeholder="QTc (ms)" style="width: 50%; background: #f4ecf7; font-weight:bold;" title="Calculado automaticamente por Bazett">
                    </div>
                </div>
            </div>

            <div class="grid-2" style="margin-bottom: 20px; background: #f8fbfd; padding: 12px; border-radius: 8px; border: 1px solid #d8e2ea;">
                <div>
                    <label>Padrão RSR' em V1</label>
                    <select id="ecg-rsr" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ccc;">
                        <option value="ausente">Ausente</option>
                        <option value="presente">Presente</option>
                    </select>
                </div>
                <div>
                    <label>Ondas Q Patológicas</label>
                    <select id="ecg-q-pat" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ccc;">
                        <option value="ausente">Ausente</option>
                        <option value="presente">Presente (Necrose/Isquemia)</option>
                    </select>
                </div>
            </div>

            <button class="calc-btn" id="btn-calc-ecg" style="background: #c0392b;">Gerar Laudo Detalhado</button>
            <div id="res-ecg" class="result-box" style="display: none; background: #fffdf5; border-left: 5px solid #c0392b;"></div>
        </div>
    `;

    // ==========================================
    // ⚙️ MOTORES DE CÁLCULO AUTOMÁTICO
    // ==========================================
    
    // 1. Função genérica para duração (1 quadradinho = 40ms)
    const setupAutoCalc = (idMm, idMs) => {
        const inputMm = byId(idMm);
        const inputMs = byId(idMs);
        if(inputMm && inputMs) {
            inputMm.addEventListener('input', () => {
                const val = parseFloat(inputMm.value);
                if(!isNaN(val)) inputMs.value = Math.round(val * 40);
                else inputMs.value = '';
            });
        }
    };

    setupAutoCalc('ecg-p-dur-mm', 'ecg-p-dur');
    setupAutoCalc('ecg-pr-mm', 'ecg-pr');
    setupAutoCalc('ecg-qrs-mm', 'ecg-qrs');

    // 2. Função Complexa: FC (1500) e QTc (Fórmula de Bazett)
    const rrInput = byId('ecg-rr-mm');
    const fcInput = byId('ecg-fc');
    const qtInput = byId('ecg-qt-mm');
    const qtcInput = byId('ecg-qtc');

    const updateFC_QTc = () => {
        let rr_s = null;
        const rr_mm = parseFloat(rrInput.value);
        const fc = parseFloat(fcInput.value);
        
        // Calcular RR em segundos (para o Bazett)
        if (!isNaN(rr_mm) && rr_mm > 0) {
            rr_s = rr_mm * 0.04;
        } else if (!isNaN(fc) && fc > 0) {
            rr_s = 60 / fc;
        }

        // Se houver QT medido (em mm), calcula o QTc corrigido!
        const qt = parseFloat(qtInput.value);
        if (rr_s !== null && !isNaN(qt)) {
            const qt_ms = qt * 40; // converte QT medido para ms
            const qtc = qt_ms / Math.sqrt(rr_s); // Bazett
            qtcInput.value = Math.round(qtc);
        } else {
            qtcInput.value = ''; // Limpa se faltarem dados
        }
    };

    if(rrInput) rrInput.addEventListener('input', () => {
        const rr = parseFloat(rrInput.value);
        if(!isNaN(rr) && rr > 0) fcInput.value = Math.round(1500 / rr);
        else fcInput.value = '';
        updateFC_QTc();
    });
    
    if(fcInput) fcInput.addEventListener('input', updateFC_QTc);
    if(qtInput) qtInput.addEventListener('input', updateFC_QTc);

    // Liga o botão de Laudo
    byId('btn-calc-ecg')?.addEventListener('click', avaliarECG);
}

// ==========================================
// 🏥 MATRIZ DAVIGNON (AHA)
// ==========================================
const DAVIGNON_REF = [
    { min: 0, max: 6, fc: [90, 190], eixo: [60, 180], prMax: 160, qrsMax: 80, pDur: 80 }, // 0 a 1 sem
    { min: 7, max: 29, fc: [105, 195], eixo: [45, 160], prMax: 150, qrsMax: 80, pDur: 80 }, // 1 a 4 sem
    { min: 30, max: 89, fc: [110, 180], eixo: [30, 135], prMax: 150, qrsMax: 80, pDur: 80 }, // 1 a 3 m
    { min: 90, max: 179, fc: [105, 180], eixo: [0, 135], prMax: 160, qrsMax: 80, pDur: 80 }, // 3 a 6 m
    { min: 180, max: 359, fc: [100, 175], eixo: [0, 135], prMax: 160, qrsMax: 80, pDur: 80 }, // 6 a 12 m
    { min: 360, max: 1094, fc: [90, 150], eixo: [0, 110], prMax: 160, qrsMax: 90, pDur: 90 }, // 1 a 3 a
    { min: 1095, max: 1824, fc: [65, 135], eixo: [0, 110], prMax: 170, qrsMax: 90, pDur: 90 }, // 3 a 5 a
    { min: 1825, max: 2919, fc: [60, 130], eixo: [-15, 110], prMax: 170, qrsMax: 90, pDur: 90 }, // 5 a 8 a
    { min: 2920, max: 4379, fc: [60, 120], eixo: [-15, 110], prMax: 180, qrsMax: 100, pDur: 100 }, // 8 a 12 a
    { min: 4380, max: 5839, fc: [60, 115], eixo: [-15, 110], prMax: 180, qrsMax: 100, pDur: 100 }, // 12 a 16 a
    { min: 5840, max: 99999, fc: [60, 100], eixo: [-30, 90], prMax: 200, qrsMax: 100, pDur: 110 } // > 16 a
];

function avaliarECG() {
    const anos = parseInt(byId('ecg-anos').value) || 0;
    const meses = parseInt(byId('ecg-meses').value) || 0;
    const dias = parseInt(byId('ecg-dias').value) || 0;
    
    const ritmo = byId('ecg-ritmo').value;
    const fc = parseFloat(byId('ecg-fc').value); // Lê o input nativo (já preenchido pela automação)
    const eixo = parseFloat(byId('ecg-eixo').value);
    const pDur = parseFloat(byId('ecg-p-dur').value);
    const pAmp = parseFloat(byId('ecg-p-amp').value);
    const pr = parseFloat(byId('ecg-pr').value);
    const qrs = parseFloat(byId('ecg-qrs').value);
    const qtc = parseFloat(byId('ecg-qtc').value);
    const rsr = byId('ecg-rsr').value;
    const qPat = byId('ecg-q-pat').value;

    const resBox = byId('res-ecg');

    if (anos === 0 && meses === 0 && dias === 0) {
        resBox.style.display = 'block';
        resBox.innerHTML = '<strong style="color:#c0392b;">⚠️ ERRO: Insira a idade do paciente para calcular as referências adequadas.</strong>';
        return;
    }
    if (isNaN(fc)) {
        resBox.style.display = 'block';
        resBox.innerHTML = '<strong style="color:#c0392b;">⚠️ ERRO: A Frequência Cardíaca é obrigatória (Digite a FC direta ou use o R-R em mm).</strong>';
        return;
    }

    const idadeDias = (anos * 365) + (meses * 30.4) + dias;
    const ref = DAVIGNON_REF.find(r => idadeDias >= r.min && idadeDias <= r.max) || DAVIGNON_REF[DAVIGNON_REF.length - 1];

    let laudos = []; 
    let textoRitmo = "";
    let textoConducao = "";
    let textoEixo = "";
    let textoP = "";
    let textoQRS = "";
    let textoQT = "";
    let textoExtra = "";

    // 1. RITMO E FC
    let estadoFC = "Normal";
    if (fc < ref.fc[0]) { estadoFC = "Bradicardia"; laudos.push(`Bradicardia (${fc} bpm)`); }
    if (fc > ref.fc[1]) { estadoFC = "Taquicardia"; laudos.push(`Taquicardia (${fc} bpm)`); }
    
    if (ritmo === 'sinusal') {
        textoRitmo = `Ritmo Sinusal. Frequência Cardíaca de ${fc} bpm (${estadoFC} para a idade).`;
    } else {
        textoRitmo = `Ritmo NÃO Sinusal / Arritmia. Frequência Cardíaca de ${fc} bpm.`;
        laudos.push("Ritmo Não Sinusal (Investigar Arritmia)");
    }

    // 2. ONDA P E ÁTRIOS
    if (!isNaN(pDur) || !isNaN(pAmp)) {
        let pTxt = [];
        if (!isNaN(pDur) && pDur > ref.pDur) { pTxt.push(`Duração aumentada (${pDur} ms)`); laudos.push("Sobrecarga Atrial Esquerda (SAE)"); }
        if (!isNaN(pAmp) && pAmp >= 2.5) { pTxt.push(`Amplitude aumentada (${pAmp} mm)`); laudos.push("Sobrecarga Atrial Direita (SAD)"); }
        textoP = pTxt.length > 0 ? pTxt.join(". ") + "." : "Onda P com morfologia, duração e amplitude normais.";
    } else {
        textoP = "Onda P não avaliada detalhadamente.";
    }

    // 3. INTERVALO PR
    if (!isNaN(pr)) {
        let prMin = idadeDias < 365 ? 80 : 100;
        if (pr < prMin) { 
            textoConducao = `Intervalo PR curto (${pr} ms).`; 
            laudos.push("PR Curto (Considerar Síndrome de Pré-excitação / WPW)"); 
        }
        else if (pr > ref.prMax) { 
            textoConducao = `Intervalo PR prolongado (${pr} ms).`; 
            laudos.push("Bloqueio Atrioventricular (BAV) de 1º Grau"); 
        }
        else { textoConducao = `Intervalo PR de ${pr} ms (Normal para a idade).`; }
    }

    // 4. EIXO QRS
    if (!isNaN(eixo)) {
        if (eixo < ref.eixo[0]) {
            textoEixo = `Eixo do QRS desviado à ESQUERDA (${eixo}º).`;
            laudos.push("Desvio do Eixo QRS à Esquerda");
        } else if (eixo > ref.eixo[1]) {
            textoEixo = `Eixo do QRS desviado à DIREITA (${eixo}º).`;
            laudos.push("Desvio do Eixo QRS à Direita");
        } else {
            textoEixo = `Eixo do QRS em ${eixo}º (Dentro dos limites normais).`;
        }
    }

    // 5. DURAÇÃO QRS E RSR'
    let qrsProlongado = false;
    if (!isNaN(qrs)) {
        if (qrs > ref.qrsMax && qrs < 120) {
            textoQRS = `Complexo QRS com duração no limite superior / prolongada (${qrs} ms).`;
            qrsProlongado = true;
            if (rsr !== 'presente') laudos.push("Distúrbio de Condução Intraventricular (Atraso final)");
        } else if (qrs >= 120) {
            textoQRS = `Complexo QRS alargado (${qrs} ms).`;
            qrsProlongado = true;
            if (rsr !== 'presente') laudos.push("Bloqueio de Ramo Completo");
        } else {
            textoQRS = `Complexo QRS de duração normal (${qrs} ms).`;
        }
    }

    if (rsr === 'presente') {
        textoExtra += "Presença de padrão RSR' em V1. ";
        if (qrsProlongado) {
            laudos.push(qrs >= 120 ? "Bloqueio de Ramo Direito (BRD) Completo" : "Bloqueio Incompleto de Ramo Direito (BIRD)");
        } else {
            laudos.push("Padrão RSR' em V1 (Pode ser variante do normal se QRS estreito e sem alterações de repolarização)");
        }
    }

    // 6. ONDAS Q PATOLÓGICAS
    if (qPat === 'presente') {
        textoExtra += "Ondas Q patológicas presentes. ";
        laudos.push("Ondas Q Patológicas (Investigar área inativa/isquemia ou hipertrofia miocárdica)");
    }

    // 7. QTc
    if (!isNaN(qtc)) {
        if (qtc >= 460) {
            textoQT = `QTc Prolongado (${qtc} ms).`;
            laudos.push("Intervalo QTc Prolongado (Risco de Arritmia / Síndrome do QT Longo)");
        } else if (qtc <= 340) {
            textoQT = `QTc Curto (${qtc} ms).`;
            laudos.push("Intervalo QTc Curto (Investigar Síndrome do QT Curto)");
        } else {
            textoQT = `QTc de ${qtc} ms (Normal).`;
        }
    }

    // MONTAGEM DO LAUDO FINAL
    let tituloDiagnostico = "";
    let corDiagnostico = "";
    
    if (laudos.length === 0 && ritmo === 'sinusal') {
        tituloDiagnostico = "ECG DENTRO DOS LIMITES DA NORMALIDADE";
        corDiagnostico = "#27ae60"; 
        laudos.push("Exame eletrocardiográfico dentro dos parâmetros fisiológicos para a idade, conforme Davignon/AHA.");
    } else {
        tituloDiagnostico = "ECG COM ALTERAÇÕES (VER LAUDO)";
        corDiagnostico = "#c0392b"; 
    }

    let htmlLaudo = `
        <div style="font-family: monospace; font-size: 0.9rem; line-height: 1.5; color: #2c3e50;">
            <div style="text-align: center; border-bottom: 2px solid #bdc3c7; padding-bottom: 10px; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #2980b9;">LAUDO ELETROCARDIOGRÁFICO PEDIÁTRICO</h3>
                <span style="font-size: 0.8rem; color: #7f8c8d;">Ref: Davignon et al. / AHA Guidelines</span>
            </div>

            <strong>1. Ritmo e Frequência:</strong><br>
            ${textoRitmo}<br><br>

            <strong>2. Condução Atrioventricular:</strong><br>
            ${textoConducao || "Não informada."}<br><br>

            <strong>3. Análise Atrial (Onda P):</strong><br>
            ${textoP}<br><br>

            <strong>4. Eixo Elétrico:</strong><br>
            ${textoEixo || "Não informado."}<br><br>

            <strong>5. Despolarização Ventricular (QRS):</strong><br>
            ${textoQRS || "Não informada."}<br><br>

            <strong>6. Repolarização Ventricular (QTc):</strong><br>
            ${textoQT || "Não informada."}<br><br>

            ${textoExtra ? `<strong>7. Achados Adicionais:</strong><br>${textoExtra}<br><br>` : ''}

            <div style="background: ${corDiagnostico}15; border-left: 4px solid ${corDiagnostico}; padding: 12px; margin-top: 20px;">
                <strong style="color: ${corDiagnostico}; font-size: 1.05rem;">CONCLUSÃO DIAGNÓSTICA:</strong>
                <ul style="margin: 8px 0 0 20px; padding: 0; font-weight: bold; color: #34495e;">
                    ${laudos.map(l => `<li style="margin-bottom: 4px;">${l}</li>`).join('')}
                </ul>
            </div>
            
            <button class="calc-btn" id="btn-copiar-laudo-ecg" style="margin-top: 15px; background: #2c3e50; font-family: 'Inter', sans-serif;">📋 Copiar Laudo para o Prontuário</button>
        </div>
    `;

    resBox.style.display = 'block';
    resBox.innerHTML = htmlLaudo;

    document.getElementById('btn-copiar-laudo-ecg').addEventListener('click', function() {
        let txtCopia = `LAUDO ELETROCARDIOGRÁFICO PEDIÁTRICO\n`;
        txtCopia += `- Ritmo e FC: ${textoRitmo}\n`;
        if(textoConducao) txtCopia += `- Condução AV: ${textoConducao}\n`;
        txtCopia += `- Onda P: ${textoP}\n`;
        if(textoEixo) txtCopia += `- Eixo QRS: ${textoEixo}\n`;
        if(textoQRS) txtCopia += `- Duração QRS: ${textoQRS}\n`;
        if(textoQT) txtCopia += `- QTc: ${textoQT}\n`;
        if(textoExtra) txtCopia += `- Extras: ${textoExtra}\n`;
        txtCopia += `\nCONCLUSÃO:\n`;
        laudos.forEach(l => txtCopia += `* ${l}\n`);

        navigator.clipboard.writeText(txtCopia).then(() => {
            this.innerText = '✅ Laudo Copiado!';
            setTimeout(() => { this.innerText = '📋 Copiar Laudo para o Prontuário'; }, 2000);
        });
    });
}
