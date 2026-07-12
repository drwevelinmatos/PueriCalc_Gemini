// tabs/emergencia/index.js

export function renderEmergencia() {
  const container = document.getElementById('tab-emergencia') || document.getElementById('tab-emerg');
  if (!container) return;

  container.innerHTML = `
    <div class="card" style="border-left: 5px solid #e74c3c; background: #fff5f5; margin-bottom: 20px;">
      <div class="card-header" style="border: none; padding-left: 0;">
        <h2 style="color: #c0392b; margin-top: 0; font-size: 1.3rem;">🚨 Dados da Criança (Auto-Calculadora)</h2>
        <p style="font-size: 0.85rem; color: #5f7382; margin-top: 4px;">Digite o peso para calcular instantaneamente todos os volumes (mL) das drogas e equipamentos.</p>
      </div>
      <div class="grid-2">
        <div>
          <label style="font-weight: bold; color: #c0392b;">Peso Atual (kg) <span style="color:red">*</span></label>
          <input type="number" step="0.1" id="em-peso" placeholder="Ex: 15.5" style="font-size: 1.3rem; font-weight: bold; color: #c0392b; border-color: #e74c3c; padding: 12px;">
        </div>
        <div>
          <label style="font-weight: bold;">Idade (Para Parâmetros / Equipamentos)</label>
          <select id="em-idade-eq" style="width:100%; padding:12px; border-radius:6px; border:1px solid #ccc; font-size: 1rem;">
            <option value="" disabled selected>Selecione a faixa etária...</option>
            <option value="RNPT">RN Pré-Termo (< 2kg)</option>
            <option value="RNT">RN Termo (~ 3kg)</option>
            <option value="6m">6 meses (~ 7kg)</option>
            <option value="1a">1 ano (~ 10kg)</option>
            <option value="2a">2 anos (~ 12kg)</option>
            <option value="4a">4 anos (~ 16kg)</option>
            <option value="6a">6 anos (~ 20kg)</option>
            <option value="8a">8 anos (~ 25kg)</option>
            <option value="10a">10 anos (~ 30kg)</option>
            <option value="12a">12 anos (~ 40kg)</option>
            <option value="Adolescente">Adolescente (> 50kg)</option>
          </select>
        </div>
      </div>
    </div>
    
    <div id="em-resultados" style="display: none; animation: fadeIn 0.3s ease;">
        
        ${createTableBlock('Parada Cardiorrespiratória (PCR)', '#c0392b', [
            {droga: 'Desfibrilação', apres: 'Choque Não Sincronizado', dose: '2 a 4 J/kg', id: 'em-desfib', nota: 'Máx: 360 J'},
            {droga: 'Cardioversão', apres: 'Choque Sincronizado', dose: '0,5 a 1 J/kg', id: 'em-cardio', nota: 'Se refratário: 2 J/kg'},
            {droga: 'Adrenalina (Bolus)', apres: '1 mg/mL (Diluir 1mL + 9mL AD)', dose: '0,01 mg/kg', id: 'em-adr-ev', nota: 'Bolus Rápido EV/IO. Lavar c/ 20mL SF.<br>Máx: 10 mL (1mg).'},
            {droga: 'Adrenalina (TOT)', apres: '1 mg/mL (Pura)', dose: '0,1 mg/kg', id: 'em-adr-tot', nota: 'Injetar no tubo. Lavar c/ 5mL SF.<br>Máx: 2,5 mL.'},
            {droga: 'Amiodarona', apres: '50 mg/mL', dose: '5 mg/kg', id: 'em-amiodarona', nota: 'Bolus na FV/TV sem pulso.<br>Máx: 300mg (6mL).'},
            {droga: 'Lidocaína 2%', apres: '20 mg/mL', dose: '1 mg/kg', id: 'em-lido', nota: 'Alternativa à Amiodarona.<br>Lento. Máx: 100mg (5mL).'}
        ])}
        
        ${createTableBlock('Sequência Rápida de Intubação & Sedação', '#d35400', [
            {droga: 'Atropina', apres: '0,25 mg/mL', dose: '0,02 mg/kg', id: 'em-atro', nota: 'Previne bradicardia.<br>Mín: 0,4 mL. Máx: 4 mL.'},
            {droga: 'Fentanil', apres: '50 mcg/mL', dose: '1 a 4 mcg/kg', id: 'em-fent', nota: 'Pode diluir em 3mL de AD.<br>EV Lento (3 min).'},
            {droga: 'Midazolam', apres: '5 mg/mL', dose: '0,2 mg/kg', id: 'em-mida-sri', nota: 'Sedação. Causa hipotensão.<br>EV Lento.'},
            {droga: 'Cetamina', apres: '50 mg/mL', dose: '2 mg/kg', id: 'em-ceta', nota: 'Mantém drive respiratório.<br>EV Lento (2 min).'},
            {droga: 'Etomidato', apres: '2 mg/mL', dose: '0,2 a 0,4 mg/kg', id: 'em-etom', nota: 'Mantém estabilidade hemodinâmica.<br>EV Lento.'},
            {droga: 'Propofol', apres: '10 mg/mL', dose: '1 a 3 mg/kg', id: 'em-prop', nota: 'Atenção à hipotensão.<br>EV Lento.'},
            {droga: 'Succinilcolina', apres: '20 mg/mL', dose: '1 a 2 mg/kg', id: 'em-succ', nota: 'Relaxante despolarizante.<br>Bolus Rápido.'},
            {droga: 'Rocurônio', apres: '10 mg/mL', dose: '1 mg/kg', id: 'em-rocu', nota: 'Relaxante não-despolarizante.<br>Bolus Rápido.'}
        ])}
        
        ${createTableBlock('Urgências Neurológicas (Anticonvulsivantes)', '#8e44ad', [
            {droga: 'Diazepam', apres: '5 mg/mL', dose: '0,2 a 0,3 mg/kg', id: 'em-diaz', nota: 'EV Lento.<br>Máx: 5mg (<5a) ou 10mg (>5a).'},
            {droga: 'Midazolam', apres: '5 mg/mL', dose: '0,2 mg/kg', id: 'em-mida-neuro', nota: 'Pode ser feito IM, EV ou IN.<br>(Se IN: metade em cada narina).'},
            {droga: 'Fenobarbital', apres: '100 mg/mL', dose: '20 mg/kg', id: 'em-feno', nota: 'Diluir no dobro de SF 0,9%.<br>Correr em 15 min.'},
            {droga: 'Fenitoína', apres: '50 mg/mL', dose: '15 a 20 mg/kg', id: 'em-fenit', nota: 'Diluir em SF 0,9% (NÃO usar SG!).<br>Infusão Lenta (máx 1mg/kg/min).'}
        ])}

        ${createTableBlock('Distúrbios Metabólicos Específicos', '#2980b9', [
            {droga: 'Glicose 25%', apres: 'Preparo: Glicose 50% + AD (1:1)', dose: '0,5 a 1 g/kg', id: 'em-glic25', nota: 'Hipoglicemia.<br>Bolus EV Lento.'},
            {droga: 'Gluconato Ca²⁺ 10%', apres: '100 mg/mL', dose: '1 a 2 mL/kg', id: 'em-gluca', nota: 'Diluir 1:1. Lento sob monitorização.<br>Máx: 30 mL (3g).'},
            {droga: 'Bicarbonato de Sódio', apres: '8,4% (1 mEq/mL)', dose: '1 mEq/kg', id: 'em-bic', nota: 'Diluir 1:1 com AD.<br>Infusão Lenta.'}
        ])}

        <div class="card" style="border-left: 5px solid #27ae60; margin-bottom: 15px;">
          <div class="card-header" style="border: none; padding-left: 0;">
            <h2 style="color: #27ae60; margin-top: 0; font-size: 1.15rem;">Drogas Vasoativas (Infusão Contínua em BIC)</h2>
          </div>
          <div class="grid-2">
            <div style="background: #f8fbfd; padding: 12px; border-radius: 8px; border: 1px solid #d8e2ea;">
              <h3 style="color: #27ae60; margin-top: 0; font-size: 1.05rem;">Adrenalina (Epinefrina)</h3>
              <p style="font-size: 0.8rem; margin-top: 0; color: #5f7382; line-height: 1.4;">
                Diluição: <strong>2 mL (2mg) + 48 mL SF 0,9%</strong><br>Concentração: 40 mcg/mL
              </p>
              <label style="font-weight: bold; font-size: 0.85rem;">Dose (mcg/kg/min):</label>
              <div style="display:flex; gap:10px; align-items:center; margin-top: 5px;">
                <input type="number" id="vaso-epi-dose" step="0.05" value="0.1" style="width: 80px; padding: 8px; border-radius: 6px; border: 1px solid #ccc; font-weight: bold; color: var(--texto);">
                <strong style="color: #c0392b; font-size: 1.25rem; margin-left: auto; text-align: right;" id="vaso-epi-mlh">- mL/h</strong>
              </div>
            </div>
            
            <div style="background: #f8fbfd; padding: 12px; border-radius: 8px; border: 1px solid #d8e2ea;">
              <h3 style="color: #27ae60; margin-top: 0; font-size: 1.05rem;">Dobutamina</h3>
              <p style="font-size: 0.8rem; margin-top: 0; color: #5f7382; line-height: 1.4;">
                Diluição: <strong>20 mL (250mg) + 230 mL SG 5%</strong><br>Concentração: 1000 mcg/mL (1 mg/mL)
              </p>
              <label style="font-weight: bold; font-size: 0.85rem;">Dose (mcg/kg/min):</label>
              <div style="display:flex; gap:10px; align-items:center; margin-top: 5px;">
                <input type="number" id="vaso-dob-dose" step="1" value="5" style="width: 80px; padding: 8px; border-radius: 6px; border: 1px solid #ccc; font-weight: bold; color: var(--texto);">
                <strong style="color: #c0392b; font-size: 1.25rem; margin-left: auto; text-align: right;" id="vaso-dob-mlh">- mL/h</strong>
              </div>
            </div>
          </div>
        </div>

        <div class="card" style="border-left: 5px solid #f39c12; margin-bottom: 15px;">
          <div class="card-header" style="border: none; padding-left: 0; display: flex; justify-content: space-between; align-items: center;">
            <h2 style="color: #d35400; margin-top: 0; font-size: 1.15rem;">Tubos, Sondas e Acessos</h2>
            <span id="eq-title" style="font-weight: bold; background: #fff5e6; color: #d35400; padding: 4px 10px; border-radius: 12px; font-size: 0.85rem;">Selecione a idade no topo</span>
          </div>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem; text-align: left; margin-top: 5px;">
              <tbody>
                <tr style="border-bottom: 1px solid #ecf0f1;">
                  <td style="padding: 10px 5px; color:#5f7382; width: 55%;">Tubo Traqueal (TOT)</td>
                  <td style="padding: 10px 5px; font-weight:bold; color:var(--texto);" id="eq-tubo">-</td>
                </tr>
                <tr style="border-bottom: 1px solid #ecf0f1;">
                  <td style="padding: 10px 5px; color:#5f7382;">Lâmina de Laringoscópio</td>
                  <td style="padding: 10px 5px; font-weight:bold; color:var(--texto);" id="eq-lamina">-</td>
                </tr>
                <tr style="border-bottom: 1px solid #ecf0f1;">
                  <td style="padding: 10px 5px; color:#5f7382;">Fixação do TOT (Lábio)</td>
                  <td style="padding: 10px 5px; font-weight:bold; color:var(--texto);" id="eq-fix">-</td>
                </tr>
                <tr style="border-bottom: 1px solid #ecf0f1;">
                  <td style="padding: 10px 5px; color:#5f7382;">Sonda de Aspiração / Vesical (SVD)</td>
                  <td style="padding: 10px 5px; font-weight:bold; color:var(--texto);">Asp: <span id="eq-asp" style="color:var(--primary);">-</span> | SVD: <span id="eq-svd" style="color:var(--primary);">-</span></td>
                </tr>
                <tr style="border-bottom: 1px solid #ecf0f1;">
                  <td style="padding: 10px 5px; color:#5f7382;">Acesso Periférico (Jelco)</td>
                  <td style="padding: 10px 5px; font-weight:bold; color:var(--texto);" id="eq-jelco">-</td>
                </tr>
                <tr>
                  <td style="padding: 10px 5px; color:#5f7382;">Dreno de Tórax / Cateter Venoso</td>
                  <td style="padding: 10px 5px; font-weight:bold; color:var(--texto);">Dreno: <span id="eq-dreno" style="color:#d35400;">-</span> | CVC: <span id="eq-cateter" style="color:#d35400;">-</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

    </div>
  `;

  // Bind Events
  byId('em-peso').addEventListener('input', runCalculations);
  byId('vaso-epi-dose').addEventListener('input', runVasoativas);
  byId('vaso-dob-dose').addEventListener('input', runVasoativas);
  byId('em-idade-eq').addEventListener('change', runEquipments);
}

