// tabs/laboratorios/index.js
import { GoogleGenAI } from 'https://esm.run/@google/genai';

// ============================================================================
// 1. BANCO DE DADOS: BIOQUÍMICA, HEMOGRAMA
// ============================================================================
const examesList = [
  "albumina","alt","ast","bilirrubinaDireta","bilirrubinaTotal","calcio",
  "creatinina","ferritina","fosfataseAlcalina","fosforo","glicose",
  "hemoglobina","hematocrito","leucocitos","neutrofilos","plaquetas",
  "potassio","sodio","triglicerides","colesterolTotal","hdl","ldl","vldl",
  "amilase","lipase","gamaGT","pcr","dhl","vhs","bilirrubinaIndireta",
  "ferro","transferrina","capacidadeLigacaoFerro","ureia","calcioIonico",
  "hemoglobinaGlicada","hcm","vcm","selenio","cloro","zinco","magnesio",
  "tsh","t3","t4","t4livre","vitaminaA","vitaminaB12","vitaminaC",
  "vitaminaD","vitaminaE"
];

const examesNomes = {
  albumina: "Albumina (g/dL)", alt: "ALT (U/L)", ast: "AST (U/L)", bilirrubinaDireta: "Bilirrubina Direta (mg/dL)", bilirrubinaTotal: "Bilirrubina Total (mg/dL)", calcio: "Cálcio (mg/dL)",
  creatinina: "Creatinina (mg/dL)", ferritina: "Ferritina (µg/L)", fosfataseAlcalina: "Fosfatase Alcalina (U/L)", fosforo: "Fósforo (mg/dL)", glicose: "Glicose (mg/dL)", hemoglobina: "Hemoglobina (g/dL)", hematocrito: "Hematócrito (%)",
  leucocitos: "Leucócitos (/µL)", neutrofilos: "Neutrófilos (/µL)", plaquetas: "Plaquetas (/µL)", potassio: "Potássio (mEq/L)", sodio: "Sódio (mEq/L)", triglicerides: "Triglicérides (mg/dL)",
  colesterolTotal: "Colesterol Total (mg/dL)", hdl: "HDL (mg/dL)", ldl: "LDL (mg/dL)", vldl: "VLDL (mg/dL)",
  amilase: "Amilase (U/dL)", lipase: "Lipase (U/L)", gamaGT: "Gama GT (U/L)", pcr: "Proteína C Reativa (mg/dL)", dhl: "DHL (U/L)", vhs: "VHS (mm/h)", bilirrubinaIndireta: "Bilirrubina Indireta (mg/dL)",
  ferro: "Ferro (µg/dL)", transferrina: "Transferrina (mg/dL)", capacidadeLigacaoFerro: "Capacidade de Ligação Total do Ferro (µg/dL)",
  ureia: "Uréia (mg/dL)", calcioIonico: "Cálcio Iônico (mmol/L)", hemoglobinaGlicada: "Hemoglobina Glicada (%)", hcm: "HCM (pg)", vcm: "VCM (fL)",
  selenio: "Selênio (µg/L)", cloro: "Cloro (mEq/L)", zinco: "Zinco (µg/dL)", magnesio: "Magnésio (mg/dL)", tsh: "TSH (µUI/mL)", t3: "T3 (ng/dL)", t4: "T4 (µg/dL)", t4livre: "T4 Livre (ng/dL)",
  vitaminaA: "Vitamina A (µg/dL)", vitaminaB12: "Vitamina B12 (pg/mL)", vitaminaC: "Vitamina C (mg/dL)", vitaminaD: "Vitamina D (ng/mL)", vitaminaE: "Vitamina E (mg/L)"
};

