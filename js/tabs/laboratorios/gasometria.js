// tabs/laboratorio/gasometria.js

import { byId } from '../../utils/dom.js';

export function initGasometria() {
    const slot = byId('lab-gaso-slot');
    if (!slot) return;

    slot.innerHTML = `
        <div class="card" style="border-left: 5px solid #2980b9;">
            <div class="card-header" style="border: none; padding-left: 0; margin-bottom: 5px;">
                <h2 style="color: #2980b9; margin-top: 0; font-size: 1.15rem;">Análise de Gasometria</h2>
                <p style="font-size: 0.85rem; color: #5f7382; margin-top: 4px;">Interpretador completo de distúrbios ácido-base, compensações, Ânion Gap e oxigenação.</p>
            </div>

            <div class="grid-3" style="margin-bottom: 12px;">
                <div>
                    <label>Tipo de Amostra</label>
                    <select id="gaso-tipo" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ccc;">
                        <option value="arterial">Arterial</option>
                        <option value="venosa">Venosa</option>
                        <option value="capilar">Capilar</option>
                    </select>
                </div>
                <div><label>pH <span style="color:red">*</span></label><input type="number" id="gaso-ph" step="0.01" placeholder="Ex: 7.25"></div>
                <div><label>pCO₂ (mmHg) <span style="color:red">*</span></label><input type="number" id="gaso-pco2" step="0.1" placeholder="Ex: 50"></div>
            </div>

            <div class="grid-3" style="margin-bottom: 12px;">
                <div><label>HCO₃⁻ (mEq/L) <span style="color:red">*</span></label><input type="number" id="gaso-hco3" step="0.1" placeholder="Ex: 18"></div>
                <div><label>pO₂ (mmHg)</label><input type="number" id="gaso-po2" step="0.1" placeholder="Ex: 85"></div>
                <div><label>FiO₂ (%)</label><input type="number" id="gaso-fio2" step="1" value="21" placeholder="Ex: 21"></div>
            </div>

            <div class="card" style="background: #f8fbfd; border: 1px solid #d8e2ea; padding: 12px; margin-bottom: 15px;">
                <h3 style="font-size: 0.9rem; color: #2980b9; margin-top: 0;">Parâmetros Adicionais (Ânion Gap / Delta Ratio)</h3>
                <div class="grid-3">
                    <div><label>Sódio (mEq/L)</label><input type="number" id="gaso-na" step="1" placeholder="Ex: 140"></div>
                    <div><label>Cloro (mEq/L)</label><input type="number" id="gaso-cl" step="1" placeholder="Ex: 105"></div>
                    <div><label>Albumina (g/dL)</label><input type="number" id="gaso-alb" step="0.1" placeholder="Ex: 4.0"></div>
                </div>
                <div class="grid-3" style="margin-top: 10px;">
                    <div><label>Lactato (mmol/L)</label><input type="number" id="gaso-lac" step="0.1" placeholder="Ex: 1.5"></div>
                </div>
            </div>

            <button class="calc-btn" id="btn-calc-gaso" style="background: #2980b9;">Interpretar Gasometria</button>
            <div id="res-gaso" class="result-box"></div>
        </div>
    `;

    byId('btn-calc-gaso').addEventListener('click', handleGasometria);
}

function handleGasometria() {
    const rawFio2 = parseFloat(byId('gaso-fio2').value);
    const fio2Corrigida = (rawFio2 && rawFio2 > 1) ? rawFio2 / 100 : (rawFio2 || 0.21); // Converte 21% para 0.21

    const dados = {
        tipoAmostra: byId('gaso-tipo').value,
        pH: parseFloat(byId('gaso-ph').value),
        pCO2: parseFloat(byId('gaso-pco2').value),
        hco3: parseFloat(byId('gaso-hco3').value),
        pO2: parseFloat(byId('gaso-po2').value) || null,
        fio2: fio2Corrigida,
        sodio: parseFloat(byId('gaso-na').value) || null,
        cloro: parseFloat(byId('gaso-cl').value) || null,
        albumina: parseFloat(byId('gaso-alb').value) || null,
        lactato: parseFloat(byId('gaso-lac').value) || null
    };

    try {
        const res = interpretarGasometria(dados);
        renderHTMLGasometria(res);
    } catch (e) {
        const box = byId('res-gaso');
        box.style.display = 'block';
        box.innerHTML = `<span style="color:#c0392b; font-weight:bold;">Erro: ${e.message}</span>`;
    }
}

