// summary-card.js — Post-quiz summary card; appears after qp:quiz-complete

import { escapeHtml as _esc, attrEsc as _attr, renderKaTeX } from './utils.js';

/**
 * Initialise the summary card listener.
 * The card renders when the 'qp:quiz-complete' event fires.
 *
 * @param {HTMLElement} containerEl
 * @param {Object|null} topicData — topic object from chapters.json
 * @param {Object} extras — topic extras data
 */
export function initSummaryCard(containerEl, topicData, extras) {
  if (!containerEl) return;

  containerEl.style.display = 'none';

  const firstFormula = (extras.formulaCard || [])[0] || null;
  const topicTitle = topicData ? topicData.title : 'This Topic';

  document.addEventListener('qp:quiz-complete', () => {
    // quiz.js appends .quiz-results AFTER dispatching qp:quiz-complete, so defer
    setTimeout(() => {
      const scoreEl = document.querySelector('.quiz-results-score');
      const xpEl    = document.querySelector('.quiz-results-xp');
      const scoreText = scoreEl ? scoreEl.textContent.trim() : '—';
      const xpText    = xpEl    ? xpEl.textContent.trim()    : '—';

      const formulaHtml = firstFormula
        ? `<div class="summary-formula">
             <div class="summary-formula__name">Key Formula: ${_esc(firstFormula.name)}</div>
             <div class="katex-block" data-latex="${_attr(firstFormula.latex)}"></div>
           </div>`
        : '';

      containerEl.innerHTML = `
        <div class="summary-card">
          <h3 class="summary-card__title">📋 Topic Summary: ${_esc(topicTitle)}</h3>
          ${formulaHtml}
          <div class="summary-stats">
            <div class="summary-stat">
              <div class="summary-stat__label">Quiz Score</div>
              <div class="summary-stat__value">${_esc(scoreText)}</div>
            </div>
            <div class="summary-stat">
              <div class="summary-stat__label">XP Earned</div>
              <div class="summary-stat__value">${_esc(xpText)}</div>
            </div>
          </div>
          <button class="btn btn--ghost summary-card__print-btn" id="summary-print-btn">
            🖨️ Print / Save
          </button>
        </div>
      `;

      containerEl.style.display = '';
      containerEl.classList.add('summary-card--animate');

      const printBtn = containerEl.querySelector('#summary-print-btn');
      if (printBtn) printBtn.addEventListener('click', () => window.print());

      renderKaTeX(containerEl);
      containerEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 0);
  }, { once: true });
}