const faixas = {
  albumina: [{ idadeMaxDias: 30, min: null, max: null }, { idadeMaxDias: 182, min: 2.6, max: 4.3 }, { idadeMaxDias: 365, min: 2.8, max: 4.6 }, { idadeMaxDias: 1095, min: 2.8, max: 4.8 }, { idadeMaxDias: 4015, min: 2.9, max: 4.7 }],
  alt: [{ idadeMaxDias: 30, min: 20, max: 54 }, { idadeMaxDias: 182, min: 20, max: 54 }, { idadeMaxDias: 365, min: 26, max: 61 }, { idadeMaxDias: 1095, min: 26, max: 59 }, { idadeMaxDias: 4015, min: 19, max: 59 }],
  ast: [{ idadeMaxDias: 7, min: 26, max: 98 }, { idadeMaxDias: 30, min: 16, max: 69 }, { idadeMaxDias: 182, min: 16, max: 61 }, { idadeMaxDias: 4015, min: 10, max: 41 }],
  bilirrubinaDireta: [{ idadeMaxDias: 30, min: 0, max: 0.4 }, { idadeMaxDias: 4015, min: 0, max: 0.4 }],
  bilirrubinaTotal: [{ idadeMaxDias: 5, min: 0, max: 10.3 }, { idadeMaxDias: 4015, min: 0, max: 1.2 }],
  calcio: [{ idadeMaxDias: 0, min: null, max: null }, { idadeMaxDias: 30, min: 8.2, max: 11.2 }, { idadeMaxDias: 182, min: 7.6, max: 10.4 }, { idadeMaxDias: 365, min: 8.8, max: 10.8 }, { idadeMaxDias: 4015, min: 8.8, max: 10.8 }],
  creatinina: [{ idadeMaxDias: 30, min: 0.56, max: 1.2 }, { idadeMaxDias: 365, min: 0.42, max: 0.6 }, { idadeMaxDias: 4015, min: 0.59, max: 0.80 }],
  ferritina: [{ idadeMaxDias: 365, min: 7, max: 140 }, { idadeMaxDias: 4015, min: 7, max: 140 }],
  fosfataseAlcalina: [{ idadeMaxDias: 1095, min: 75, max: 390 }, { idadeMaxDias: 4015, min: 75, max: 390 }],
  fosforo: [{ idadeMaxDias: 10, min: 4.5, max: 9.0 }, { idadeMaxDias: 730, min: 4.5, max: 6.7 }, { idadeMaxDias: 4380, min: 3.0, max: 4.5 }],
  glicose: [{ idadeMaxDias: 60, min: 20, max: 60 }, { idadeMaxDias: 365, min: 50, max: 80 }, { idadeMaxDias: 6570, min: 70, max: 99 }],
  hemoglobina: [{ idadeMaxDias: 30, min: 14, max: 24 }, { idadeMaxDias: 6570, min: 11, max: 16 }],
  hematocrito: [{ idadeMaxDias: 30, min: 45, max: 77 }, { idadeMaxDias: 6570, min: 30, max: 45 }],
  leucocitos: [{ idadeMaxDias: 1, min: 9000, max: 30000 }, { idadeMaxDias: 30, min: 5000, max: 21000 }, { idadeMaxDias: 6570, min: 5000, max: 17000 }],
  neutrofilos: [{ idadeMaxDias: 1, min: 6000, max: 17000 }],
  plaquetas: [{ idadeMaxDias: 30, min: 300000, max: 600000 }, { idadeMaxDias: 6570, min: 150000, max: 400000 }],
  potassio: [{ idadeMaxDias: 6570, min: 3.5, max: 5.0 }],
  sodio: [{ idadeMaxDias: 6570, min: 135, max: 148 }],
  triglicerides: [{ idadeMaxDias: 3650, min: 0, max: 100 }, { idadeMaxDias: 6570, min: 0, max: 130 }],
  colesterolTotal: [{ idadeMaxDias: 730, min: 0, max: 170 }, { idadeMaxDias: 6570, min: 0, max: 170 }],
  hdl: [{ idadeMaxDias: 6570, min: 35, max: 100 }],
  ldl: [{ idadeMaxDias: 6570, min: 0, max: 110 }],
  vldl: [{ idadeMaxDias: 6570, min: 5, max: 40 }],
  amilase: [{ idadeMaxDias: 6570, min: 60, max: 160 }],
  lipase: [{ idadeMaxDias: 365, min: 0, max: 29 }, { idadeMaxDias: 6570, min: 10, max: 46 }],
  gamaGT: [{ idadeMaxDias: 182, min: 12, max: 122 }, { idadeMaxDias: 365, min: 3, max: 22 }, { idadeMaxDias: 6570, min: 2, max: 42 }],
  pcr: [{ idadeMaxDias: 6570, min: 0, max: 0.5 }],
  dhl: [{ idadeMaxDias: 365, min: 490, max: 730 }, { idadeMaxDias: 6570, min: 320, max: 520 }],
  vhs: [{ idadeMaxDias: 6570, min: 0, max: 20 }],
  bilirrubinaIndireta: [{ idadeMaxDias: 6570, min: 0, max: 1.0 }],
  ferro: [{ idadeMaxDias: 182, min: 100, max: 250 }, { idadeMaxDias: 6570, min: 40, max: 100 }],
  transferrina: [{ idadeMaxDias: 6570, min: 200, max: 400 }],
  capacidadeLigacaoFerro: [{ idadeMaxDias: 6570, min: 250, max: 450 }],
  ureia: [{ idadeMaxDias: 6570, min: 8, max: 36 }],
  calcioIonico: [{ idadeMaxDias: 6570, min: 1.12, max: 1.32 }],
  hemoglobinaGlicada: [{ idadeMaxDias: 6570, min: 0, max: 5.7 }],
  hcm: [{ idadeMaxDias: 6570, min: 27, max: 31 }],
  vcm: [{ idadeMaxDias: 6570, min: 70, max: 120 }],
  selenio: [{ idadeMaxDias: 6570, min: 70, max: 150 }],
  cloro: [{ idadeMaxDias: 6570, min: 97, max: 110 }],
  zinco: [{ idadeMaxDias: 6570, min: 70, max: 120 }],
  magnesio: [{ idadeMaxDias: 6570, min: 1.6, max: 2.6 }],
  tsh: [{ idadeMaxDias: 6570, min: 0.5, max: 5.0 }],
  t3: [{ idadeMaxDias: 6570, min: 80, max: 200 }],
  t4: [{ idadeMaxDias: 6570, min: 4.5, max: 12 }],
  t4livre: [{ idadeMaxDias: 6570, min: 0.7, max: 1.8 }],
  vitaminaA: [{ idadeMaxDias: 6570, min: 30, max: 80 }],
  vitaminaB12: [{ idadeMaxDias: 6570, min: 200, max: 900 }],
  vitaminaC: [{ idadeMaxDias: 6570, min: 0.4, max: 2.0 }],
  vitaminaD: [{ idadeMaxDias: 6570, min: 20, max: 50 }],
  vitaminaE: [{ idadeMaxDias: 6570, min: 5, max: 20 }]
};

const refHemograma = {
  newborn: { hb: [14,22], ht: [45,65], vcm: [92,120], leuco: [9000,30000], neutro: [50,70], linfo: [20,40], plaquetas: [150000,450000] },
  infant: { hb: [11,14], ht: [30,40], vcm: [72,84], leuco: [6000,17500], neutro: [35,50], linfo: [50,70], plaquetas: [150000,450000] },
  child: { hb: [11,14], ht: [35,45], vcm: [75,95], leuco: [5000,15000], neutro: [40,60], linfo: [30,50], plaquetas: [150000,450000] },
  adolescent: { hb: [12,16], ht: [36,48], vcm: [80,100], leuco: [4500,11000], neutro: [50,70], linfo: [20,40], plaquetas: [150000,400000] }
};

