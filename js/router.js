export function initMainTabs() {
  const buttons = document.querySelectorAll('[data-tab]');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.dataset.tab;

      document.querySelectorAll('.tab-content').forEach((tab) => {
        tab.classList.remove('active');
      });

      buttons.forEach((btn) => btn.classList.remove('active'));

      document.getElementById(targetId)?.classList.add('active');
      button.classList.add('active');

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}
