// tabs/cardio/ecg.js
import { byId } from '../../utils/dom.js';

export function initECGCard() {
    const slot = byId('cardio-ecg-slot');
    if (!slot) return;

    slot.innerHTML = `
        <div class="card" style="border-left: 5px solid #c0392b;">
            <div class="card-header" style="border: none; padding-left: 0; margin-bottom: 10px;">
                <h2 style="color: #c0392b; margin-top: 0; font-size: 1.15rem;">ECG Pediátrico Avançado (Davignon / AHA)</h2>
                <p style="font-size: 0.85rem; color: #5f7382; margin-top: 4px;">Utilize os quadradinhos (mm) para conversão automática ou insira os valores diretos.</p>
            </div>

            <div class="grid-3" style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px dashed #d8e2ea;">
                <div><label>Idade (Anos) <span style="color:red">*</span></label><input type="number" id="ecg-anos" min="0" placeholder="Ex: 10"></div>
                <div><label>Meses <span style="color:red">*</span></label><input type="number" id="ecg-meses" min="0" max="11" placeholder="Ex: 9"></div>
                <div><label>Dias</label><input type="number" id="ecg-dias" min="0" max="31" placeholder="Ex: 0"></div>
            </div>

            <h3 style="font-size: 0.95rem; color: var(--azul); margin-top: 0;">2. Ritmo e Frequência</h3>
            <div class="grid-2" style="margin-bottom: 15px;">
                <div>
                    <label>Ritmo</label>
                    <select id="ecg-ritmo" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ccc;">
                        <option value="Sinusal">Sinusal</option>
                        <option value="Atrial">Atrial</option>
                        <option value="Nodal / Juncional">Nodal / Juncional</option>
                        <option value="Fibrilação Atrial">Fibrilação Atrial</option>
                        <option value="Outro">Outro (Não Sinusal)</option>
                    </select>
                </div>
                <div>
                    <label>Frequência Cardíaca</label>
                    <div style="display:flex; gap: 5px;">
                        <input type="number" id="ecg-rr-mm" placeholder="R-R (mm)" style="width: 50%; border-color: #e74c3c;">
                        <input type="number" id="ecg-fc" placeholder="BPM" style="width: 50%; font-weight: bold; color: #c0392b; background: #fadbd8;">
                    </div>
                </div>
            </div>

            <h3 style="font-size: 0.95rem; color: var(--azul); margin-top: 0;">3. Eixo e Intervalos</h3>
            <div class="grid-3" style="margin-bottom: 10px;">
                <div><label>Eixo SÂQRS (º)</label><input type="number" id="ecg-eixo" placeholder="Ex: 45"></div>
                <div>
                    <label>Onda P (Duração)</label>
                    <div style="display:flex; gap: 5px;">
                        <input type="number" id="ecg-p-dur-mm" placeholder="mm" style="width: 40%; border-color: #3498db;">
                        <input type="number" id="ecg-p-dur" placeholder="ms" style="width: 60%; background: #ebf5fb;">
                    </div>
                </div>
                <div><label>Onda P (Amplitude)</label><input type="number" id="ecg-p-amp" step="0.1" placeholder="mm (Ex: 2.0)"></div>
            </div>

            <div class="grid-3" style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px dashed #d8e2ea;">
                <div>
                    <label>Intervalo PR</label>
                    <div style="display:flex; gap: 5px;">
                        <input type="number" id="ecg-pr-mm" placeholder="mm" style="width: 40%; border-color: #3498db;">
                        <input type="number" id="ecg-pr" placeholder="ms" style="width: 60%; background: #ebf5fb;">
                    </div>
                </div>
                <div>
                    <label>Duração QRS</label>
                    <div style="display:flex; gap: 5px;">
                        <input type="number" id="ecg-qrs-mm" placeholder="mm" style="width: 40%; border-color: #3498db;">
                        <input type="number" id="ecg-qrs" placeholder="ms" style="width: 60%; background: #ebf5fb;">
                    </div>
                </div>
                <div>
                    <label>Intervalo QT</label>
                    <div style="display:flex; gap: 5px;">
                        <input type="number" id="ecg-qt-mm" placeholder="QT (mm)" style="width: 50%; border-color: #9b59b6;">
                        <input type="number" id="ecg-qtc" placeholder="QTc (ms)" style="width: 50%; background: #f4ecf7; font-weight:bold;">
                    </div>
                </div>
            </div>

            <h3 style="font-size: 0.95rem; color: var(--azul); margin-top: 0;">4. Morfologia, ST e Alterações</h3>
            <div class="grid-3" style="margin-bottom: 10px;">
                <div>
                    <label>Sobrecarga Ventricular</label>
                    <select id="ecg-sobrecarga-v" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ccc;">
                        <option value="Ausente">Ausente</option>
                        <option value="SVD">SVD</option>
                        <option value="SVE">SVE</option>
                        <option value="Biventricular">Biventricular</option>
                    </select>
                </div>
                <div>
                    <label>Padrão RSR' V1</label>
                    <select id="ecg-rsr" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ccc;">
                        <option value="Ausente">Ausente</option>
                        <option value="Presente">Presente</option>
                    </select>
                </div>
                <div>
                    <label>Onda Q Patológica</label>
                    <select id="ecg-q-pat" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ccc;">
                        <option value="Não">Não</option>
                        <option value="Sim">Sim</option>
                    </select>
                </div>
            </div>

            <div class="grid-3" style="margin-bottom: 10px;">
                <div>
                    <label>Segmento ST</label>
                    <select id="ecg-st" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ccc;">
                        <option value="Isoelétrico">Isoelétrico</option>
                        <option value="Elevado">Elevado</option>
                        <option value="Deprimido">Deprimido</option>
                    </select>
                </div>
                <div>
                    <label>Onda T</label>
                    <select id="ecg-t" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ccc;">
                        <option value="Positiva">Positiva</option>
                        <option value="Negativa">Negativa</option>
                        <option value="Bifásica">Bifásica</option>
                        <option value="Apiculada">Apiculada</option>
                    </select>
                </div>
                <div>
                    <label>Onda T neg em V1</label>
                    <select id="ecg-t-v1" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ccc;">
                        <option value="Não">Não</option>
                        <option value="Sim">Sim (Fisiológico < 6 anos)</option>
                    </select>
                </div>
            </div>

            <div class="grid-2" style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px dashed #d8e2ea;">
                <div>
                    <label>Bloqueio AV (Clínico)</label>
                    <select id="ecg-bav" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ccc;">
                        <option value="Ausente">Ausente</option>
                        <option value="1º Grau">1º Grau (Apenas PR longo)</option>
                        <option value="2º Grau Mobitz I">2º Grau Mobitz I</option>
                        <option value="2º Grau Mobitz II">2º Grau Mobitz II</option>
                        <option value="3º Grau (Total)">3º Grau (Total)</option>
                    </select>
                </div>
                <div>
                    <label>Extrassístoles</label>
                    <select id="ecg-extra" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ccc;">
                        <option value="Ausente">Ausente</option>
                        <option value="Atriais (EA)">Atriais (EA)</option>
                        <option value="Ventriculares (EV)">Ventriculares (EV)</option>
                        <option value="Supraventriculares (ESV)">Supraventriculares (ESV)</option>
                    </select>
                </div>
            </div>

            <button class="calc-btn" id="btn-calc-ecg" style="background: #c0392b;">Gerar Laudo Final</button>
            <div id="res-ecg" class="result-box" style="display: none; background: #fffdf5; border-left: 5px solid #c0392b;"></div>
        </div>
    `;

    // ==========================================
    // ⚙️ MOTORES DE CONVERSÃO (Quadradinhos)
    // ==========================================
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

    const rrInput = byId('ecg-rr-mm');
    const fcInput = byId('ecg-fc');
    const qtInput = byId('ecg-qt-mm');
    const qtcInput = byId('ecg-qtc');

    const updateFC_QTc = () => {
        let rr_s = null;
        const rr_mm = parseFloat(rrInput.value);
        const fc = parseFloat(fcInput.value);
        
        if (!isNaN(rr_mm) && rr_mm > 0) rr_s = rr_mm * 0.04;
        else if (!isNaN(fc) && fc > 0) rr_s = 60 / fc;

        const qt = parseFloat(qtInput.value);
        if (rr_s !== null && !isNaN(qt)) {
            const qt_ms = qt * 40; 
            const qtc = qt_ms / Math.sqrt(rr_s); // Fórmula de Bazett
            qtcInput.value = Math.round(qtc);
        } else {
            qtcInput.value = '';
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

    byId('btn-calc-ecg')?.addEventListener('click', gerarLaudoECG);
}

// ==========================================
// 🏥 MATRIZ DAVIGNON EXTRAÍDA DO EXCEL
// ==========================================
const DAVIGNON_DB = [
    { maxDias: 1, fc: [94, 155], eixo: [59, 189], pr: [80, 120], qtc: [378, 462], qrsMax: 65 },
    { maxDias: 3, fc: [91, 158], eixo: [64, 197], pr: [80, 140], qtc: [378, 462], qrsMax: 65 },
    { maxDias: 7, fc: [90, 166], eixo: [76, 191], pr: [70, 150], qtc: [378, 462], qrsMax: 65 },
    { maxDias: 30, fc: [106, 182], eixo: [70, 160], pr: [70, 140], qtc: [378, 462], qrsMax: 75 },
    { maxDias: 91, fc: [120, 179], eixo: [30, 115], pr: [70, 130], qtc: [381, 458], qrsMax: 75 },
    { maxDias: 182, fc: [105, 185], eixo: [7, 105], pr: [70, 150], qtc: [386, 453], qrsMax: 75 },
    { maxDias: 365, fc: [108, 169], eixo: [6, 98], pr: [70, 160], qtc: [379, 449], qrsMax: 80 },
    { maxDias: 1095, fc: [89, 152], eixo: [7, 102], pr: [80, 150], qtc: [381, 455], qrsMax: 85 },
    { maxDias: 1826, fc: [73, 137], eixo: [6, 104], pr: [80, 160], qtc: [377, 448], qrsMax: 85 },
    { maxDias: 2922, fc: [65, 133], eixo: [10, 139], pr: [90, 160], qtc: [365, 447], qrsMax: 90 },
    { maxDias: 4383, fc: [62, 130], eixo: [6, 116], pr: [90, 170], qtc: [365, 447], qrsMax: 100 },
    { maxDias: 5844, fc: [60, 120], eixo: [9, 128], pr: [90, 180], qtc: [362, 449], qrsMax: 100 },
    { maxDias: 99999, fc: [60, 100], eixo: [-30, 90], pr: [120, 200], qtc: [350, 450], qrsMax: 100 }
];

function gerarLaudoECG() {
    const anos = parseInt(byId('ecg-anos').value);
    const meses = parseInt(byId('ecg-meses').value);
    const dias = parseInt(byId('ecg-dias').value) || 0;
    
    const fc = parseFloat(byId('ecg-fc').value); 
    const resBox = byId('res-ecg');

    if (isNaN(anos) || isNaN(meses)) {
        resBox.style.display = 'block';
        resBox.innerHTML = '<strong style="color:#c0392b;">⚠️ ERRO: Insira pelo menos Anos e Meses (coloque 0 se aplicável).</strong>';
        return;
    }

    const idadeDias = (anos * 365.25) + (meses * 30.4) + dias;
    const ref = DAVIGNON_DB.find(r => idadeDias <= r.maxDias) || DAVIGNON_DB[DAVIGNON_DB.length - 1];

    // Coletores de Texto para o Laudo
    let diagnósticos = [];
    const ritmo = byId('ecg-ritmo').value;
    const eixo = parseFloat(byId('ecg-eixo').value);
    const pDur = parseFloat(byId('ecg-p-dur').value);
    const pAmp = parseFloat(byId('ecg-p-amp').value);
    const pr = parseFloat(byId('ecg-pr').value);
    const qrs = parseFloat(byId('ecg-qrs').value);
    const qtc = parseFloat(byId('ecg-qtc').value);
    const sv = byId('ecg-sobrecarga-v').value;
    const rsr = byId('ecg-rsr').value;
    const qPat = byId('ecg-q-pat').value;
    const st = byId('ecg-st').value;
    const ondaT = byId('ecg-t').value;
    const tV1 = byId('ecg-t-v1').value;
    const bav = byId('ecg-bav').value;
    const extra = byId('ecg-extra').value;

    // 1. RITMO E FC
    let classFC = "Normal";
    if (!isNaN(fc)) {
        if (fc < ref.fc[0]) { classFC = "Bradicardia"; diagnósticos.push(`Bradicardia (${fc} bpm)`); }
        else if (fc > ref.fc[1]) { classFC = "Taquicardia"; diagnósticos.push(`Taquicardia (${fc} bpm)`); }
    }
    const strFC = isNaN(fc) ? "--" : `${fc} bpm (${classFC})`;
    if (ritmo !== 'Sinusal') diagnósticos.push(`Ritmo ${ritmo}`);

    // 2. INTERVALOS
    let classPR = "Normal";
    if (!isNaN(pr)) {
        if (pr > ref.pr[1]) { classPR = "Prolongado"; if(bav === 'Ausente') diagnósticos.push("Intervalo PR Prolongado (BAV 1º Grau)"); }
        else if (pr < ref.pr[0]) { classPR = "Curto"; diagnósticos.push("Intervalo PR Curto"); }
    }
    const strPR = isNaN(pr) ? "--" : `${pr} ms (${classPR})`;

    let classQRS = "Estreito";
    let brdCompleto = false;
    let brdIncompleto = false;
    let breCompleto = false;

    if (!isNaN(qrs)) {
        if (qrs > ref.qrsMax) {
            classQRS = "Alargado";
            if (qrs >= 120) {
                // Adult-level bundle branch blocks logic
                if (rsr === 'Presente') { brdCompleto = true; diagnósticos.push("Bloqueio de Ramo Direito (BRD)"); }
                else { breCompleto = true; diagnósticos.push("Bloqueio de Ramo Esquerdo (BRE) provável"); }
            } else {
                // Pediatric-level delay
                if (rsr === 'Presente') { brdIncompleto = true; diagnósticos.push("Distúrbio de condução pelo ramo direito (BRD Incompleto)"); }
                else { diagnósticos.push("Atraso de condução intraventricular inespecífico"); }
            }
        }
    }
    const strQRS = isNaN(qrs) ? "--" : `${qrs} ms (${classQRS})`;
    if (rsr === 'Presente' && !brdCompleto && !brdIncompleto) diagnósticos.push("Padrão RSR' em V1 (Fisiológico se QRS estreito)");

    let classQTc = "Normal";
    if (!isNaN(qtc)) {
        if (qtc > ref.qtc[1]) { classQTc = "Longo"; diagnósticos.push(`QTc Prolongado (${qtc} ms)`); }
        else if (qtc < ref.qtc[0]) { classQTc = "Curto"; diagnósticos.push(`QTc Curto (${qtc} ms)`); }
    }
    const strQTc = isNaN(qtc) ? "--" : `${qtc} ms (${classQTc})`;

    // 3. EIXO
    let classEixo = "Normal";
    if (!isNaN(eixo)) {
        if (eixo < ref.eixo[0]) { classEixo = "Desvio à Esquerda"; diagnósticos.push("Desvio do SÂQRS à Esquerda"); }
        else if (eixo > ref.eixo[1]) { classEixo = "Desvio à Direita"; diagnósticos.push("Desvio do SÂQRS à Direita"); }
    }
    const strEixo = isNaN(eixo) ? "--" : `${eixo}º (${classEixo})`;

    // 4. SOBRECARGAS
    if (pAmp > 3) diagnósticos.push("Sobrecarga Atrial Direita (SAD)");
    if (pDur >= 80 && idadeDias < 365) diagnósticos.push("Sobrecarga Atrial Esquerda (SAE)");
    else if (pDur >= 90 && idadeDias >= 365) diagnósticos.push("Sobrecarga Atrial Esquerda (SAE)");

    if (sv !== 'Ausente') diagnósticos.push(`Sobrecarga Ventricular: ${sv}`);
    if (qPat === 'Sim') diagnósticos.push("Ondas Q Patológicas Presentes");

    // 5. ST / ONDA T / ARRITMIAS
    if (st !== 'Isoelétrico') diagnósticos.push(`Segmento ST ${st}`);
    if (ondaT !== 'Positiva' && ondaT !== 'Bifásica') diagnósticos.push(`Onda T ${ondaT}`);
    if (tV1 === 'Sim' && anos >= 6) diagnósticos.push("Onda T negativa em V1 (Anormal para a idade > 6 anos)");
    
    if (bav !== 'Ausente' && bav !== '1º Grau') diagnósticos.push(`Bloqueio AV: ${bav}`); // 1º grau já coberto no PR
    if (extra !== 'Ausente') diagnósticos.push(`Extrassístoles: ${extra}`);

    // MONTAGEM DO TEXTO (SIMILAR AO EXCEL)
    const exameNormal = diagnósticos.length === 0;

    let htmlLaudo = `
        <div style="font-family: monospace; font-size: 0.9rem; line-height: 1.6; color: #2c3e50;">
            <div style="text-align: center; border-bottom: 2px solid #bdc3c7; padding-bottom: 10px; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #2980b9;">ELETROCARDIOGRAMA</h3>
                <span style="font-size: 0.85rem;">Idade: ${anos}a ${meses}m ${dias}d</span>
            </div>

            <strong>1. Ritmo e Frequência</strong><br>
            Ritmo: ${ritmo}<br>
            FC: ${strFC}<br><br>

            <strong>2. Intervalos</strong><br>
            PR: ${strPR}<br>
            QRS: ${strQRS}<br>
            QTc (Bazett): ${strQTc}<br><br>

            <strong>3. Eixo Elétrico</strong><br>
            SÂQRS: ${strEixo}<br><br>

            <strong>4. Morfologia e Sobrecargas</strong><br>
            Onda Q patológica: ${qPat}<br>
            Sobrecarga Ventricular: ${sv}<br><br>

            <strong>5. Segmento ST e Onda T</strong><br>
            Segmento ST: ${st}<br>
            Onda T: ${ondaT}<br>
            T negativa em V1 (fisio < 6a): ${tV1}<br><br>

            <strong>6. Arritmias / Alterações de Condução</strong><br>
            Extrassístoles: ${extra}<br>
            Bloqueios AV: ${bav}<br>
            Padrão RSR' V1: ${rsr}<br><br>

            <div style="background: ${exameNormal ? '#d4efdf' : '#fadbd8'}; border-left: 4px solid ${exameNormal ? '#27ae60' : '#c0392b'}; padding: 12px; margin-top: 20px;">
                <strong style="color: ${exameNormal ? '#27ae60' : '#c0392b'}; font-size: 1.05rem;">7. INTERPRETAÇÃO FINAL:</strong>
                <ul style="margin: 8px 0 0 20px; padding: 0; font-weight: bold; color: #34495e;">
                    ${exameNormal ? '<li>Exame normal para a idade.</li>' : diagnósticos.map(l => `<li style="margin-bottom: 4px;">${l}</li>`).join('')}
                </ul>
            </div>
            
            <button class="calc-btn" id="btn-copiar-laudo-ecg" style="margin-top: 15px; background: #2c3e50; font-family: 'Inter', sans-serif;">📋 Copiar Laudo para Prontuário</button>
        </div>
    `;

    resBox.style.display = 'block';
    resBox.innerHTML = htmlLaudo;

    document.getElementById('btn-copiar-laudo-ecg').addEventListener('click', function() {
        let txtCopia = `LAUDO DE ELETROCARDIOGRAMA (Idade: ${anos}a ${meses}m)\n`;
        txtCopia += `1. Ritmo e FC:\n- Ritmo: ${ritmo}\n- FC: ${strFC}\n\n`;
        txtCopia += `2. Intervalos:\n- PR: ${strPR}\n- QRS: ${strQRS}\n- QTc: ${strQTc}\n\n`;
        txtCopia += `3. Eixo:\n- SÂQRS: ${strEixo}\n\n`;
        txtCopia += `4. Morfologia e ST-T:\n- ST: ${st} | Onda T: ${ondaT}\n- Sobrecarga Ventricular: ${sv}\n\n`;
        txtCopia += `5. INTERPRETAÇÃO FINAL:\n`;
        if(exameNormal) txtCopia += `* Exame normal para a idade.\n`;
        else diagnósticos.forEach(l => txtCopia += `* ${l}\n`);

        navigator.clipboard.writeText(txtCopia).then(() => {
            this.innerText = '✅ Laudo Copiado!';
            setTimeout(() => { this.innerText = '📋 Copiar Laudo para Prontuário'; }, 2000);
        });
    });
}