// ============================================================================
// 2. RENDERIZAÇÃO DA ABA E SUB-ABAS
// ============================================================================
export function renderLaboratorios() {
  const container = document.getElementById('tab-lab');
  if (!container) return;

  container.innerHTML = `
    <div class="subnav">
      <button class="subnav-lab-btn active" data-target="lab-gerais">Exames Gerais</button>
      <button class="subnav-lab-btn" data-target="lab-bio">Exames Lab (Bioquímica)</button>
      <button class="subnav-lab-btn" data-target="lab-extrac">Extrair Exames (IA)</button>
    </div>

    <div id="lab-gerais" class="lab-sub-panel" style="display: block;">
      
      <div class="card" style="border-left: 5px solid #2980b9;">
            <div class="card-header" style="border: none; padding-left: 0; margin-bottom: 5px;">
                <h2 style="color: #2980b9; margin-top: 0; font-size: 1.15rem;">Diagnóstico Gasométrico Avançado</h2>
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

            <button class="calc-btn" id="btn-gasometria-avancada" style="background: #2980b9;">Interpretar Gasometria</button>
            <div id="res-gasometria-avancada" class="result-box"></div>
        </div>

      <div class="card">
        <div class="card-header"><h2>Interpretador de Hemograma Pediátrico</h2></div>
        <label>Faixa Etária</label>
        <select id="hemo-idade" style="width:100%; padding:8px; border-radius:6px; border:1px solid #ccc; margin-bottom: 10px;">
          <option value="">-- Selecione --</option>
          <option value="newborn">Recém-nascido (0-1 mês)</option>
          <option value="infant">1 mês a 1 ano</option>
          <option value="child">2 a 12 anos</option>
          <option value="adolescent">Adolescente (>12 anos)</option>
        </select>
        <div class="grid-3">
          <div><label>Hb (g/dL)</label><input type="number" step="0.1" id="hemo-hb"></div>
          <div><label>Ht (%)</label><input type="number" step="0.1" id="hemo-ht"></div>
          <div><label>VCM (fL)</label><input type="number" step="0.1" id="hemo-vcm"></div>
          <div><label>Leucócitos</label><input type="number" step="10" id="hemo-leuco"></div>
          <div><label>Neutrófilos (%)</label><input type="number" step="0.1" id="hemo-neutro"></div>
          <div><label>Linfócitos (%)</label><input type="number" step="0.1" id="hemo-linfo"></div>
          <div><label>Plaquetas</label><input type="number" step="1000" id="hemo-plaq"></div>
        </div>
        <button class="calc-btn" id="btn-hemo">Interpretar Hemograma</button>
        <div id="res-hemo" class="result-box" style="white-space: pre-wrap;"></div>
      </div>

      <div class="card">
        <div class="card-header"><h2>Diagnóstico do Líquor (Pediatria)</h2></div>
        <div class="grid-3">
          <div><label>Aparência</label>
            <select id="liq-aparencia" style="width:100%; padding:8px; border-radius:6px; border:1px solid #ccc;">
              <option disabled selected>Selecione</option>
              <option value="claro">Claro</option>
              <option value="turvo">Turvo</option>
              <option value="sanguinolento">Sanguinolento</option>
            </select>
          </div>
          <div><label>Hemácias (/mm³)</label><input type="number" id="liq-hema" value="0"></div>
          <div><label>Células (/mm³)</label><input type="number" id="liq-cel"></div>
          <div><label>Proteína (mg/dL)</label><input type="number" id="liq-prot"></div>
          <div><label>Glicose (mg/dL)</label><input type="number" id="liq-glic"></div>
          <div><label>Predominância</label>
            <select id="liq-predom" style="width:100%; padding:8px; border-radius:6px; border:1px solid #ccc;">
              <option disabled selected>Selecione</option>
              <option value="neutrofilos">Neutrófilos</option>
              <option value="linfocitos">Linfócitos</option>
            </select>
          </div>
        </div>
        <button class="calc-btn" id="btn-liquor">Avaliar Líquor</button>
        <div id="res-liquor" class="result-box"></div>
      </div>

      <div class="card">
        <div class="card-header"><h2>Conversor de Unidades Pediátricas</h2></div>
        <div class="grid-2">
          <div style="border-right: 1px dashed #ccc; padding-right: 10px;">
            <label>Glicose (mg/dL para mmol/L)</label>
            <div style="display:flex; gap:5px;">
              <input type="number" id="conv-glic" placeholder="mg/dL">
              <button class="calc-btn" id="btn-conv-glic" style="margin-top:0;">Converter</button>
            </div>
            <div id="res-conv-glic" style="margin-top: 5px; font-weight: bold; color: var(--primary);"></div>
          </div>
          <div style="padding-left: 10px;">
            <label>Creatinina (mg/dL para µmol/L)</label>
            <div style="display:flex; gap:5px;">
              <input type="number" id="conv-crea" placeholder="mg/dL">
              <button class="calc-btn" id="btn-conv-crea" style="margin-top:0;">Converter</button>
            </div>
            <div id="res-conv-crea" style="margin-top: 5px; font-weight: bold; color: var(--primary);"></div>
          </div>
        </div>
      </div>

    </div>

    <div id="lab-bio" class="lab-sub-panel" style="display: none;">
      <div class="card">
        <div class="card-header"><h2>Avaliação Bioquímica Pediátrica</h2></div>
        <label>Idade do Paciente:</label>
        <div class="grid-3" style="margin-bottom: 15px;">
          <input type="number" id="bio-anos" placeholder="Anos" min="0" max="18">
          <input type="number" id="bio-meses" placeholder="Meses" min="0" max="11">
          <input type="number" id="bio-dias" placeholder="Dias" min="0" max="30">
        </div>
        
        <div style="max-height: 400px; overflow-y: auto; border: 1px solid #ccc; border-radius: 8px; margin-bottom: 15px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.8rem; text-align: left;">
            <thead style="position: sticky; top: 0; background: var(--primary); color: white;">
              <tr>
                <th style="padding: 8px;">Exame</th>
                <th style="padding: 8px;">Valor Inserido</th>
                <th style="padding: 8px;">Faixa Normal</th>
              </tr>
            </thead>
            <tbody id="tabela-bioquimica">
              </tbody>
          </table>
        </div>
        <div class="grid-2">
          <button class="calc-btn" id="btn-avaliar-bio">Avaliar Tudo</button>
          <button class="calc-btn" id="btn-limpar-bio" style="background: #95a5a6;">Limpar Tabela</button>
        </div>
      </div>
    </div>

    <div id="lab-extrac" class="lab-sub-panel" style="display: none;">
      <div class="card">
        <div class="card-header">
          <h2>Leitor de Laudos por IA (Gemini 2.5)</h2>
        </div>
        <p style="font-size: 0.85rem; color: #555; margin-bottom: 15px;">Carregue o ficheiro PDF completo ou selecione as várias fotos do exame de uma só vez para o Cérebro IA extrair os dados perfeitamente estruturados.</p>
        
        <div style="margin-bottom: 15px;">
          <label>Chave de Acesso (Google API Key)</label>
          <input type="text" id="ai-key" placeholder="Cole a sua chave de acesso aqui...">
          <div style="margin-top: 5px; display: flex; align-items: center; gap: 5px;">
            <input type="checkbox" id="ai-save-key" checked style="width: auto; margin:0;">
            <label for="ai-save-key" style="margin:0; font-weight:normal; color:#666;">Salvar chave neste dispositivo</label>
          </div>
        </div>

        <div class="grid-2" style="margin-bottom: 15px;">
          <div>
            <label>Padrão do Relatório</label>
            <select id="ai-padrao" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ccc;">
              <option value="consultorio">Padrão Consultório</option>
              <option value="ambulatorio">Padrão Ambulatório</option>
            </select>
          </div>
          <div>
            <label>Selecione o Exame (PDF ou Imagens)</label>
            <input type="file" id="ai-file" accept="image/*, application/pdf" multiple style="padding: 5px;">
          </div>
        </div>

        <button class="calc-btn" id="btn-processar-ai" style="background-color: var(--lab);">Processar com IA</button>
        <div id="ai-loading" style="display: none; text-align: center; color: #e67e22; font-weight: bold; margin-top: 15px;">⏳ A IA está a ler e a transcrever... Aguarde...</div>
        
        <div id="ai-resultado-container" style="display: none; margin-top: 20px;">
          <button class="calc-btn" id="btn-copiar-ai" style="background-color: #27ae60; margin-bottom: 10px;">📋 Copiar Resultado</button>
          <div id="ai-output" style="padding: 15px; background: #f9fbfd; border-left: 4px solid #27ae60; border-radius: 4px; white-space: pre-wrap; font-family: monospace; font-size: 0.85rem; line-height: 1.5; color: #333;"></div>
        </div>
      </div>
    </div>
  `;

  // === NAVEGAÇÃO DAS SUB-ABAS ===
  const subBtns = document.querySelectorAll('.subnav-lab-btn');
  const subPanels = document.querySelectorAll('.lab-sub-panel');
  subBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      subBtns.forEach(b => b.classList.remove('active'));
      subPanels.forEach(p => p.style.display = 'none');
      e.target.classList.add('active');
      document.getElementById(e.target.dataset.target).style.display = 'block';
    });
  });

  // === RENDERIZAR TABELA BIOQUÍMICA ===
  renderizarTabelaBioquimica();

  // === ATRELAR EVENTOS (EXAMES GERAIS) ===
  document.getElementById('btn-gasometria-avancada').addEventListener('click', handleGasometriaAvancada);
  document.getElementById('btn-hemo').addEventListener('click', interpretarHemograma);
  document.getElementById('btn-liquor').addEventListener('click', avaliarLiquor);
  
  document.getElementById('btn-conv-glic').addEventListener('click', () => {
    const val = parseFloat(document.getElementById('conv-glic').value);
    if(val) document.getElementById('res-conv-glic').innerText = `= ${(val / 18.018).toFixed(2)} mmol/L`;
  });
  document.getElementById('btn-conv-crea').addEventListener('click', () => {
    const val = parseFloat(document.getElementById('conv-crea').value);
    if(val) document.getElementById('res-conv-crea').innerText = `= ${(val * 88.4).toFixed(2)} µmol/L`;
  });

  // === ATRELAR EVENTOS (BIOQUÍMICA) ===
  document.getElementById('btn-avaliar-bio').addEventListener('click', avaliarBioquimica);
  document.getElementById('btn-limpar-bio').addEventListener('click', limparBioquimica);

  // === ATRELAR EVENTOS (EXTRAÇÃO IA) ===
  const keySalva = localStorage.getItem('minha_api_key_gemini');
  if (keySalva) document.getElementById('ai-key').value = keySalva;
  
  document.getElementById('btn-processar-ai').addEventListener('click', processarExamesIA);
  document.getElementById('btn-copiar-ai').addEventListener('click', copiarResultadoIA);
}

