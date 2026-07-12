// tabs/neonato/index.js
import { byId, showResult } from '../../utils/dom.js';

export function renderNeonato() {
  const root = byId('tab-neo');
  if (!root) return;

  root.innerHTML = `
    <div class="card">
        <div class="card-header"><h2>Perda de Peso Neonatal</h2></div>
        <div class="grid-2">
            <div><label>Peso ao Nascer (g)</label><input type="number" id="neo-peso-nasc" placeholder="Ex: 3200"></div>
            <div><label>Data/Hora Nascimento</label><input type="datetime-local" id="neo-data-nasc"></div>
        </div>
        <div class="grid-2" style="margin-top:10px">
            <div><label>Peso Atual (g)</label><input type="number" id="neo-peso-atual" placeholder="Ex: 2950"></div>
            <div><label>Data/Hora Medição</label><input type="datetime-local" id="neo-data-atual"></div>
        </div>
        <button class="calc-btn" id="btn-calc-perda" style="margin-top:20px">Calcular Perda de Peso</button>
        <div id="res-perda-peso" class="result-box" style="margin-top:15px; font-weight:bold;"></div>
        <div style="margin-top:20px;"><canvas id="weightChart"></canvas></div>
    </div>
  `;

  // Eventos
  byId('btn-calc-perda').addEventListener('click', calcularPerdaPeso);
  initChart();
}

let weightChart = null;

function initChart() {
    const ctx = document.getElementById('weightChart')?.getContext('2d');
    if(!ctx) return;
    weightChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [
                { label: 'P95 (Alerta)', data: [{x:0,y:0}, {x:24,y:5}, {x:48,y:8}, {x:72,y:10}, {x:96,y:10.5}], borderColor: '#e74c3c', fill: false },
                { label: 'P50 (Média)', data: [{x:0,y:0}, {x:24,y:2.5}, {x:48,y:4.5}, {x:72,y:5.5}, {x:96,y:6}], borderColor: '#27ae60', fill: false },
                { label: 'Paciente', data: [], type: 'scatter', backgroundColor: '#2980b9', pointRadius: 8 }
            ]
        },
        options: { responsive: true, scales: { x: { title: { display: true, text: 'Horas de Vida' } }, y: { title: { display: true, text: 'Perda (%)' } } } }
    });
}

function calcularPerdaPeso() {
    const pNasc = parseFloat(byId('neo-peso-nasc').value);
    const pAtual = parseFloat(byId('neo-peso-atual').value);
    const dNasc = new Date(byId('neo-data-nasc').value);
    const dAtual = new Date(byId('neo-data-atual').value);

    if (!pNasc || !pAtual || isNaN(dNasc) || isNaN(dAtual)) {
        return showResult('res-perda-peso', "Preencha todos os campos!");
    }

    const perda = ((pNasc - pAtual) / pNasc) * 100;
    const horas = (dAtual - dNasc) / (1000 * 60 * 60);

    if (horas < 0) return showResult('res-perda-peso', "Data da medição é anterior ao nascimento.");

    weightChart.data.datasets[2].data = [{ x: horas, y: perda }];
    weightChart.update();
    showResult('res-perda-peso', `Perda de ${perda.toFixed(1)}% em ${Math.floor(horas)} horas de vida.`);
}