function renderHTMLGasometria(res) {
    let html = `<div style="font-size: 0.95rem; line-height: 1.6;">`;
    
    // Status do pH e Diagnóstico Principal
    let colorPH = res.estadoPH === "pH dentro da faixa de referência" ? "#27ae60" : "#c0392b";
    html += `<strong style="font-size: 1.1rem; color: ${colorPH};">${res.estadoPH}</strong><br>`;
    
    if (res.disturbioPrimario.length > 0) {
        html += `<strong>Distúrbio Primário:</strong> ${res.disturbioPrimario.join(" + ")}<br>`;
    }

    // Compensação
    if (res.compensacao) {
        const comp = res.compensacao;
        html += `<div style="background: #fffdf5; border-left: 3px solid #f39c12; padding: 8px; margin: 10px 0; font-size: 0.85rem;">
            <strong>Análise de Compensação (${comp.tipo}):</strong><br>
            • ${comp.variavelAvaliada} Esperado: ${comp.esperadoAgudo ? comp.esperadoAgudo + ' (Agudo) / ' + comp.esperadoCronico + ' (Crônico)' : comp.intervaloEsperado.join(" a ")}<br>
            • ${comp.variavelAvaliada} Observado: ${comp.observado}<br>
            <strong style="color:#d35400;">Conclusão: ${comp.interpretacao}</strong>
        </div>`;
    }

    // Distúrbios Mistos
    if (res.disturbiosMistos.length > 0) {
        let unicos = [...new Set(res.disturbiosMistos)];
        html += `<strong>⚠️ Distúrbios Mistos Prováveis:</strong> <span style="color:#e74c3c;">${unicos.join("; ")}</span><br>`;
    }

    // Anion Gap & Delta Ratio
    if (res.anionGap !== null) {
        html += `<hr style="border: 0; border-top: 1px dashed rgba(0,0,0,0.1); margin: 10px 0;">`;
        html += `<strong>Ânion Gap:</strong> ${res.anionGap} mEq/L<br>`;
        if (res.anionGapCorrigido !== null) {
            html += `<strong>AG Corrigido (Albumina):</strong> ${res.anionGapCorrigido} mEq/L<br>`;
        }
        if (res.deltaRatio !== null) {
            html += `<strong>Delta Ratio (ΔAG/ΔHCO3):</strong> ${res.deltaRatio}<br>`;
        }
    }

    // Oxigenação
    if (res.oxigenacao) {
        html += `<hr style="border: 0; border-top: 1px dashed rgba(0,0,0,0.1); margin: 10px 0;">`;
        html += `<strong>Relação PaO₂/FiO₂:</strong> ${res.oxigenacao.relacaoPF} <br>`;
        html += `<strong>Oxigenação:</strong> <span style="color:#2980b9;">${res.oxigenacao.classificacao}</span><br>`;
    }

    // Alertas
    if (res.alertas.length > 0) {
        html += `<div style="background: #fadbd8; color: #c0392b; border-radius: 6px; padding: 10px; margin-top: 12px; font-size: 0.85rem;">
            <strong>🚨 Alertas Clínicos:</strong><br>
            <ul style="margin: 5px 0 0 15px; padding: 0;">
                ${res.alertas.map(a => `<li>${a}</li>`).join("")}
            </ul>
        </div>`;
    }

    html += `</div>`;

    const box = byId('res-gaso');
    box.style.display = 'block';
    box.innerHTML = html;
}

// =========================================================
// O SEU MOTOR MATEMÁTICO INTATO
// =========================================================