// ============================================================================
// FUNÇÕES DA NOVA GASOMETRIA AVANÇADA
// ============================================================================
function handleGasometriaAvancada() {
    const rawFio2 = parseFloat(document.getElementById('gaso-fio2').value);
    const fio2Corrigida = (rawFio2 && rawFio2 > 1) ? rawFio2 / 100 : (rawFio2 || 0.21); 

    const dados = {
        tipoAmostra: document.getElementById('gaso-tipo').value,
        pH: parseFloat(document.getElementById('gaso-ph').value),
        pCO2: parseFloat(document.getElementById('gaso-pco2').value),
        hco3: parseFloat(document.getElementById('gaso-hco3').value),
        pO2: parseFloat(document.getElementById('gaso-po2').value) || null,
        fio2: fio2Corrigida,
        sodio: parseFloat(document.getElementById('gaso-na').value) || null,
        cloro: parseFloat(document.getElementById('gaso-cl').value) || null,
        albumina: parseFloat(document.getElementById('gaso-alb').value) || null,
        lactato: parseFloat(document.getElementById('gaso-lac').value) || null
    };

    try {
        const res = interpretarGasometriaMotor(dados);
        renderHTMLGasometria(res);
    } catch (e) {
        const box = document.getElementById('res-gasometria-avancada');
        box.style.display = 'block';
        box.innerHTML = `<span style="color:#c0392b; font-weight:bold;">Erro: ${e.message}</span>`;
    }
}

