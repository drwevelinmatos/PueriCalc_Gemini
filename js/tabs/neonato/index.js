// tabs/neonato/index.js
import { byId, showResult } from '../../utils/dom.js';
import {
  calculateIGAndDPP,
  calculateCorrectedPostnatalIG,
  calculateIntergrowthClassification,
  calcularCondutaIctericiaNova,
  calcularRiscoPerdaPeso
} from './logic.js';

let weightChart = null;

function exibirHtml(id, htmlStr, displayType = 'block') {
  const el = byId(id);
  if (el) {
      el.innerHTML = htmlStr;
      el.style.display = displayType;
  }
}

function resetDateToToday(id) {
  const el = byId(id);
  if (el) {
      const today = new Date();
      const localDate = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      el.value = localDate;
  }
}

export function renderNeonato() {
  const root = byId('tab-neo');
  if (!root) return;

  root.innerHTML = `
    <div class="neonato-container">
      
      <div class="sub-tabs-menu" style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px; border-bottom: 2px solid #ecf0f1; padding-bottom: 10px;">
          <button class="sub-tab-btn active" data-target="neo-igdpp" style="padding: 10px 15px; cursor: pointer; border: none; background-color: #3498db; color: white; border-radius: 4px; font-weight: bold;">IG e DPP</button>
          <button class="sub-tab-btn" data-target="neo-igcorrigida" style="padding: 10px 15px; cursor: pointer; border: none; background-color: #bdc3c7; color: white; border-radius: 4px; font-weight: bold;">IG Corrigida</button>
          <button class="sub-tab-btn" data-target="neo-pesoig" style="padding: 10px 15px; cursor: pointer; border: none; background-color: #bdc3c7; color: white; border-radius: 4px; font-weight: bold;">Peso para IG</button>
          <button class="sub-tab-btn" data-target="neo-perdapeso" style="padding: 10px 15px; cursor: pointer; border: none; background-color: #bdc3c7; color: white; border-radius: 4px; font-weight: bold;">Calculadora Perda de Peso</button>
          <button class="sub-tab-btn" data-target="neo-ictericia" style="padding: 10px 15px; cursor: pointer; border: none; background-color: #bdc3c7; color: white; border-radius: 4px; font-weight: bold;">Icterícia Neonatal</button>
      </div>

      <div class="sub-tab-content active" id="neo-igdpp">
        <div class="card">
          <div class="card-header"><h2>Idade Gestacional e DPP</h2></div>
          <label>Modo de Entrada</label>
          <select id="neo-modo">
            <option value="dum">DUM (Data Última Menstruação)</option>
            <option value="usg">USG 1º Trimestre</option>
          </select>
          <div id="box-dum"><label>Data da DUM</label><input type="date" id="neo-dum"></div>
          <div id="box-usg" style="display:none">
            <label>Data do USG</label><input type="date" id="neo-usg-data">
            <div class="grid-2">
              <div><label>Semanas no USG</label><input type="number" id="neo-usg-sem" min="0" step="1"></div>
              <div><label>Dias no USG</label><input type="number" id="neo-usg-dias" min="0" max="6" step="1"></div>
            </div>
          </div>
          <label>Data para cálculo</label>
          <input type="date" id="neo-ig-calc">
          <div style="display: flex; gap: 10px; margin-top: 15px;">
            <button class="calc-btn" id="btn-neo-ig" style="flex: 1; margin: 0;">Calcular IG e DPP</button>
            <button class="clear-btn" id="btn-limpar-ig" style="background: #e2e8f0; color: #475569; padding: 10px 15px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Limpar</button>
          </div>
          <div id="res-neo-ig" class="result-box" style="display: none; margin-top: 15px;"></div>
        </div>
      </div>

      <div class="sub-tab-content" id="neo-igcorrigida" style="display: none;">
        <div class="card">
          <div class="card-header"><h2>Idade Gestacional Corrigida Pós-Nascimento</h2></div>
          <div class="grid-2">
            <div><label>IG ao nascimento (semanas)</label><input type="number" id="neo-ig-nasc-sem" min="0" step="1"></div>
            <div><label>IG ao nascimento (dias)</label><input type="number" id="neo-ig-nasc-dias" min="0" max="6" step="1"></div>
          </div>
          <div class="grid-2">
            <div><label>Data de nascimento</label><input type="date" id="neo-data-nasc"></div>
            <div><label>Data para cálculo</label><input type="date" id="neo-data-posnatal"></div>
          </div>
          <div style="display: flex; gap: 10px; margin-top: 15px;">
            <button class="calc-btn" id="btn-neo-igcorr" style="flex: 1; margin: 0;">Calcular Corrigida Pós-Natal</button>
            <button class="clear-btn" id="btn-limpar-igcorr" style="background: #e2e8f0; color: #475569; padding: 10px 15px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Limpar</button>
          </div>
          <div id="res-neo-igcorr" class="result-box" style="display: none; margin-top: 15px; line-height: 1.5; padding: 15px;"></div>
        </div>
      </div>

      <div class="sub-tab-content" id="neo-pesoig" style="display: none;">
        <div class="card">
          <div class="card-header"><h2>Peso para Idade Gestacional (INTERGROWTH-21st)</h2></div>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
            <div>
              <label>Sexo</label>
              <select id="neo-ig-sexo">
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
              </select>
            </div>
            <div><label>IG (sem)</label><input type="number" id="neo-lub-ig-sem" min="24" max="44" step="1"></div>
            <div><label>IG (dias)</label><input type="number" id="neo-lub-ig-dias" min="0" max="6" step="1"></div>
            <div><label>Peso (g)</label><input type="number" id="neo-lub-peso" min="200" step="1"></div>
          </div>
          <div style="display: flex; gap: 10px; margin-top: 15px; align-items: stretch; min-height: 44px;">
            <button class="calc-btn" id="btn-neo-intergrowth" style="margin: 0; max-width: 200px; flex-shrink: 0;">Classificar</button>
            <div id="res-neo-lub" class="result-box" style="display: none; margin: 0; flex-grow: 1; align-items: center; justify-content: center; padding: 0 10px; font-size: 16px;"></div>
            <button class="clear-btn" id="btn-limpar-lub" style="margin: 0; flex-shrink: 0; background: #e2e8f0; color: #475569; padding: 0 20px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Limpar</button>
          </div>
        </div>
      </div>

      <div class="sub-tab-content" id="neo-perdapeso" style="display: none;">
        <div class="card">
          <div class="card-header"><h2>Calculadora de Perda de Peso (Padrão NEWT)</h2></div>
          
          <div class="grid-2">
            <div><label>Peso ao Nascer (g)</label><input type="number" step="1" id="start_birth_weight" placeholder="Ex: 3200"></div>
            <div><label>Data/Hora Nascimento</label><input type="datetime-local" id="start_birth_datetime"></div>
          </div>
          <div class="grid-2" style="margin-top: 10px;">
            <div><label>Peso da Medição (g)</label><input type="number" step="1" id="start_measurement_weight" placeholder="Ex: 2950"></div>
            <div><label>Data/Hora Medição</label><input type="datetime-local" id="start_measurement_datetime"></div>
          </div>
          
          <div class="grid-2" style="margin-top: 10px; background: #f8fafc; padding: 10px; border-radius: 6px; border: 1px solid #e2e8f0;">
            <div>
                <label>Via de Parto</label>
                <select id="neo-via-parto" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                    <option value="vaginal">Vaginal</option>
                    <option value="cesarea">Cesárea</option>
                </select>
            </div>
            <div>
                <label>Método de Alimentação</label>
                <select id="neo-tipo-alim" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                    <option value="lme">Exclusivo Seio Materno</option>
                    <option value="formula">Exclusivo Fórmula</option>
                    <option value="mista">Amamentação Mista</option>
                </select>
            </div>
          </div>
          <small style="color: #7f8c8d; display: block; margin-top: 5px;">*O sistema aplicará a curva de "1ºs 3-4 dias" ou "1ºs 30 dias" automaticamente com base nas datas e alimentação.</small>

          <div style="display: flex; gap: 10px; margin-top: 15px;">
            <button class="calc-btn" id="btn-calc-peso-neo" style="flex: 1; margin: 0;">Calcular Risco e Gráfico</button>
            <button class="clear-btn" id="btn-limpar-perda" style="background: #e2e8f0; color: #475569; padding: 10px 15px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Limpar</button>
          </div>
          
          <div style="display: flex; gap: 20px; align-items: flex-start; margin-top: 20px; flex-wrap: wrap;">
            <div style="flex-grow: 1; flex-basis: 60%; min-width: 300px;">
              <canvas id="weightChart" style="max-height: 250px;"></canvas>
            </div>
            <div style="flex-basis: 30%; flex-grow: 1; min-width: 200px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
               <h3 style="font-size: 13px; margin-bottom: 12px; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">Resumo Clínico</h3>
               <div id="res-perda-gramas" style="font-size: 24px; font-weight: bold; color: #1e293b;">-- g</div>
               <div id="res-perda-peso" style="font-size: 14px; color: #64748b; margin-top: 4px;">-- %</div>
               <div id="res-perda-tempo" style="font-size: 12px; color: #94a3b8; margin-top: 12px; border-top: 1px solid #e2e8f0; padding-top: 10px;"></div>
               <div id="res-perda-padrao" style="font-size: 11px; color: #7f8c8d; margin-top: 8px;"></div>
               <div id="res-perda-risco" style="font-size: 14px; margin-top: 8px; font-weight: bold;"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="sub-tab-content" id="neo-ictericia" style="display: none;">
        <div class="card" style="background: #fff; padding: 20px 30px; border-radius: 8px;">
          <div class="card-header"><h2 style="color: #2c3e50;">Avaliação de Hiperbilirrubinemia Neonatal (SBP)</h2></div>
          
          <div class="grid-2">
            <div class="form-group">
                <label style="font-weight: bold;">Data de Nascimento:</label>
                <input type="date" id="ict-dataNascimento" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" required>
            </div>
            <div class="form-group">
                <label style="font-weight: bold;">Hora de Nascimento:</label>
                <input type="time" id="ict-horaNascimento" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" required>
            </div>
          </div>

          <div class="grid-2" style="margin-top: 10px;">
            <div class="form-group">
                <label style="font-weight: bold;">Data da Coleta BT:</label>
                <input type="date" id="ict-dataColeta" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" required>
            </div>
            <div class="form-group">
                <label style="font-weight: bold;">Hora da Coleta BT:</label>
                <input type="time" id="ict-horaColeta" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" required>
            </div>
          </div>

          <div class="form-group" style="margin-top: 10px;">
              <label style="font-weight: bold;">Horas de Vida (Automático):</label>
              <input type="text" id="ict-horasVida" readonly style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; background-color: #e9ecef;">
          </div>

          <div class="grid-2" style="margin-top: 10px;">
            <div class="form-group">
                <label style="font-weight: bold;">Idade Gestacional:</label>
                <select id="ict-idadeGestacional" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                    <option value="ge_38">38 semanas ou mais</option>
                    <option value="35_37">35 a 37 semanas e 6 dias</option>
                    <option value="34">34 semanas</option>
                    <option value="32_33">32 a 33 semanas</option>
                    <option value="30_31">30 a 31 semanas</option>
                    <option value="28_29">28 a 29 semanas</option>
                    <option value="lt_28">Menor que 28 semanas</option>
                </select>
            </div>
            <div class="form-group">
                <label style="font-weight: bold;">Bilirrubina Total (mg/dL):</label>
                <input type="number" id="ict-bilirrubina" step="0.1" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" required>
            </div>
          </div>

          <div style="background: #fff3cd; border: 1px solid #ffeeba; padding: 15px; border-radius: 4px; margin-top: 15px; margin-bottom: 20px;">
              <label style="display: block; font-weight: bold; margin-bottom: 10px;">Fatores de Risco Agravantes (Marque se presentes):</label>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <label style="font-weight: normal; cursor: pointer;"><input type="checkbox" id="ict-doencaHemolitica"> Doença hemolítica (Rh, ABO, etc.) ou G6PD</label>
                <label style="font-weight: normal; cursor: pointer;"><input type="checkbox" id="ict-asfixia"> Asfixia / Letargia / Instabilidade térmica</label>
                <label style="font-weight: normal; cursor: pointer;"><input type="checkbox" id="ict-sepse"> Sepse / Meningite</label>
                <label style="font-weight: normal; cursor: pointer;"><input type="checkbox" id="ict-acidose"> Acidose</label>
                <label style="font-weight: normal; cursor: pointer;"><input type="checkbox" id="ict-albumina"> Albumina &lt; 3 g/dL (ou &lt; 2.5 em prematuros)</label>
                <label style="font-weight: normal; cursor: pointer;"><input type="checkbox" id="ict-sinaisEncefalopatia"> <b>Sinais de encefalopatia bilirrubínica aguda</b></label>
              </div>
          </div>

          <div style="display: flex; gap: 10px; margin-top: 15px;">
            <button class="calc-btn" id="btn-calc-ictericia-nova" style="flex: 1; margin: 0; background-color: #3498db; color: #fff; border: none; padding: 10px 20px; font-size: 16px; border-radius: 4px; cursor: pointer; font-weight: bold;">Analisar e Sugerir Conduta</button>
            <button class="clear-btn" id="btn-limpar-ict-nova" style="background: #e2e8f0; color: #475569; padding: 10px 15px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Limpar</button>
          </div>

          <div id="res-ict-nova" style="margin-top: 20px; padding: 20px; background: #e8f8f5; border: 1px solid #d1f2eb; border-radius: 4px; display: none;">
              <h3 style="color: #2c3e50; margin-top: 0;">Classificação e Conduta</h3>
              <div id="resClassificacao" style="margin-bottom: 10px;"></div>
              <div id="resConduta" style="margin-bottom: 10px;"></div>
              <div id="resSuspensao" style="margin-bottom: 10px;"></div>
              <div id="resNovaColeta" style="margin-bottom: 10px;"></div>
          </div>
        </div>
      </div>

    </div>
  `;

  initWeightChart();
  bindNeonatoEvents();
  toggleNeoInputMode();
  configurarDataAtualIctericia();
  
  resetDateToToday('neo-ig-calc');
  resetDateToToday('neo-data-posnatal');
}

