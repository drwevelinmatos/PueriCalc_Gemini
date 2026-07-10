import { byId, showResult } from '../../utils/dom.js';

export function initPACard() {
  const slot = byId('cardio-pa-slot');
  if (!slot) return;

  slot.innerHTML = `
    <div class="card">
      <div class="card-header" style="border-color:var(--cardio)">
        <h2>Classificação de Pressão Arterial (Pediatria e Adulto)</h2>
      </div>

      <div class="grid-2">
        <div>
          <label>PAS (mmHg)</label>
          <input type="number" id="pa-pas" step="1">
        </div>
        <div>
          <label>PAD (mmHg)</label>
          <input type="number" id="pa-pad" step="1">
        </div>
      </div>

      <div class="grid-2">
        <div>
          <label>Idade (anos)</label>
          <input type="number" id="pa-idade" step="0.1">
        </div>
        <div>
          <label>Sexo</label>
          <select id="pa-sexo">
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>
        </div>
      </div>

      <label>Estatura (cm)</label>
      <input type="number" id="pa-estatura" step="0.1">

      <button class="calc-btn" id="btn-pa-calc" style="background:var(--cardio)">
        Classificar PA
      </button>

      <div id="res-pa" class="result-box"></div>

      <div class="muted warn">
        A parte pediátrica está estruturada para receber depois as tabelas percentílicas por idade, sexo e estatura.
      </div>
    </div>
  `;

  byId('btn-pa-calc')?.addEventListener('click', classifyPA);
}

function classifyPA() {
  const pas = Number(byId('pa-pas')?.value);
  const pad = Number(byId('pa-pad')?.value);
  const idade = Number(byId('pa-idade')?.value);
  const sexo = byId('pa-sexo')?.value;
  const estatura = Number(byId('pa-estatura')?.value);

  if (!Number.isFinite(pas) || pas <= 0) {
    return showResult('res-pa', 'Informe PAS.');
  }

  if (!Number.isFinite(pad) || pad <= 0) {
    return showResult('res-pa', 'Informe PAD.');
  }

  if (!Number.isFinite(idade) || idade < 0) {
    return showResult('res-pa', 'Informe idade.');
  }

  if (!Number.isFinite(estatura) || estatura <= 0) {
    return showResult('res-pa', 'Informe estatura.');
  }

  if (idade >= 18) {
    let cls = 'Normal';

    if (pas < 120 && pad < 80) cls = 'Normal';
    else if (pas >= 120 && pas <= 129 && pad < 80) cls = 'PA elevada';
    else if ((pas >= 130 && pas <= 139) || (pad >= 80 && pad <= 89)) cls = 'HAS estágio 1';
    else if (pas >= 140 || pad >= 90) cls = 'HAS estágio 2';
    if (pas >= 180 || pad >= 120) cls = 'Crise hipertensiva (avaliar urgência/emergência)';

    return showResult('res-pa', `Adulto\nClassificação: ${cls}\nPAS/PAD: ${pas}/${pad} mmHg`);
  }

  return showResult(
    'res-pa',
    [
      'Pediatria',
      'A classificação definitiva depende de percentis por idade, sexo e estatura.',
      '',
      `Dados informados:`,
      `- Idade: ${idade} anos`,
      `- Sexo: ${sexo}`,
      `- Estatura: ${estatura} cm`,
      `- PAS/PAD: ${pas}/${pad} mmHg`,
      '',
      'Estrutura pronta para plugar P90, P95 e P95+12.'
    ].join('\n')
  );
}