function renderHTMLGasometria(res) {
    let html = `<div style="font-size: 0.95rem; line-height: 1.6;">`;
    
    let colorPH = res.estadoPH === "pH dentro da faixa de referência" ? "#27ae60" : "#c0392b";
    html += `<strong style="font-size: 1.1rem; color: ${colorPH};">${res.estadoPH}</strong><br>`;
    
    if (res.disturbioPrimario.length > 0) {
        html += `<strong>Distúrbio Primário:</strong> ${res.disturbioPrimario.join(" + ")}<br>`;
    }

    if (res.compensacao) {
        const comp = res.compensacao;
        html += `<div style="background: #fffdf5; border-left: 3px solid #f39c12; padding: 8px; margin: 10px 0; font-size: 0.85rem;">
            <strong>Análise de Compensação (${comp.tipo}):</strong><br>
            • ${comp.variavelAvaliada} Esperado: ${comp.esperadoAgudo ? comp.esperadoAgudo + ' (Ag) / ' + comp.esperadoCronico + ' (Cr)' : comp.intervaloEsperado.join(" a ")}<br>
            • ${comp.variavelAvaliada} Observado: ${comp.observado}<br>
            <strong style="color:#d35400;">Conclusão: ${comp.interpretacao}</strong>
        </div>`;
    }

    if (res.disturbiosMistos.length > 0) {
        let unicos = [...new Set(res.disturbiosMistos)];
        html += `<strong>⚠️ Distúrbios Mistos Prováveis:</strong> <span style="color:#e74c3c;">${unicos.join("; ")}</span><br>`;
    }

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

    if (res.oxigenacao) {
        html += `<hr style="border: 0; border-top: 1px dashed rgba(0,0,0,0.1); margin: 10px 0;">`;
        html += `<strong>Relação PaO₂/FiO₂:</strong> ${res.oxigenacao.relacaoPF} <br>`;
        html += `<strong>Oxigenação:</strong> <span style="color:#2980b9;">${res.oxigenacao.classificacao}</span><br>`;
    }

    if (res.alertas.length > 0) {
        html += `<div style="background: #fadbd8; color: #c0392b; border-radius: 6px; padding: 10px; margin-top: 12px; font-size: 0.85rem;">
            <strong>🚨 Alertas Clínicos:</strong><br>
            <ul style="margin: 5px 0 0 15px; padding: 0;">
                ${res.alertas.map(a => `<li>${a}</li>`).join("")}
            </ul>
        </div>`;
    }

    html += `</div>`;
    const box = document.getElementById('res-gasometria-avancada');
    box.style.display = 'block';
    box.innerHTML = html;
}

function interpretarGasometriaMotor(dados) {
    const { tipoAmostra = "arterial", pH, pCO2, hco3, pO2 = null, fio2 = 0.21, sodio = null, cloro = null, albumina = null, lactato = null } = dados;
    validarEntradas({ pH, pCO2, hco3, pO2, fio2 });

    const resultado = { tipoAmostra, estadoPH: "", disturbioPrimario: [], compensacao: null, disturbiosMistos: [], anionGap: null, anionGapCorrigido: null, deltaRatio: null, oxigenacao: null, alertas: [], resumo: "" };

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

    if (resultado.compensacao && resultado.compensacao.disturbioAssociado) resultado.disturbiosMistos.push(resultado.compensacao.disturbioAssociado);

    if (Number.isFinite(sodio) && Number.isFinite(cloro) && Number.isFinite(hco3)) {
        resultado.anionGap = arredondar(sodio - cloro - hco3, 1);
        if (Number.isFinite(albumina)) resultado.anionGapCorrigido = arredondar(resultado.anionGap + 2.5 * (4 - albumina), 1);
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
        else resultado.alertas.push("A pO₂ venosa ou capilar não avalia oxigenação arterial.");
    }

    if (pH < 7.10) resultado.alertas.push("Acidemia grave: pH menor que 7,10.");
    if (pH > 7.60) resultado.alertas.push("Alcalemia grave: pH maior que 7,60.");
    if (pCO2 > 70) resultado.alertas.push("Hipercapnia importante: correlacionar com ventilação e clínica.");
    if (hco3 < 10) resultado.alertas.push("Bicarbonato muito reduzido: acidose metabólica importante.");

    return resultado;
}

function compensacaoAcidoseMetabolica(pCO2, hco3) {
    const esperado = 1.5 * hco3 + 8;
    const minimo = esperado - 2, maximo = esperado + 2;
    let interpretacao, disturbioAssociado = null;
    if (pCO2 < minimo) { interpretacao = "pCO₂ menor que a compensação esperada"; disturbioAssociado = "Alcalose respiratória associada"; }
    else if (pCO2 > maximo) { interpretacao = "pCO₂ maior que a compensação esperada"; disturbioAssociado = "Acidose respiratória associada"; }
    else interpretacao = "Compensação respiratória apropriada";
    return { tipo: "Acidose metabólica", variavelAvaliada: "pCO₂", esperado: arredondar(esperado, 1), intervaloEsperado: [arredondar(minimo, 1), arredondar(maximo, 1)], observado: pCO2, interpretacao, disturbioAssociado };
}

function compensacaoAlcaloseMetabolica(pCO2, hco3) {
    const esperado = 40 + 0.7 * (hco3 - 24);
    const minimo = esperado - 5, maximo = esperado + 5;
    let interpretacao, disturbioAssociado = null;
    if (pCO2 < minimo) { interpretacao = "pCO₂ menor que a compensação esperada"; disturbioAssociado = "Alcalose respiratória associada"; }
    else if (pCO2 > maximo) { interpretacao = "pCO₂ maior que a compensação esperada"; disturbioAssociado = "Acidose respiratória associada"; }
    else interpretacao = "Compensação respiratória apropriada";
    return { tipo: "Alcalose metabólica", variavelAvaliada: "pCO₂", esperado: arredondar(esperado, 1), intervaloEsperado: [arredondar(minimo, 1), arredondar(maximo, 1)], observado: pCO2, interpretacao, disturbioAssociado };
}

function compensacaoAcidoseRespiratoria(pCO2, hco3) {
    const aumentoCO2 = Math.max(0, pCO2 - 40);
    return compararRespiratorio({ tipo: "Acidose respiratória", hco3, esperadoAgudo: 24 + (aumentoCO2 / 10) * 1, esperadoCronico: 24 + (aumentoCO2 / 10) * 4, disturbioSeBaixo: "Acidose metabólica associada", disturbioSeAlto: "Alcalose metabólica associada" });
}

function compensacaoAlcaloseRespiratoria(pCO2, hco3) {
    const quedaCO2 = Math.max(0, 40 - pCO2);
    return compararRespiratorio({ tipo: "Alcalose respiratória", hco3, esperadoAgudo: 24 - (quedaCO2 / 10) * 2, esperadoCronico: 24 - (quedaCO2 / 10) * 5, disturbioSeBaixo: "Acidose metabólica associada", disturbioSeAlto: "Alcalose metabólica associada" });
}