function interpretarGasometria(dados) {
    const {
        tipoAmostra = "arterial",
        pH, pCO2, hco3,
        pO2 = null,
        fio2 = 0.21,
        sodio = null,
        cloro = null,
        albumina = null,
        lactato = null
    } = dados;

    validarEntradas({ pH, pCO2, hco3, pO2, fio2 });

    const resultado = {
        tipoAmostra, estadoPH: "", disturbioPrimario: [], compensacao: null,
        disturbiosMistos: [], anionGap: null, anionGapCorrigido: null,
        deltaRatio: null, oxigenacao: null, alertas: [], resumo: ""
    };

    if (pH < 7.35) resultado.estadoPH = "Acidemia";
    else if (pH > 7.45) resultado.estadoPH = "Alcalemia";
    else resultado.estadoPH = "pH dentro da faixa de referência";

    const co2Alto = pCO2 > 45;
    const co2Baixo = pCO2 < 35;
    const hco3Alto = hco3 > 26;
    const hco3Baixo = hco3 < 22;

    if (pH < 7.35) {
        if (hco3Baixo) resultado.disturbioPrimario.push("Acidose metabólica");
        if (co2Alto) resultado.disturbioPrimario.push("Acidose respiratória");
    }

    if (pH > 7.45) {
        if (hco3Alto) resultado.disturbioPrimario.push("Alcalose metabólica");
        if (co2Baixo) resultado.disturbioPrimario.push("Alcalose respiratória");
    }

    if (pH >= 7.35 && pH <= 7.45) {
        if (co2Alto && hco3Alto) {
            if (pH < 7.40) resultado.disturbioPrimario.push("Provável acidose respiratória compensada");
            else if (pH > 7.40) resultado.disturbioPrimario.push("Provável alcalose metabólica compensada");
            else resultado.disturbioPrimario.push("Distúrbio compensado ou misto");
        } else if (co2Baixo && hco3Baixo) {
            if (pH < 7.40) resultado.disturbioPrimario.push("Provável acidose metabólica compensada");
            else if (pH > 7.40) resultado.disturbioPrimario.push("Provável alcalose respiratória compensada");
            else resultado.disturbioPrimario.push("Distúrbio compensado ou misto");
        } else if (!co2Alto && !co2Baixo && !hco3Alto && !hco3Baixo) {
            resultado.disturbioPrimario.push("Sem distúrbio ácido-base evidente");
        }
    }

    if (resultado.disturbioPrimario.includes("Acidose metabólica")) resultado.compensacao = compensacaoAcidoseMetabolica(pCO2, hco3);
    else if (resultado.disturbioPrimario.includes("Alcalose metabólica")) resultado.compensacao = compensacaoAlcaloseMetabolica(pCO2, hco3);
    else if (resultado.disturbioPrimario.includes("Acidose respiratória")) resultado.compensacao = compensacaoAcidoseRespiratoria(pCO2, hco3);
    else if (resultado.disturbioPrimario.includes("Alcalose respiratória")) resultado.compensacao = compensacaoAlcaloseRespiratoria(pCO2, hco3);

    if (resultado.compensacao && resultado.compensacao.disturbioAssociado) {
        resultado.disturbiosMistos.push(resultado.compensacao.disturbioAssociado);
    }

    if (Number.isFinite(sodio) && Number.isFinite(cloro) && Number.isFinite(hco3)) {
        resultado.anionGap = arredondar(sodio - cloro - hco3, 1);

        if (Number.isFinite(albumina)) {
            resultado.anionGapCorrigido = arredondar(resultado.anionGap + 2.5 * (4 - albumina), 1);
        }

        const agParaAnalise = resultado.anionGapCorrigido ?? resultado.anionGap;

        if (agParaAnalise > 12 && hco3 < 24) {
            resultado.deltaRatio = calcularDeltaRatio(agParaAnalise, hco3);
            resultado.disturbiosMistos.push(interpretarDeltaRatio(resultado.deltaRatio));
        }
    }

    if (Number.isFinite(lactato)) {
        if (lactato >= 4) resultado.alertas.push(`Lactato significativamente elevado: ${lactato} mmol/L`);
        else if (lactato > 2) resultado.alertas.push(`Lactato elevado: ${lactato} mmol/L`);
    }

    if (Number.isFinite(pO2)) {
        if (tipoAmostra === "arterial") resultado.oxigenacao = interpretarOxigenacao(pO2, fio2);
        else resultado.alertas.push("A pO₂ venosa ou capilar não deve ser usada para avaliar adequadamente a oxigenação arterial.");
    }

    if (pH < 7.10) resultado.alertas.push("Acidemia grave: pH menor que 7,10.");
    if (pH > 7.60) resultado.alertas.push("Alcalemia grave: pH maior que 7,60.");
    if (pCO2 > 70) resultado.alertas.push("Hipercapnia importante: correlacionar com ventilação e estado clínico.");
    if (hco3 < 10) resultado.alertas.push("Bicarbonato muito reduzido: acidose metabólica importante.");

    resultado.resumo = gerarResumo(resultado);
    return resultado;
}

