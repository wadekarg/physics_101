// formula-card.js — Collapsible formula reference card with KaTeX rendering

/**
 * Render a collapsible formula card into containerEl.
 * @param {HTMLElement} containerEl
 * @param {Object} extras — topic extras data
 */
export function renderFormulaCard(containerEl, extras) {
  if (!containerEl) return;
  const formulas = extras.formulaCard || [];
  if (formulas.length === 0) {
    _hideSection(containerEl);
    return;
  }

  const itemsHtml = formulas.map((f) => _formulaItemHtml(f)).join('');

  containerEl.innerHTML = `
    <div class="formula-card">
      <button class="formula-card__toggle" aria-expanded="true">
        <span class="formula-card__title">📐 Formula Reference</span>
        <span class="formula-card__chevron">▼</span>
      </button>
      <div class="formula-card__body">
        ${itemsHtml}
      </div>
    </div>
  `;

  // Toggle collapse
  const toggle = containerEl.querySelector('.formula-card__toggle');
  const body = containerEl.querySelector('.formula-card__body');
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    body.classList.toggle('collapsed', expanded);
  });

  _renderKaTeX(containerEl);
}

// ── internals ────────────────────────────────────────────────────────

function _formulaItemHtml(formula) {
  const vars = formula.variables || [];
  const tableHtml = vars.length
    ? `<table class="formula-var-table">
        <thead><tr><th>Symbol</th><th>Meaning</th><th>Unit</th></tr></thead>
        <tbody>
          ${vars.map((v) => `
            <tr>
              <td class="formula-var-table__sym"><span class="katex-inline" data-latex="${_attr(v.sym)}"></span></td>
              <td>${_esc(v.desc)}</td>
              <td class="formula-var-table__unit">${_esc(v.unit)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>`
    : '';

  return `
    <div class="formula-card__item">
      <div class="formula-card__name">${_esc(formula.name)}</div>
      <div class="formula-card__formula katex-block" data-latex="${_attr(formula.latex)}"></div>
      ${tableHtml}
    </div>
  `;
}

function _renderKaTeX(el) {
  if (!window.katex) return;
  el.querySelectorAll('[data-latex]').forEach((node) => {
    try {
      const displayMode = !node.classList.contains('katex-inline');
      window.katex.render(node.dataset.latex, node, { displayMode, throwOnError: false });
    } catch (e) { /* silent */ }
  });
}

function _hideSection(el) {
  const section = el.closest('.feature-section');
  if (section) section.style.display = 'none';
}

function _esc(str) {
  if (str == null) return '';
  const d = document.createElement('div');
  d.textContent = String(str);
  return d.innerHTML;
}

function _attr(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}