function initWeightChart() {
  const ctx = document.getElementById('weightChart')?.getContext('2d');
  if(!ctx) return;
  weightChart = new Chart(ctx, {
    type: 'line',
    data: { datasets: [
      { label: 'P95 (Alerta)', data: [{x:0,y:0}, {x:24,y:5}, {x:48,y:8}, {x:72,y:10}, {x:96,y:10.5}], borderColor: '#e74c3c', fill: false, tension: 0.2 },
      { label: 'P50 (Média)', data: [{x:0,y:0}, {x:24,y:2.5}, {x:48,y:4.5}, {x:72,y:5.5}, {x:96,y:6}], borderColor: '#27ae60', fill: false, tension: 0.2 },
      { label: 'Paciente', data: [], type: 'scatter', backgroundColor: '#2980b9', pointRadius: 8, pointBorderColor: '#fff', pointBorderWidth: 2 }
    ]},
    options: { 
      responsive: true, 
      scales: { 
        x: { 
          type: 'linear', 
          title: { display: true, text: 'Horas de Vida' },
          min: 0,
          max: 96,
          ticks: { stepSize: 24 }
        }, 
        y: { 
          title: { display: true, text: 'Perda (%)' } 
        } 
      } 
    }
  });
}

function bindNeonatoEvents() {
  const botoesSub = document.querySelectorAll('.sub-tab-btn');
  const conteudosSub = document.querySelectorAll('.sub-tab-content');
  botoesSub.forEach(btn => {
      btn.addEventListener('click', (e) => {
          botoesSub.forEach(b => {
              b.style.backgroundColor = '#bdc3c7';
              b.classList.remove('active');
          });
          conteudosSub.forEach(c => c.style.display = 'none');
          e.target.style.backgroundColor = '#3498db';
          e.target.classList.add('active');
          const targetId = e.target.getAttribute('data-target');
          document.getElementById(targetId).style.display = 'block';
      });
  });

  byId('neo-modo')?.addEventListener('change', toggleNeoInputMode);
  byId('btn-neo-ig')?.addEventListener('click', handleCalculateIGDPP);
  byId('btn-neo-igcorr')?.addEventListener('click', handleCalculateCorrectedIG);
  byId('btn-neo-intergrowth')?.addEventListener('click', handleCalculateIntergrowth);
  
  // Perda de Peso
  byId('btn-calc-peso-neo')?.addEventListener('click', processarCalculoNeo);

  // Icterícia
  const ictInputs = ['ict-dataNascimento', 'ict-horaNascimento', 'ict-dataColeta', 'ict-horaColeta'];
  ictInputs.forEach(id => byId(id)?.addEventListener('change', atualizarHorasVidaIctericia));
  byId('btn-calc-ictericia-nova')?.addEventListener('click', handleCalculateIctericiaNova);

  // Limpezas
  byId('btn-limpar-ig')?.addEventListener('click', () => {
    byId('neo-dum').value = '';
    byId('neo-usg-data').value = '';
    byId('neo-usg-sem').value = '';
    byId('neo-usg-dias').value = '';
    resetDateToToday('neo-ig-calc');
    byId('res-neo-ig').style.display = 'none';
  });

  byId('btn-limpar-igcorr')?.addEventListener('click', () => {
    byId('neo-ig-nasc-sem').value = '';
    byId('neo-ig-nasc-dias').value = '';
    byId('neo-data-nasc').value = '';
    resetDateToToday('neo-data-posnatal');
    byId('res-neo-igcorr').style.display = 'none';
  });

  byId('btn-limpar-lub')?.addEventListener('click', () => {
    byId('neo-lub-ig-sem').value = '';
    byId('neo-lub-ig-dias').value = '';
    byId('neo-lub-peso').value = '';
    byId('res-neo-lub').style.display = 'none';
  });

  byId('btn-limpar-perda')?.addEventListener('click', () => {
    byId('start_birth_weight').value = '';
    byId('start_birth_datetime').value = '';
    byId('start_measurement_weight').value = '';
    byId('start_measurement_datetime').value = '';
    byId('res-perda-gramas').innerHTML = '-- g';
    byId('res-perda-peso').innerHTML = '-- %';
    byId('res-perda-tempo').innerHTML = '';
    byId('res-perda-padrao').innerHTML = '';
    byId('res-perda-risco').innerHTML = '';
    if (weightChart) {
      weightChart.data.datasets[2].data = [];
      weightChart.update();
    }
  });

  byId('btn-limpar-ict-nova')?.addEventListener('click', () => {
    byId('ict-idadeGestacional').value = 'ge_38';
    byId('ict-bilirrubina').value = '';
    byId('ict-horasVida').value = '';
    ['ict-doencaHemolitica', 'ict-asfixia', 'ict-sepse', 'ict-acidose', 'ict-albumina', 'ict-sinaisEncefalopatia'].forEach(id => {
        if(byId(id)) byId(id).checked = false;
    });
    configurarDataAtualIctericia();
    byId('res-ict-nova').style.display = 'none';
  });
}

