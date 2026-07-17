// tabs/cardio/metabolica.js
import { byId } from '../../utils/dom.js';

export function initMetabolica() {
    const slot = byId('cardio-metabolica-slot');
    if (!slot) return;

    slot.innerHTML = `
        <div class="card" style="border-left: 5px solid #8e44ad;">
            <div class="card-header" style="border: none; padding-left: 0; margin-bottom: 5px;">
                <h2 style="color: #8e44ad; margin-top: 0; font-size: 1.15rem;">Diagnóstico e Conduta: Síndrome Metabólica</h2>
                <p style="font-size: 0.85rem; color: #5f7382; margin-top: 4px;">Baseado no Consenso da International Diabetes Federation (IDF - 2007) para crianças e adolescentes.</p>
            </div>

            <div class="grid-2" style="margin-bottom: 15px;">
                <div><label>Idade (anos) <span style="color:red">*</span></label><input type="number" id="sm-idade" min="0" max="21" placeholder="Ex: 12"></div>
                <div><label>Sexo <span style="color:red">*</span></label>
                    <select id="sm-sexo" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ccc;">
                        <option value="M">Masculino</option>
                        <option value="F">Feminino</option>
                    </select>
                </div>
            </div>

            <div style="background: #faf5fc; border: 1px solid #d2b4de; padding: 12px; border-radius: 8px; margin-bottom: 15px;">
                <h3 style="font-size: 0.95rem; color: #8e44ad; margin-top: 0;">Critério Obrigatório (Obesidade Abdominal)</h3>
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-weight: bold; color: #2c3e50;">
                    <input type="checkbox" id="sm-cintura" style="width: 20px; height: 20px; accent-color: #8e44ad;">
                    Circunferência Abdominal Elevada
                </label>
                <p style="font-size: 0.8rem; color: #7f8c8d; margin: 5px 0 0 28px;">
                    • <strong>10 a &lt;16 anos:</strong> ≥ Percentil 90 (ou cut-off adulto se menor)<br>
                    • <strong>≥ 16 anos:</strong> ≥ 90 cm (Homens) ou ≥ 80 cm (Mulheres)
                </p>
            </div>

            <div class="card" style="background: #f8fbfd; border: 1px solid #d8e2ea; padding: 12px; margin-bottom: 15px;">
                <h3 style="font-size: 0.95rem; color: var(--azul); margin-top: 0;">Parâmetros Vitais e Laboratoriais (Preencha para avaliar)</h3>
                <div class="grid-2" style="margin-bottom: 10px;">
                    <div><label>Triglicérides (mg/dL)</label><input type="number" id="sm-tg" placeholder="Ex: 160"></div>
                    <div><label>HDL Colesterol (mg/dL)</label><input type="number" id="sm-hdl" placeholder="Ex: 35"></div>
                </div>
                <div class="grid-2" style="margin-bottom: 10px;">
                    <div>
                        <label>Pressão Arterial (mmHg)</label>
                        <div style="display:flex; gap:5px;">
                            <input type="number" id="sm-pas" placeholder="Sistólica">
                            <span style="align-self:center; font-size:1.2rem; color: #bdc3c7;">/</span>
                            <input type="number" id="sm-pad" placeholder="Diastólica">
                        </div>
                    </div>
                    <div><label>Glicemia de Jejum (mg/dL)</label><input type="number" id="sm-glicose" placeholder="Ex: 105"></div>
                </div>
            </div>

            <button class="calc-btn" id="btn-calc-sm" style="background: #8e44ad;">Gerar Diagnóstico e Conduta</button>
            <div id="res-sm" class="result-box"></div>
        </div>
    `;

    byId('btn-calc-sm')?.addEventListener('click', calcularSindromeMetabolica);
}

