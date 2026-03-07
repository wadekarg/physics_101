// spot-mistake.js — Click-the-wrong-step quiz with KaTeX

/**
 * Render Spot the Mistake problems into containerEl.
 * @param {HTMLElement} containerEl
 * @param {Object} extras — topic extras data
 * @param {Function} addXP — XP award function
 */
export function renderSpotTheMistake(containerEl, extras, addXP) {
  if (!containerEl) return;
  const problems = extras.spotTheMistake || [];
  if (problems.length === 0) {
    _hideSection(containerEl);
    return;
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'spot-mistake';
  containerEl.appendChild(wrapper);

  problems.forEach((problem) => {
    const problemEl = document.createElement('div');
    problemEl.className = 'spot-mistake__problem';
    problemEl.dataset.errorStep = String(problem.errorStep);

    const stepsHtml = (problem.steps || []).map((step, si) => `
      <button class="mistake-step" data-step="${si}" aria-label="Step ${si + 1}">
        <span class="mistake-step__num">Step ${si + 1}</span>
        <span class="mistake-step__text">${_esc(step.text)}</span>
        ${step.latex
          ? `<span class="mistake-step__formula katex-block" data-latex="${_attr(step.latex)}"></span>`
          : ''}
      </button>
    `).join('');

    problemEl.innerHTML = `
      <p class="spot-mistake__statement">${_esc(problem.problem)}</p>
      <p style="font-size: var(--fs-sm); color: var(--text-muted); margin-bottom: var(--space-sm);">
        Click the step that contains the mistake:
      </p>
      <div class="spot-mistake__steps">${stepsHtml}</div>
      <div class="spot-mistake__feedback hidden"></div>
      <div class="spot-mistake__explanation hidden">${_esc(problem.explanation)}</div>
    `;

    wrapper.appendChild(problemEl);

    // Render KaTeX in step buttons
    _renderKaTeX(problemEl);

    // ── Wire up click handlers ───────────────────────────────────
    const errorStep = parseInt(problem.errorStep, 10);
    const feedbackEl = problemEl.querySelector('.spot-mistake__feedback');
    const explanationEl = problemEl.querySelector('.spot-mistake__explanation');

    problemEl.querySelectorAll('.mistake-step').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (problemEl.dataset.solved) return;

        const clicked = parseInt(btn.dataset.step, 10);

        if (clicked === errorStep) {
          // ✓ Correct
          problemEl.dataset.solved = 'true';
          btn.classList.add('selected-correct');
          btn.setAttribute('aria-pressed', 'true');

          feedbackEl.textContent = '✓ Correct! That\'s where the mistake is.';
          feedbackEl.className = 'spot-mistake__feedback feedback--correct';
          feedbackEl.classList.remove('hidden');

          explanationEl.classList.remove('hidden');

          // Disable all buttons
          problemEl.querySelectorAll('.mistake-step').forEach((b) => {
            b.disabled = true;
          });

          addXP(20);
        } else {
          // ✗ Wrong
          btn.classList.add('selected-wrong');
          feedbackEl.textContent = '✗ Not quite — try a different step.';
          feedbackEl.className = 'spot-mistake__feedback feedback--wrong';
          feedbackEl.classList.remove('hidden');

          // Remove shake class after animation
          setTimeout(() => btn.classList.remove('selected-wrong'), 500);
        }
      });
    });
  });
}

// ── helpers ──────────────────────────────────────────────────────────

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