function toggleNeoInputMode() {
  const mode = byId('neo-modo')?.value || 'dum';
  byId('box-dum').style.display = mode === 'dum' ? 'block' : 'none';
  byId('box-usg').style.display = mode === 'usg' ? 'block' : 'none';
}

function processarCalculoNeo() {
    const bW = parseFloat(byId('start_birth_weight').value);
    const cW = parseFloat(byId('start_measurement_weight').value);
    const bD = new Date(byId('start_birth_datetime').value);
    const cD = new Date(byId('start_measurement_datetime').value);
    const viaParto = byId('neo-via-parto').value;
    const tipoAlim = byId('neo-tipo-alim').value;

    if (!bW || !cW || isNaN(bD) || isNaN(cD)) return alert("Preencha as datas, horários e pesos corretamente.");
    
    const diffEmGramas = bW - cW;
    const perdaPerc = ((bW - cW) / bW) * 100;
    const horas = (cD - bD) / (1000 * 60 * 60);
    
    if(horas < 0) return alert("A data de medição não pode ser anterior ao nascimento.");
    
    weightChart.data.datasets[2].data = [{ x: horas, y: perdaPerc }];
    weightChart.update();
    
    const sinalGramas = diffEmGramas > 0 ? '-' : '+';
    const sinalPerc = perdaPerc > 0 ? '-' : '+';
    const corTexto = diffEmGramas > 0 ? '#e74c3c' : '#27ae60';
    
    byId('res-perda-gramas').innerHTML = `<span style="color: ${corTexto}">${sinalGramas}${Math.abs(diffEmGramas).toFixed(0)} g</span>`;
    byId('res-perda-peso').innerHTML = `<span style="color: ${corTexto}">${sinalPerc}${Math.abs(perdaPerc).toFixed(1)}%</span> do peso de nascimento`;
    byId('res-perda-tempo').innerHTML = `Idade avaliada: ${Math.floor(horas)} horas de vida`;

    if (diffEmGramas <= 0) {
        byId('res-perda-padrao').innerHTML = "";
        byId('res-perda-risco').innerHTML = `<span style="color: #27ae60;">Bebê com ganho ou manutenção de peso.</span>`;
        return;
    }

    // Chama a função lógica que agora usa HORAS (Padrão NEWT)
    const resRisco = calcularRiscoPerdaPeso(horas, viaParto, tipoAlim, perdaPerc);
    
    byId('res-perda-padrao').innerHTML = `*${resRisco.padrao}`;
    byId('res-perda-risco').innerHTML = `<span style="color: ${resRisco.cor}; padding: 5px; border-radius: 4px; border: 1px solid ${resRisco.cor}; display: inline-block; width: 100%;">${resRisco.texto}</span>`;
}

