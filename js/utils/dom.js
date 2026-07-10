export function byId(id) {
  return document.getElementById(id);
}

export function showResult(id, text) {
  const el = byId(id);
  if (!el) return;
  el.style.display = 'block';
  el.textContent = text;
}