// === FACTORY PARA CRIAR TABELAS LIMPAS ===
function createTableBlock(title, color, rows) {
    let html = `
    <div class="card" style="border-left: 5px solid ${color}; margin-bottom: 15px;">
        <div class="card-header" style="border: none; padding-left: 0;">
            <h2 style="color: ${color}; margin-top: 0; font-size: 1.15rem;">${title}</h2>
        </div>
        <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left;">
                <thead>
                    <tr style="border-bottom: 2px solid #ecf0f1; color: #5f7382; font-size: 0.85rem;">
                        <th style="padding: 8px 5px;">Droga / Apresentação</th>
                        <th style="padding: 8px 5px;">Dose Padrão</th>
                        <th style="padding: 8px 5px; text-align: right;">Administrar</th>
                        <th style="padding: 8px 10px; text-align: right;">Notas</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    rows.forEach(r => {
        html += `
        <tr style="border-bottom: 1px solid #ecf0f1;">
            <td style="padding: 12px 5px; line-height: 1.3; min-width: 140px;">
                <strong style="color: var(--texto);">${r.droga}</strong><br>
                <span style="font-size:0.8rem; color:#7f8c8d;">${r.apres}</span>
            </td>
            <td style="padding: 12px 5px; color:#5f7382; font-size:0.85rem; font-weight: 500; min-width: 80px;">${r.dose}</td>
            <td style="padding: 12px 5px; color: ${color}; font-weight:800; font-size:1.1rem; white-space:nowrap; text-align: right; min-width: 90px;" id="${r.id}">
                -
            </td>
            <td style="padding: 12px 10px; font-size:0.8rem; color:#5f7382; line-height: 1.3; min-width: 160px; text-align: right;">${r.nota}</td>
        </tr>`;
    });
    
    html += `</tbody></table></div></div>`;
    return html;
}

// === MOTOR MATEMÁTICO E ATUALIZAÇÃO UI ===
function runCalculations() {
    const p = parseFloat(byId('em-peso').value);
    const resultBox = byId('em-resultados');
    
    if (!p || p <= 0) {
        resultBox.style.display = 'none';
        return;
    }
    
    resultBox.style.display = 'block';

    // Helper formatador
    const fmt = (val, min, max, unit = 'mL') => {
        let finalVal = val;
        if (min !== null && finalVal < min) finalVal = min;
        if (max !== null && finalVal > max) finalVal = max;
        return `<span style="font-size:1.4rem;">${finalVal.toFixed(1)}</span> ${unit}`;
    };

    // 1. PCR
    byId('em-desfib').innerHTML = `<strong>${Math.round(p*2)} J</strong> (1º) &rarr; <strong>${Math.min(Math.round(p*4), 360)} J</strong>`;
    byId('em-cardio').innerHTML = `<strong>${Math.max(1, Math.round(p*0.5))}</strong> a <strong>${Math.round(p*1)} J</strong>`;
    byId('em-adr-ev').innerHTML = fmt(p * 0.1, null, 10);
    byId('em-adr-tot').innerHTML = fmt(p * 0.1, null, 2.5);
    byId('em-amiodarona').innerHTML = fmt(p * 0.1, null, 6);
    byId('em-lido').innerHTML = fmt(p * 0.05, null, 5);

    // 2. SRI
    byId('em-atro').innerHTML = fmt(p * 0.08, 0.4, 4.0);
    byId('em-fent').innerHTML = fmt(p * 0.04);
    byId('em-mida-sri').innerHTML = fmt(p * 0.04);
    byId('em-ceta').innerHTML = fmt(p * 0.04);
    byId('em-etom').innerHTML = fmt(p * 0.1); 
    byId('em-prop').innerHTML = fmt(p * 0.1); 
    byId('em-succ').innerHTML = fmt(p * 0.05); 
    byId('em-rocu').innerHTML = fmt(p * 0.1);

    // 3. NEUROLÓGICO
    const maxDiaz = p < 20 ? 1 : 2; // Máx de 5mg(1mL) se <5anos, ou 10mg(2mL) se >5anos
    byId('em-diaz').innerHTML = fmt(p * 0.04, null, maxDiaz);
    byId('em-mida-neuro').innerHTML = fmt(p * 0.04, null, 2); 
    byId('em-feno').innerHTML = fmt(p * 0.2);
    byId('em-fenit').innerHTML = fmt(p * 0.4);

    // 4. METABÓLICO
    byId('em-glic25').innerHTML = fmt(p * 2);
    byId('em-gluca').innerHTML = fmt(p * 1, null, 30);
    byId('em-bic').innerHTML = fmt(p * 1);

    // Sincroniza Vasoativas
    runVasoativas();
}

function runVasoativas() {
    const p = parseFloat(byId('em-peso').value);
    if (!p || p <= 0) return;

    // Epinefrina: 2mg em 50mL (40mcg/mL). Fórmula: mL/h = (Dose * P * 60) / 40
    const epiDose = parseFloat(byId('vaso-epi-dose').value) || 0.1;
    const epiMlh = (epiDose * p * 60) / 40;
    byId('vaso-epi-mlh').innerHTML = `<span style="font-size:1.5rem;">${epiMlh.toFixed(1)}</span> mL/h`;

    // Dobutamina: 250mg em 250mL (1000mcg/mL). Fórmula: mL/h = (Dose * P * 60) / 1000
    const dobDose = parseFloat(byId('vaso-dob-dose').value) || 5;
    const dobMlh = (dobDose * p * 60) / 1000;
    byId('vaso-dob-mlh').innerHTML = `<span style="font-size:1.5rem;">${dobMlh.toFixed(1)}</span> mL/h`;
}

// === BANCO DE EQUIPAMENTOS POR IDADE ===
const EQUIPAMENTOS = {
  'RNPT': {tubo: '2.5 / 3.0 s/ cuff', lamina: 'Reta 00 ou 0', fix: '7 a 8 cm', asp: '4 ou 6', jelco: '22 a 24', dreno: '8 a 10', cateter: '3F / 22G', svd: '4 ou 6'},
  'RNT': {tubo: '3.0 a 3.5 c/ cuff', lamina: 'Reta 0', fix: '9 a 11 cm', asp: '6', jelco: '22 a 24', dreno: '10 a 12', cateter: '3F / 22G', svd: '6 a 8'},
  '6m': {tubo: '3.5 a 4.0 c/ cuff', lamina: 'Reta 1', fix: '10 a 12 cm', asp: '6 a 8', jelco: '22', dreno: '10 a 12', cateter: '4F / 20-22G', svd: '8'},
  '1a': {tubo: '4.0 a 4.5 c/ cuff', lamina: 'Reta 1 ou 2', fix: '11 a 13.5 cm', asp: '8', jelco: '20 a 22', dreno: '12 a 16', cateter: '4F / 20-22G', svd: '8 a 10'},
  '2a': {tubo: '4.5 a 5.0 c/ cuff', lamina: 'Reta/Curva 2', fix: '12 a 14 cm', asp: '8', jelco: '20', dreno: '16 a 20', cateter: '5F / 18-20G', svd: '10'},
  '4a': {tubo: '5.0 a 5.5 c/ cuff', lamina: 'Reta/Curva 2', fix: '14 a 15 cm', asp: '10', jelco: '18 a 20', dreno: '20 a 24', cateter: '5F / 18G', svd: '10'},
  '6a': {tubo: '5.5 c/ cuff', lamina: 'Reta/Curva 2', fix: '15 a 16.5 cm', asp: '10', jelco: '18', dreno: '20 a 28', cateter: '5F / 18G', svd: '10 a 12'},
  '8a': {tubo: '6.0 c/ cuff', lamina: 'Curva 2 ou 3', fix: '16.5 a 18 cm', asp: '12', jelco: '16 a 18', dreno: '28 a 32', cateter: '6F / 18-16G', svd: '12'},
  '10a': {tubo: '6.5 c/ cuff', lamina: 'Curva 2 ou 3', fix: '18 a 19.5 cm', asp: '12', jelco: '16', dreno: '28 a 32', cateter: '6F / 18-16G', svd: '12'},
  '12a': {tubo: '7.0 c/ cuff', lamina: 'Curva 3', fix: '19.5 a 21 cm', asp: '14', jelco: '16', dreno: '28 a 32', cateter: '6F / 16G', svd: '12 a 14'},
  'Adolescente': {tubo: '7.5 a 8.0 c/ cuff', lamina: 'Curva 3', fix: '21 a 24 cm', asp: '14', jelco: '14 a 16', dreno: '32 a 38', cateter: '6F / 14-16G', svd: '14'}
};

function runEquipments() {
    const age = byId('em-idade-eq').value;
    const eq = EQUIPAMENTOS[age];
    if (!eq) return;

    byId('eq-title').innerText = "Parâmetros para " + age;
    byId('eq-tubo').innerText = eq.tubo;
    byId('eq-lamina').innerText = eq.lamina;
    byId('eq-fix').innerText = eq.fix;
    byId('eq-asp').innerText = eq.asp;
    byId('eq-jelco').innerText = eq.jelco;
    byId('eq-dreno').innerText = eq.dreno;
    byId('eq-cateter').innerText = eq.cateter;
    byId('eq-svd').innerText = eq.svd;
}