function configurarDataAtualIctericia() {
    const now = new Date();
    const localDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
    const isoDate = localDate.toISOString().split('T')[0];
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    if(byId('ict-dataColeta')) byId('ict-dataColeta').value = isoDate;
    if(byId('ict-horaColeta')) byId('ict-horaColeta').value = `${hours}:${minutes}`;
}

function atualizarHorasVidaIctericia() {
    const dNasc = byId('ict-dataNascimento').value;
    const hNasc = byId('ict-horaNascimento').value;
    const dCol = byId('ict-dataColeta').value;
    const hCol = byId('ict-horaColeta').value;

    if(dNasc && hNasc && dCol && hCol) {
        const nasc = new Date(`${dNasc}T${hNasc}`);
        const col = new Date(`${dCol}T${hCol}`);
        const diffMs = col - nasc;
        if(diffMs >= 0) {
            const horas = (diffMs / (1000 * 60 * 60)).toFixed(1);
            byId('ict-horasVida').value = horas;
        } else {
            byId('ict-horasVida').value = "Inválida";
        }
    }
}

function handleCalculateIctericiaNova() {
    atualizarHorasVidaIctericia();
    const horasVida = parseFloat(byId('ict-horasVida').value);
    const bt = parseFloat(byId('ict-bilirrubina').value);
    const ig = byId('ict-idadeGestacional').value;
    
    if(isNaN(horasVida) || isNaN(bt) || horasVida < 0) {
        alert("Preencha as datas de nascimento e coleta, além do valor de bilirrubina.");
        return;
    }

    const temFatorRisco = byId('ict-doencaHemolitica').checked || 
                          byId('ict-asfixia').checked || 
                          byId('ict-sepse').checked || 
                          byId('ict-acidose').checked || 
                          byId('ict-albumina').checked;
    const sinaisEncefalopatia = byId('ict-sinaisEncefalopatia').checked;

    const result = calcularCondutaIctericiaNova(horasVida, bt, ig, temFatorRisco, sinaisEncefalopatia);

    byId('resClassificacao').innerHTML = `<b>Classificação:</b> ${result.classificacao}`;
    byId('resConduta').innerHTML = result.conduta;
    byId('resNovaColeta').innerHTML = result.novaColeta;
    byId('resSuspensao').innerHTML = result.suspensao;
    byId('res-ict-nova').style.display = 'block';
}