function calcularSindromeMetabolica() {
    const idade = parseInt(byId('sm-idade').value);
    const sexo = byId('sm-sexo').value;
    const cinturaElevada = byId('sm-cintura').checked;
    
    const tg = parseFloat(byId('sm-tg').value);
    const hdl = parseFloat(byId('sm-hdl').value);
    const pas = parseFloat(byId('sm-pas').value);
    const pad = parseFloat(byId('sm-pad').value);
    const glicose = parseFloat(byId('sm-glicose').value);

    const resBox = byId('res-sm');
    resBox.style.display = 'block';

    // 1. Validação de Idade
    if (isNaN(idade)) {
        resBox.innerHTML = '<span style="color:#c0392b; font-weight:bold;">⚠️ Por favor, preencha a idade do paciente.</span>';
        return;
    }

    if (idade < 10) {
        resBox.innerHTML = `
            <strong style="color: var(--azul); font-size: 1.1rem;">🛑 Não Diagnósticável pela IDF (&lt; 10 anos)</strong><br><br>
            <span style="color:#5f7382;">O diagnóstico formal de Síndrome Metabólica <strong>não deve ser feito em crianças menores de 10 anos</strong>.</span>
            
            <div style="background: #e8f4f8; border-left: 4px solid #2980b9; padding: 15px; border-radius: 6px; margin-top: 15px;">
                <h4 style="color: #2980b9; margin-top: 0; margin-bottom: 10px; font-size: 1.05rem;">📋 Conduta Clínica Recomendada:</h4>
                <ul style="margin: 0; padding-left: 20px; color: #2c3e50; font-size: 0.9rem; line-height: 1.5;">
                    <li><strong>Foco Preventivo:</strong> A intervenção nesta faixa etária deve ser estritamente comportamental.</li>
                    <li><strong>Mudança do Estilo de Vida (MEV):</strong> Estimular brincadeiras ativas (≥ 60 min/dia), reduzir tempo de ecrã/telas (< 2h/dia) e promover reeducação alimentar familiar.</li>
                    <li>Monitorizar o peso e a circunferência abdominal anualmente. Farmacoterapia metabólica não é recomendada nesta faixa.</li>
                </ul>
            </div>
        `;
        return;
    }

    // 2. Critério Obrigatório Ausente
    if (!cinturaElevada) {
        resBox.innerHTML = `
            <strong style="color: #27ae60; font-size: 1.1rem;">✅ Negativo para Síndrome Metabólica</strong><br><br>
            <span style="color:#5f7382;">A Obesidade Abdominal (circunferência elevada) é o <strong>critério obrigatório primário</strong> no consenso da IDF. Sem ele, a síndrome não está configurada.</span>
            
            <div style="background: #e8f4f8; border-left: 4px solid #2980b9; padding: 15px; border-radius: 6px; margin-top: 15px;">
                <h4 style="color: #2980b9; margin-top: 0; margin-bottom: 10px; font-size: 1.05rem;">📋 Conduta Clínica:</h4>
                <ul style="margin: 0; padding-left: 20px; color: #2c3e50; font-size: 0.9rem; line-height: 1.5;">
                    <li>Manter seguimento pediátrico de rotina (Puericultura).</li>
                    <li>Se houver outros exames alterados isoladamente (ex: dislipidemia familiar), tratá-los de acordo com a diretriz específica da patologia.</li>
                </ul>
            </div>
        `;
        return;
    }

    // 3. Avaliação dos Critérios Adicionais
    let criteriosAlcancados = 0;
    let achados = [];

    if (tg >= 150) {
        criteriosAlcancados++;
        achados.push(`Triglicérides elevados (≥ 150 mg/dL) → Encontrado: ${tg}`);
    }

    let limiarHDL = 40;
    if (idade >= 16 && sexo === 'F') limiarHDL = 50;
    if (hdl < limiarHDL) {
        criteriosAlcancados++;
        achados.push(`HDL reduzido (&lt; ${limiarHDL} mg/dL) → Encontrado: ${hdl}`);
    }

    if (pas >= 130 || pad >= 85) {
        criteriosAlcancados++;
        achados.push(`Pressão Arterial elevada (≥ 130/85 mmHg) → Encontrado: ${pas || '--'}/${pad || '--'}`);
    }

    if (glicose >= 100) {
        criteriosAlcancados++;
        achados.push(`Glicemia de jejum alterada (≥ 100 mg/dL) → Encontrado: ${glicose}`);
    }

    // 4. Montagem da Conduta Dinâmica (Caixa Azul)
    let condutaHtml = `
        <div style="background: #e8f4f8; border-left: 4px solid #2980b9; padding: 15px; border-radius: 6px; margin-top: 20px;">
            <h4 style="color: #2980b9; margin-top: 0; margin-bottom: 10px; font-size: 1.05rem;">📋 Plano Terapêutico e Conduta</h4>
            <ul style="margin: 0; padding-left: 20px; color: #2c3e50; font-size: 0.9rem; line-height: 1.6;">
                <li><strong>Estilo de Vida (MEV):</strong> Intervenção nutricional severa (redução de açúcares/ultraprocessados) e ≥ 60 min/dia de atividade física. Meta primária é a redução do IMC/cintura abdominal.</li>
    `;

    if (tg >= 150 || hdl < limiarHDL) {
        condutaHtml += `<li><strong>Dislipidemia:</strong> Manter MEV rigoroso. Avaliar farmacoterapia (Estatinas) se elevação persistente do LDL. Fibratos são indicados primariamente se Triglicérides > 400-500 mg/dL (risco de pancreatite).</li>`;
    }
    if (pas >= 130 || pad >= 85) {
        condutaHtml += `<li><strong>Hipertensão:</strong> Dieta restrita em sódio (DASH) e perda de peso. Se refratária pós-MEV ou houver lesão de órgão-alvo, iniciar anti-hipertensivos (iECA ou BRA).</li>`;
    }
    if (glicose >= 100) {
        condutaHtml += `<li><strong>Metabolismo Glicêmico:</strong> Aprofundar investigação com TOTG e HbA1c. Considerar <strong>Metformina</strong> caso o paciente firme o diagnóstico de DM2 ou possua intolerância severa à glicose refratária ao MEV.</li>`;
    }

    // Adiciona rastreios sempre que há obesidade abdominal
    condutaHtml += `
                <li><strong>Rastreio de Comorbidades:</strong> Solicitar USG de Abdome Total e TGO/TGP (rastreio de Esteatose Hepática - DHGNA). Investigar clínica de Apneia Obstrutiva do Sono e SOP nas meninas.</li>
            </ul>
        </div>
    `;

    // 5. Fecho do Diagnóstico
    let htmlFinal = "";
    if (criteriosAlcancados >= 2) {
        htmlFinal = `
            <strong style="color: #c0392b; font-size: 1.15rem;">🚨 Diagnóstico Positivo: Síndrome Metabólica</strong><br>
            <span style="color: #5f7382; font-size: 0.9rem;">O paciente preenche o critério obrigatório + <strong>${criteriosAlcancados}</strong> critérios adicionais.</span><br><br>
            <strong>Achados Positivos:</strong>
            <ul style="margin: 5px 0 0 20px; padding: 0; color: #c0392b; font-weight: bold; font-size: 0.9rem;">
                <li>Obesidade Abdominal (Critério Obrigatório)</li>
                ${achados.map(a => `<li>${a}</li>`).join('')}
            </ul>
            ${condutaHtml}
        `;
    } else {
        htmlFinal = `
            <strong style="color: #f39c12; font-size: 1.15rem;">⚠️ Atenção: Risco Metabólico / Pré-Síndrome</strong><br>
            <span style="color: #5f7382; font-size: 0.9rem;">O paciente possui obesidade abdominal, mas não cumpre os 2 critérios adicionais exigidos para o diagnóstico formal. O risco evolutivo é altíssimo.</span><br><br>
            <strong>Achados Positivos (Anormais):</strong>
            <ul style="margin: 5px 0 0 20px; padding: 0; color: #d35400; font-size: 0.9rem;">
                <li>Obesidade Abdominal (Critério Obrigatório)</li>
                ${achados.length > 0 ? achados.map(a => `<li>${a}</li>`).join('') : '<li style="color:#7f8c8d; font-weight:normal;">Nenhum outro critério laboratorial ou vital alterado.</li>'}
            </ul>
            ${condutaHtml}
        `;
    }

    resBox.innerHTML = htmlFinal;
}