function compensacaoAcidoseMetabolica(pCO2, hco3) {
    const esperado = 1.5 * hco3 + 8;
    const minimo = esperado - 2;
    const maximo = esperado + 2;
    let interpretacao, disturbioAssociado = null;

    if (pCO2 < minimo) {
        interpretacao = "pCO₂ menor que a compensação esperada";
        disturbioAssociado = "Alcalose respiratória associada";
    } else if (pCO2 > maximo) {
        interpretacao = "pCO₂ maior que a compensação esperada";
        disturbioAssociado = "Acidose respiratória associada";
    } else interpretacao = "Compensação respiratória apropriada";

    return { tipo: "Acidose metabólica", variavelAvaliada: "pCO₂", esperado: arredondar(esperado, 1), intervaloEsperado: [arredondar(minimo, 1), arredondar(maximo, 1)], observado: pCO2, interpretacao, disturbioAssociado };
}

function compensacaoAlcaloseMetabolica(pCO2, hco3) {
    const esperado = 40 + 0.7 * (hco3 - 24);
    const minimo = esperado - 5;
    const maximo = esperado + 5;
    let interpretacao, disturbioAssociado = null;

    if (pCO2 < minimo) {
        interpretacao = "pCO₂ menor que a compensação esperada";
        disturbioAssociado = "Alcalose respiratória associada";
    } else if (pCO2 > maximo) {
        interpretacao = "pCO₂ maior que a compensação esperada";
        disturbioAssociado = "Acidose respiratória associada";
    } else interpretacao = "Compensação respiratória apropriada";

    return { tipo: "Alcalose metabólica", variavelAvaliada: "pCO₂", esperado: arredondar(esperado, 1), intervaloEsperado: [arredondar(minimo, 1), arredondar(maximo, 1)], observado: pCO2, interpretacao, disturbioAssociado };
}

function compensacaoAcidoseRespiratoria(pCO2, hco3) {
    const aumentoCO2 = Math.max(0, pCO2 - 40);
    const hco3Agudo = 24 + (aumentoCO2 / 10) * 1;
    const hco3Cronico = 24 + (aumentoCO2 / 10) * 4;
    return compararRespiratorio({ tipo: "Acidose respiratória", hco3, esperadoAgudo: hco3Agudo, esperadoCronico: hco3Cronico, disturbioSeBaixo: "Acidose metabólica associada", disturbioSeAlto: "Alcalose metabólica associada" });
}

function compensacaoAlcaloseRespiratoria(pCO2, hco3) {
    const quedaCO2 = Math.max(0, 40 - pCO2);
    const hco3Agudo = 24 - (quedaCO2 / 10) * 2;
    const hco3Cronico = 24 - (quedaCO2 / 10) * 5;
    return compararRespiratorio({ tipo: "Alcalose respiratória", hco3, esperadoAgudo: hco3Agudo, esperadoCronico: hco3Cronico, disturbioSeBaixo: "Acidose metabólica associada", disturbioSeAlto: "Alcalose metabólica associada" });
}