function compararRespiratorio({ tipo, hco3, esperadoAgudo, esperadoCronico, disturbioSeBaixo, disturbioSeAlto }) {
    const distanciaAgudo = Math.abs(hco3 - esperadoAgudo), distanciaCronico = Math.abs(hco3 - esperadoCronico);
    const esperadoMaisProximo = distanciaAgudo <= distanciaCronico ? esperadoAgudo : esperadoCronico;
    let interpretacao, disturbioAssociado = null;
    if (hco3 < esperadoMaisProximo - 2) { interpretacao = "HCO₃ menor que o esperado para compensação"; disturbioAssociado = disturbioSeBaixo; }
    else if (hco3 > esperadoMaisProximo + 2) { interpretacao = "HCO₃ maior que o esperado para compensação"; disturbioAssociado = disturbioSeAlto; }
    else interpretacao = "Compensação metabólica aproximadamente apropriada";
    return { tipo, variavelAvaliada: "HCO₃", observado: hco3, esperadoAgudo: arredondar(esperadoAgudo, 1), esperadoCronico: arredondar(esperadoCronico, 1), interpretacao, disturbioAssociado };
}

function calcularDeltaRatio(anionGap, hco3) {
    const deltaHCO3 = 24 - hco3;
    if (deltaHCO3 <= 0) return null;
    return arredondar((anionGap - 12) / deltaHCO3, 2);
}

function interpretarDeltaRatio(deltaRatio) {
    if (!Number.isFinite(deltaRatio)) return "Delta ratio não interpretável";
    if (deltaRatio < 0.4) return "Acidose metabólica hiperclorêmica";
    if (deltaRatio < 0.8) return "Mista: AG elevado e hiperclorêmica";
    if (deltaRatio <= 2) return "Acidose metabólica de AG elevado";
    return "Possível alcalose metabólica associada";
}

function interpretarOxigenacao(pO2, fio2) {
    const relacaoPF = pO2 / fio2;
    let classificacao;
    if (relacaoPF >= 400) classificacao = "Preservada";
    else if (relacaoPF >= 300) classificacao = "Discreta redução";
    else if (relacaoPF >= 200) classificacao = "Moderada (SDRA leve)";
    else if (relacaoPF >= 100) classificacao = "Importante (SDRA moderada)";
    else classificacao = "Muito grave (SDRA grave)";
    return { relacaoPF: arredondar(relacaoPF, 0), classificacao };
}

function arredondar(valor, casas = 1) { return Math.round(valor * (10**casas)) / (10**casas); }
function validarEntradas({ pH, pCO2, hco3 }) {
    if (!Number.isFinite(pH) || pH < 6.5 || pH > 8) throw new Error("pH inválido. Use vírgula ou ponto corretamente.");
    if (!Number.isFinite(pCO2) || pCO2 <= 0) throw new Error("pCO₂ inválida.");
    if (!Number.isFinite(hco3) || hco3 <= 0) throw new Error("HCO₃ inválido.");
}

// ============================================================================
// FUNÇÕES: BIOQUÍMICA (MANTIDAS EXATAMENTE IGUAIS)
// ============================================================================
function renderizarTabelaBioquimica() {
  let html = '';
  examesList.forEach(nome => {
    html += `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 8px; font-weight: bold; color: var(--primary);">${examesNomes[nome]}</td>
      <td style="padding: 8px;"><input type="number" id="bio-${nome}" style="width: 80px; padding: 4px; border: 1px solid #ccc; border-radius: 4px;" step="any"></td>
      <td id="faixa-${nome}" style="padding: 8px; text-align: center; border-radius: 4px; font-weight: bold;"></td>
    </tr>`;
  });
  document.getElementById('tabela-bioquimica').innerHTML = html;
}

function obterFaixa(nomeExame, idadeDias) {
  if (!faixas[nomeExame]) return null;
  for (let faixa of faixas[nomeExame]) {
    if (idadeDias <= faixa.idadeMaxDias) return faixa;
  }
  return faixas[nomeExame][faixas[nomeExame].length - 1];
}

function avaliarBioquimica() {
  const anos = parseInt(document.getElementById('bio-anos').value) || 0;
  const meses = parseInt(document.getElementById('bio-meses').value) || 0;
  const dias = parseInt(document.getElementById('bio-dias').value) || 0;
  const idadeDias = (anos * 365) + (meses * 30) + dias;

  examesList.forEach(nome => {
    const input = document.getElementById(`bio-${nome}`);
    const tdFaixa = document.getElementById(`faixa-${nome}`);
    const valor = parseFloat(input.value);
    const faixa = obterFaixa(nome, idadeDias);

    if (isNaN(valor)) {
      tdFaixa.textContent = "";
      tdFaixa.style.backgroundColor = "transparent";
      return;
    }

    if (!faixa || faixa.min == null || faixa.max == null) {
      tdFaixa.textContent = "Sem Ref.";
      tdFaixa.style.backgroundColor = "#eee";
      tdFaixa.style.color = "#333";
      return;
    }

    tdFaixa.textContent = `${faixa.min} - ${faixa.max}`;
    if (valor < faixa.min) {
      tdFaixa.style.backgroundColor = "#ffc107"; // Abaixo
      tdFaixa.style.color = "#000";
    } else if (valor > faixa.max) {
      tdFaixa.style.backgroundColor = "#f44336"; // Acima
      tdFaixa.style.color = "#fff";
    } else {
      tdFaixa.style.backgroundColor = "#8bc34a"; // Normal
      tdFaixa.style.color = "#fff";
    }
  });
}

function limparBioquimica() {
  examesList.forEach(nome => {
    document.getElementById(`bio-${nome}`).value = '';
    const tdFaixa = document.getElementById(`faixa-${nome}`);
    tdFaixa.textContent = '';
    tdFaixa.style.backgroundColor = "transparent";
  });
}