function handleCalculateIGDPP() {
  const result = calculateIGAndDPP({
    mode: byId('neo-modo')?.value,
    dumDate: byId('neo-dum')?.value,
    usgDate: byId('neo-usg-data')?.value,
    usgWeeks: Number(byId('neo-usg-sem')?.value),
    usgDays: Number(byId('neo-usg-dias')?.value),
    calcDate: byId('neo-ig-calc')?.value
  });
  if (result.error) return exibirHtml('res-neo-ig', `<span style="color:#e74c3c; font-weight:bold;">${result.error}</span>`);
  exibirHtml('res-neo-ig', `IG: <strong>${result.weeks} sem e ${result.days} dias</strong>. DPP: <strong>${result.dpp.toLocaleDateString('pt-BR')}</strong>`);
}

function handleCalculateCorrectedIG() {
  const bDateStr = byId('neo-data-nasc')?.value;
  const cDateStr = byId('neo-data-posnatal')?.value;
  const birthIGWeeks = Number(byId('neo-ig-nasc-sem')?.value);
  const birthIGDays = Number(byId('neo-ig-nasc-dias')?.value);

  const result = calculateCorrectedPostnatalIG({
    birthIGWeeks, birthIGDays, birthDate: bDateStr, calcDate: cDateStr
  });

  if (result.error) return exibirHtml('res-neo-igcorr', `<span style="color:#e74c3c; font-weight:bold;">${result.error}</span>`);

  let chronoStr = "";
  let correctedAgeStr = "";

  if (bDateStr && cDateStr) {
      let d1 = new Date(bDateStr);
      let d2 = new Date(cDateStr);
      d1 = new Date(d1.getTime() + Math.abs(d1.getTimezoneOffset() * 60000));
      d2 = new Date(d2.getTime() + Math.abs(d2.getTimezoneOffset() * 60000));

      if (d2 >= d1) {
          let mDiff = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
          let dayDiff = d2.getDate() - d1.getDate();
          if (dayDiff < 0) {
              mDiff--;
              let tempDate = new Date(d2.getFullYear(), d2.getMonth(), 0);
              dayDiff += tempDate.getDate();
          }
          
          const diffMs = d2 - d1;
          const diffDaysTotal = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          const wDiff = Math.floor(diffDaysTotal / 7);
          const dDiff = diffDaysTotal % 7;
          
          chronoStr = `<div style="margin-bottom: 6px;"><span style="color: #64748b; font-size: 14px;">Idade Cronológica: <strong>${wDiff} sem e ${dDiff} dias</strong> (${mDiff} meses e ${dayDiff} dias)</span></div>`;

          const birthIGTotalDays = (birthIGWeeks * 7) + birthIGDays;
          const igcTotalDays = birthIGTotalDays + diffDaysTotal;
          const prematurityDays = 280 - birthIGTotalDays;

          if (igcTotalDays >= 280) {
              const correctedLifeDays = igcTotalDays - 280;
              const caWeeks = Math.floor(correctedLifeDays / 7);
              const caDays = correctedLifeDays % 7;

              const correctedDOB = new Date(d1.getTime());
              correctedDOB.setDate(correctedDOB.getDate() + prematurityDays);

              let cmDiff = (d2.getFullYear() - correctedDOB.getFullYear()) * 12 + (d2.getMonth() - correctedDOB.getMonth());
              let cdayDiff = d2.getDate() - correctedDOB.getDate();
              if (cdayDiff < 0) {
                  cmDiff--;
                  let tempDate = new Date(d2.getFullYear(), d2.getMonth(), 0);
                  cdayDiff += tempDate.getDate();
              }
              correctedAgeStr = `<div style="margin-top: 6px;"><span style="color: #047857; font-size: 14px;">Idade Corrigida: <strong>${caWeeks} sem e ${caDays} dias</strong> (${Math.max(0, cmDiff)} meses e ${Math.max(0, cdayDiff)} dias)</span></div>`;
          } else {
              correctedAgeStr = `<div style="margin-top: 6px;"><span style="color: #047857; font-size: 14px;">Idade Corrigida: <strong>Ainda não atingiu 40 semanas (Pré-termo)</strong></span></div>`;
          }
      }
  }
  const igcStr = `<div style="margin-bottom: 2px;"><span style="color: #1e3a8a; font-size: 15px;">Idade Gestacional Corrigida: <strong>${result.weeks} sem e ${result.days} dias</strong></span></div>`;
  exibirHtml('res-neo-igcorr', `${chronoStr}${igcStr}${correctedAgeStr}`);
}

function handleCalculateIntergrowth() {
  const result = calculateIntergrowthClassification({
    sex: byId('neo-ig-sexo')?.value,
    weeks: Number(byId('neo-lub-ig-sem')?.value),
    days: Number(byId('neo-lub-ig-dias')?.value),
    weightGrams: Number(byId('neo-lub-peso')?.value)
  });
  if (result.error) return exibirHtml('res-neo-lub', `<span style="color:#e74c3c; font-weight:bold;">${result.error}</span>`, 'flex');
  exibirHtml('res-neo-lub', `Classificação: <strong>${result.classification}</strong>`, 'flex');
}