function compararRespiratorio({ tipo, hco3, esperadoAgudo, esperadoCronico, disturbioSeBaixo, disturbioSeAlto }) {
    const tolerancia = 2;
    const distanciaAgudo = Math.abs(hco3 - esperadoAgudo);
    const distanciaCronico = Math.abs(hco3 - esperadoCronico);
    const provavelmente = distanciaAgudo <= distanciaCronico ? "Provavelmente agudo" : "Provavelmente crônico";
    const esperadoMaisProximo = distanciaAgudo <= distanciaCronico ? esperadoAgudo : esperadoCronico;

    let disturbioAssociado = null;
    let interpretacao;

    if (hco3 < esperadoMaisProximo - tolerancia) {
        interpretacao = "HCO₃ menor que o esperado para compensação";
        disturbioAssociado = disturbioSeBaixo;
    } else if (hco3 > esperadoMaisProximo + tolerancia) {
        interpretacao = "HCO₃ maior que o esperado para compensação";
        disturbioAssociado = disturbioSeAlto;
    } else interpretacao = "Compensação metabólica aproximadamente apropriada";

    return { tipo, provavelmente, variavelAvaliada: "HCO₃", observado: hco3, esperadoAgudo: arredondar(esperadoAgudo, 1), esperadoCronico: arredondar(esperadoCronico, 1), interpretacao, disturbioAssociado };
}

function calcularDeltaRatio(anionGap, hco3) {
    const deltaAG = anionGap - 12;
    const deltaHCO3 = 24 - hco3;
    if (deltaHCO3 <= 0) return null;
    return arredondar(deltaAG / deltaHCO3, 2);
}

function interpretarDeltaRatio(deltaRatio) {
    if (!Number.isFinite(deltaRatio)) return "Delta ratio não interpretável";
    if (deltaRatio < 0.4) return "Predomínio de acidose metabólica hiperclorêmica";
    if (deltaRatio < 0.8) return "Possível acidose metabólica mista: ânion gap elevado e hiperclorêmica";
    if (deltaRatio <= 2) return "Compatível com acidose metabólica de ânion gap elevado predominante";
    return "Possível alcalose metabólica ou acidose respiratória crônica associada";
}

function interpretarOxigenacao(pO2, fio2) {
    if (!Number.isFinite(fio2) || fio2 <= 0 || fio2 > 1) return { erro: "FiO₂ inválida. Use um valor entre 0,21 e 1,0." };
    const relacaoPF = pO2 / fio2;
    let classificacao;
    if (relacaoPF >= 400) classificacao = "Relação PaO₂/FiO₂ preservada";
    else if (relacaoPF >= 300) classificacao = "Discreta redução da eficiência de oxigenação";
    else if (relacaoPF >= 200) classificacao = "Alteração moderada da oxigenação";
    else if (relacaoPF >= 100) classificacao = "Alteração importante da oxigenação";
    else classificacao = "Alteração muito grave da oxigenação";
    return { pO2, fio2, relacaoPF: arredondar(relacaoPF, 0), classificacao };
}

function gerarResumo(resultado) {
    const partes = [];
    partes.push(resultado.estadoPH);
    if (resultado.disturbioPrimario.length > 0) partes.push(resultado.disturbioPrimario.join(" + "));
    if (resultado.compensacao?.interpretacao) partes.push(resultado.compensacao.interpretacao);
    if (resultado.disturbiosMistos.length > 0) partes.push(`Possíveis distúrbios associados: ${[...new Set(resultado.disturbiosMistos)].join("; ")}`);
    if (Number.isFinite(resultado.anionGap)) partes.push(`Ânion gap: ${resultado.anionGap} mEq/L`);
    if (Number.isFinite(resultado.anionGapCorrigido)) partes.push(`Ânion gap corrigido: ${resultado.anionGapCorrigido} mEq/L`);
    return partes.join(". ") + ".";
}

function arredondar(valor, casas = 1) {
    const fator = 10 ** casas;
    return Math.round(valor * fator) / fator;
}

function validarEntradas({ pH, pCO2, hco3, pO2, fio2 }) {
    if (!Number.isFinite(pH) || pH < 6.5 || pH > 8) throw new Error("pH inválido. Use vírgula ou ponto corretamente.");
    if (!Number.isFinite(pCO2) || pCO2 <= 0) throw new Error("pCO₂ inválida.");
    if (!Number.isFinite(hco3) || hco3 <= 0) throw new Error("HCO₃ inválido.");
    if (pO2 !== null && (!Number.isFinite(pO2) || pO2 <= 0)) throw new Error("pO₂ inválida.");
    if (!Number.isFinite(fio2) || fio2 < 0.21 || fio2 > 1) throw new Error("FiO₂ inválida. Informe uma fração (0.21) ou porcentagem (21%).");
}