// ============================================================================
// FUNÇÕES: HEMOGRAMA E LÍQUOR (MANTIDAS EXATAMENTE IGUAIS)
// ============================================================================
function interpretarHemograma() {
  const age = document.getElementById('hemo-idade').value;
  if (!age) return alert("Selecione a faixa etária.");
  
  const hb = parseFloat(document.getElementById('hemo-hb').value);
  const ht = parseFloat(document.getElementById('hemo-ht').value);
  const vcm = parseFloat(document.getElementById('hemo-vcm').value);
  const leuco = parseFloat(document.getElementById('hemo-leuco').value);
  const neutro = parseFloat(document.getElementById('hemo-neutro').value);
  const linfo = parseFloat(document.getElementById('hemo-linfo').value);
  const plaquetas = parseFloat(document.getElementById('hemo-plaq').value);

  if ([hb, ht, vcm, leuco, neutro, linfo, plaquetas].some(isNaN)) {
    return alert("Preencha todos os campos numéricos do hemograma.");
  }

  const ref = refHemograma[age];
  let res = [];
  
  if (hb < ref.hb[0]) res.push("Anemia: Investigar ferropenia ou perdas.");
  else if (hb > ref.hb[1]) res.push("Policitemia/Hemoconcentração.");

  if (vcm < ref.vcm[0]) res.push("Microcitose (Sugestivo de Deficiência de Ferro).");
  else if (vcm > ref.vcm[1]) res.push("Macrocitose (Sugestivo de Deficiência de B12/Folato).");

  if (leuco < ref.leuco[0]) res.push("Leucopenia (Risco infeccioso/viral).");
  else if (leuco > ref.leuco[1]) res.push("Leucocitose (Possível infecção bacteriana/inflamação).");

  if (neutro < ref.neutro[0]) res.push("Neutropenia.");
  else if (neutro > ref.neutro[1]) res.push("Neutrofilia (Desvio à esquerda?).");

  if (plaquetas < ref.plaquetas[0]) res.push("Plaquetopenia (Risco de sangramento).");
  else if (plaquetas > ref.plaquetas[1]) res.push("Plaquetose (Processo reativo).");

  const resBox = document.getElementById('res-hemo');
  resBox.style.display = 'block';
  resBox.innerText = res.length ? res.join('\n') : "✅ Hemograma sem alterações significativas para a idade.";
}

function avaliarLiquor() {
  const aparencia = document.getElementById('liq-aparencia').value;
  const hemacias = parseInt(document.getElementById('liq-hema').value) || 0;
  const celBrutas = parseInt(document.getElementById('liq-cel').value);
  const proteina = parseFloat(document.getElementById('liq-prot').value);
  const glicose = parseFloat(document.getElementById('liq-glic').value);
  const predom = document.getElementById('liq-predom').value;

  if (!aparencia || isNaN(celBrutas) || isNaN(proteina) || isNaN(glicose) || !predom) {
    return alert("Preencha todos os campos do líquor.");
  }

  const celCorrigidas = Math.max(0, celBrutas - (hemacias / 500));
  let diag = "Líquor normal.";

  if (aparencia === "sanguinolento") diag = "Hemorragia subaracnóidea ou Acidente de punção.";
  else if (aparencia === "turvo" && predom === "neutrofilos" && glicose < 40 && proteina > 100 && celCorrigidas > 100) diag = "Meningite Bacteriana Provável (Urgência).";
  else if (aparencia === "claro" && predom === "linfocitos" && glicose >= 40 && celCorrigidas < 100) diag = "Meningite Viral Provável.";
  else if (aparencia === "claro" && predom === "linfocitos" && glicose < 40 && proteina > 200) diag = "Meningite Tuberculosa Provável.";
  else if (celCorrigidas > 5) diag = "Processo inflamatório inespecífico.";

  const resBox = document.getElementById('res-liquor');
  resBox.style.display = 'block';
  resBox.innerHTML = `<strong>Células Corrigidas:</strong> ${celCorrigidas.toFixed(1)}/mm³<br><strong>Diagnóstico Sugerido:</strong> ${diag}`;
}

// ============================================================================
// FUNÇÕES: INTELIGÊNCIA ARTIFICIAL (MANTIDAS EXATAMENTE IGUAIS)
// ============================================================================
const PADRAO_CONSULTORIO = `
EXAMES LABORATORIAIS ([DD/MM/AAAA])

HEMOGRAMA
Hb: [Valor] [Unidade] // Ht: [Valor] [Unidade] // VCM: [Valor] [Unidade] // HCM: [Valor] [Unidade] // Leuco: [Valor] [Unidade] // Plaq: [Valor] [Unidade] 

PERFIL DE FERRO
Fe: [Valor] [Unidade] // Ferritina: [Valor] [Unidade] // Transferrina: [Valor] [Unidade] // TIBC: [Valor] [Unidade] // Sat Transferrina: [Valor] [Unidade]
        
VITAMINAS
Vit B12: [Valor] [Unidade] // Vit D: [Valor] [Unidade] // Vit A: [Valor] [Unidade] // Vit C: [Valor] [Unidade] 

PERFIL GLICÊMICO
Glicose: [Valor] [Unidade] // HbA1c: [Valor] [Unidade] // Glic Média: [Valor] [Unidade] // Insulina: [Valor] [Unidade] // HOMA: [Valor] [Unidade]

PERFIL LIPÍDICO
CT: [Valor] [Unidade] // HDL: [Valor] [Unidade] // LDL: [Valor] [Unidade] // Não-HDL: [Valor] [Unidade] // VLDL: [Valor] [Unidade] // TG: [Valor] [Unidade] 

TIREOIDE
TSH: [Valor] [Unidade] // T3: [Valor] [Unidade] // T4: [Valor] [Unidade] // T4L: [Valor] [Unidade] 

HEPÁTICA
TGO (AST): [Valor] [Unidade] // TGP (ALT): [Valor] [Unidade] // FA: [Valor] [Unidade] // GGT: [Valor] [Unidade] // Ptn: [Valor] [Unidade] // Albumina: [Valor] [Unidade] // Globulina: [Valor] [Unidade] // Relação A/G: [Valor] [Unidade]

RENAL
Ur: [Valor] [Unidade] // Cr: [Valor] [Unidade] // Clearence: [Valor] [Unidade] 
            
MARCADORES INFLAMATÓRIOS / ENZIMAS
LDH: [Valor] [Unidade] // VHS: [Valor] [Unidade] // PCR: [Valor] [Unidade]

ELETRÓLITOS E MINERAIS
Na: [Valor] [Unidade] // K: [Valor] [Unidade] // Ca: [Valor] [Unidade] // Cai: [Valor] [Unidade] // Zn: [Valor] [Unidade] // Mg: [Valor] [Unidade] // P: [Valor] [Unidade] // Cl: [Valor] [Unidade]  

EXAME DE FEZES
- Resultados principais: [Resumo dos achados/Parasitológico]

EXAME DE URINA
- Resultados principais: [Resumo dos achados do EAS/Urina I]

➕ OUTROS EXAMES ENCONTRADOS NO LAUDO
(Liste abaixo qualquer outro exame presente no documento que não tenha sido solicitado no padrão acima. Use o formato: "- [Nome do Exame]: [Valor] [Unidade] (Ref: [Referência])". Se não houver nenhum exame extra, não escreva nada nesta seção.)
`;

