import { byId } from '../../utils/dom.js';
import { openLaserPanel } from './shared.js';
import { initILIB } from './ilib.js';
import { initFeridas } from './feridas.js';
import { initMucosite } from './mucosite.js';
import { initDermato } from './dermato.js';
import { initProtocolos } from './protocolos.js';

export function renderLaser() {
  const root = byId('tab-laser');
  if (!root) return;

  root.innerHTML = `
    <div class="laser-page">
      <div class="laser-hero">
        <div class="laser-hero-badge">PueriCalc • Laserterapia</div>
        <h2>Laserterapia</h2>
        <p>Protocolos clínicos, calculadoras e documentação assistencial em um módulo organizado por subáreas.</p>
      </div>

      <div class="laser-shell">
        <aside class="laser-sidebar">
          <button class="laser-menu-btn active" data-laser-panel="laser-panel-ilib">
            <span class="laser-menu-title">ILIB</span>
            <span class="laser-menu-sub">Fotobiomodulação sistêmica</span>
          </button>

          <button class="laser-menu-btn" data-laser-panel="laser-panel-feridas">
            <span class="laser-menu-title">Feridas</span>
            <span class="laser-menu-sub">Reparo tecidual</span>
          </button>

          <button class="laser-menu-btn" data-laser-panel="laser-panel-mucosite">
            <span class="laser-menu-title">Mucosite</span>
            <span class="laser-menu-sub">Mucosa e analgesia</span>
          </button>

          <button class="laser-menu-btn" data-laser-panel="laser-panel-dermato">
            <span class="laser-menu-title">Dermatologia</span>
            <span class="laser-menu-sub">Inflamação e pele</span>
          </button>

          <button class="laser-menu-btn" data-laser-panel="laser-panel-protocolos">
            <span class="laser-menu-title">Protocolos</span>
            <span class="laser-menu-sub">Quadro-resumo clínico</span>
          </button>
        </aside>

        <section class="laser-content">
          <div id="laser-panel-ilib" class="laser-panel active"></div>
          <div id="laser-panel-feridas" class="laser-panel"></div>
          <div id="laser-panel-mucosite" class="laser-panel"></div>
          <div id="laser-panel-dermato" class="laser-panel"></div>
          <div id="laser-panel-protocolos" class="laser-panel"></div>
        </section>
      </div>
    </div>
  `;

  bindLaserMenu(root);

  initILIB();
  initFeridas();
  initMucosite();
  initDermato();
  initProtocolos();
}

function bindLaserMenu(root) {
  const buttons = root.querySelectorAll('[data-laser-panel]');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      openLaserPanel(root, button.dataset.laserPanel, button);
    });
  });
}
