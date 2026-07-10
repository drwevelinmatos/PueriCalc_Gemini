import { byId } from '../../utils/dom.js';

export function initProtocolos() {
  const root = byId('laser-panel-protocolos');
  if (!root) return;

  root.innerHTML = `
    <div class="laser-panel-head">
      <h3>Protocolos</h3>
      <p>Quadro-resumo para organização clínica e padronização assistencial.</p>
    </div>

    <div class="laser-card">
      <div class="table-wrap">
        <table class="laser-table">
          <thead>
            <tr>
              <th>Área</th>
              <th>Objetivo</th>
              <th>Frequência sugerida</th>
              <th>Observação</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ILIB</td>
              <td>Suporte sistêmico / modulação inflamatória</td>
              <td>1–3x por semana</td>
              <td>Individualizar por quadro clínico e resposta</td>
            </tr>
            <tr>
              <td>Feridas</td>
              <td>Reparo tecidual / cicatrização</td>
              <td>2–3x por semana</td>
              <td>Registrar evolução fotográfica seriada</td>
            </tr>
            <tr>
              <td>Mucosite</td>
              <td>Analgesia / reparo de mucosa</td>
              <td>Diário ou alternado</td>
              <td>Pode exigir associação com protocolo local</td>
            </tr>
            <tr>
              <td>Dermatologia</td>
              <td>Modulação inflamatória cutânea</td>
              <td>1–3x por semana</td>
              <td>Definir por extensão e resposta clínica</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="laser-note-box">
        <h4>Checklist pré-sessão</h4>
        <div class="protocol-text">• Confirmar indicação clínica
• Registrar área-alvo e objetivo terapêutico
• Verificar integridade da pele/mucosa
• Registrar parâmetros utilizados
• Documentar tolerância e resposta clínica
• Programar reavaliação</div>
      </div>
    </div>
  `;
}