const PADRAO_AMBULATORIO = `
LABORATORIAIS ([DD/MM/AAAA])

- Hb: [Valor] [Unidade] // Ht: [Valor] [Unidade] // VCM: [Valor] [Unidade] // HCM: [Valor] [Unidade] // Leuco: [Valor] [Unidade] // Plaq: [Valor] [Unidade] 
- Fe: [Valor] [Unidade] // Ferritina: [Valor] [Unidade] // Transferrina: [Valor] [Unidade] // TIBC: [Valor] [Unidade] // Sat Transferrina: [Valor] [Unidade]
- Vit B12: [Valor] [Unidade] // Vit D: [Valor] [Unidade] // Vit A: [Valor] [Unidade] // Vit C: [Valor] [Unidade] 
- Glicose: [Valor] [Unidade] // HbA1c: [Valor] [Unidade] // Glic Média: [Valor] [Unidade] // Insulina: [Valor] [Unidade] // HOMA: [Valor] [Unidade]
- CT: [Valor] [Unidade] // HDL: [Valor] [Unidade] // LDL: [Valor] [Unidade] // Não-HDL: [Valor] [Unidade] // VLDL: [Valor] [Unidade] // TG: [Valor] [Unidade] 
- TSH: [Valor] [Unidade] (Ref: [Referência]) // T3: [Valor] [Unidade] (Ref: [Referência]) // T4: [Valor] [Unidade] (Ref: [Referência]) // T4L: [Valor] [Unidade] (Ref: [Referência]) 
- TGO (AST): [Valor] [Unidade] // TGP (ALT): [Valor] [Unidade] // FA: [Valor] [Unidade] // GGT: [Valor] [Unidade] // Ptn: [Valor] [Unidade] // Albumina: [Valor] [Unidade] // Globulina: [Valor] [Unidade] // Relação A/G: [Valor] [Unidade]
- Ur: [Valor] [Unidade] // Cr: [Valor] [Unidade] // Clearence: [Valor] [Unidade] 
- LDH: [Valor] [Unidade] // VHS: [Valor] [Unidade] // PCR: [Valor] [Unidade]
- Na: [Valor] [Unidade] // K: [Valor] [Unidade] // Ca: [Valor] [Unidade] // Cai: [Valor] [Unidade] // Zn: [Valor] [Unidade] // Mg: [Valor] [Unidade] // P: [Valor] [Unidade] // Cl: [Valor] [Unidade]  
- Fezes: [Resumo dos achados/Parasitológico]
- Urina: [Resumo dos achados do EAS/Urina I]

(Liste abaixo qualquer outro exame presente no documento que não tenha sido solicitado no padrão acima. Use o formato: "- [Nome do Exame]: [Valor] [Unidade]". Se não houver nenhum exame extra, não escreva nada nesta seção.)
`;

async function fileToGenerativePart(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve({
        inlineData: {
          data: reader.result.split(',')[1],
          mimeType: file.type
        }
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function processarExamesIA() {
  const apiKey = document.getElementById('ai-key').value.trim();
  const fileInput = document.getElementById('ai-file');
  const tipoPadrao = document.getElementById('ai-padrao').value;
  const isSalvar = document.getElementById('ai-save-key').checked;

  const btn = document.getElementById('btn-processar-ai');
  const loader = document.getElementById('ai-loading');
  const container = document.getElementById('ai-resultado-container');
  const output = document.getElementById('ai-output');

  if (!apiKey) return alert('Por favor, insira a sua API Key do Google.');
  if (fileInput.files.length === 0) return alert('Por favor, selecione os PDFs ou Imagens do exame.');

  if (isSalvar) localStorage.setItem('minha_api_key_gemini', apiKey);
  else localStorage.removeItem('minha_api_key_gemini'); 

  try {
    btn.disabled = true;
    loader.style.display = 'block';
    container.style.display = 'none';

    const ai = new GoogleGenAI({ apiKey: apiKey });
    const conteudosParaEnviar = [];
    
    for (let i = 0; i < fileInput.files.length; i++) {
      conteudosParaEnviar.push(await fileToGenerativePart(fileInput.files[i]));
    }

    const instrucaoSistema = 
      "Você é um assistente médico especialista em transcrição de laudos laboratoriais. " +
      "Você receberá arquivos contendo várias páginas ou várias fotos do mesmo laudo. " +
      "1. Extraia os dados e formate-os rigorosamente no padrão enviado pelo usuário. " +
      "2. Identifique OBRIGATORIAMENTE qualquer outro exame presente no documento que não foi listado no padrão principal. " +
      "REGRA DE EXCLUSÃO CRÍTICA: Não invente dados. Se um exame solicitado no padrão NÃO for encontrado " +
      "nas páginas fornecidas, VOCÊ DEVE OMITI-LO COMPLETAMENTE do relatório final. Não escreva '---' " +
      "nem 'Não informado'. Apenas remova a linha ou o marcador correspondente àquele exame ausente.";

    const padrao = tipoPadrao === 'consultorio' ? PADRAO_CONSULTORIO : PADRAO_AMBULATORIO;
    conteudosParaEnviar.push(`Extraia os dados dos ficheiros anexos e formate seguindo exatamente este padrão (lembre-se de omitir os exames não encontrados):\n\n${padrao}`);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: conteudosParaEnviar,
      config: {
        systemInstruction: instrucaoSistema,
        temperature: 0.1
      }
    });

    output.innerText = response.text;
    container.style.display = 'block';

  } catch (error) {
    console.error(error);
    alert('Ocorreu um erro ao processar o exame com a IA: ' + error.message);
  } finally {
    btn.disabled = false;
    loader.style.display = 'none';
  }
}

async function copiarResultadoIA() {
  const texto = document.getElementById('ai-output').innerText;
  const btn = document.getElementById('btn-copiar-ai');
  try {
    await navigator.clipboard.writeText(texto);
    const original = btn.innerText;
    btn.innerText = '✅ Copiado!';
    setTimeout(() => { btn.innerText = original; }, 2000);
  } catch (err) {
    alert('Erro ao copiar. Selecione manualmente o texto.');
  }
}
