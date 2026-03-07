// worked-examples.js — One-at-a-time worked examples with Prev/Next navigation

/**
 * Render worked examples into containerEl.
 * Shows one example at a time; Prev/Next buttons navigate between them.
 * Steps within each example are revealed one by one.
 *
 * @param {HTMLElement} containerEl
 * @param {Object} extras — topic extras data
 */
export function renderWorkedExamples(containerEl, extras) {
  if (!containerEl) return;
  const examples = extras.workedExamples || [];
  if (examples.length === 0) {
    _hideSection(containerEl);
    return;
  }

  const total = examples.length;
  let current = 0;

  // ── Build shell ────────────────────────────────────────────────
  const wrapper = document.createElement('div');
  wrapper.className = 'worked-examples';
  wrapper.innerHTML = `
    <div class="worked-examples__nav">
      <span class="worked-examples__counter">Example 1 of ${total}</span>
      <div class="worked-examples__nav-btns">
        <button class="btn btn--ghost we-prev-btn" disabled>◀ Prev</button>
        <button class="btn btn--ghost we-next-btn"${total === 1 ? ' disabled' : ''}>Next ▶</button>
      </div>
    </div>
    <div class="worked-example__body"></div>
  `;

  containerEl.appendChild(wrapper);

  const counterEl  = wrapper.querySelector('.worked-examples__counter');
  const prevBtn    = wrapper.querySelector('.we-prev-btn');
  const nextBtn    = wrapper.querySelector('.we-next-btn');
  const bodyEl     = wrapper.querySelector('.worked-example__body');

  // ── Render a single example ────────────────────────────────────
  function renderExample(idx) {
    const ex = examples[idx];
    const steps = ex.steps || [];

    const stepsHtml = steps.map((step, si) => `
      <div class="example-step${step.isFinal ? ' example-step--final' : ''}${si > 0 ? ' hidden' : ''}" data-step="${si}">
        <div class="example-step__text">${_esc(step.text)}</div>
        ${step.latex
          ? `<div class="example-step__formula katex-block" data-latex="${_attr(step.latex)}"></div>`
          : ''}
      </div>
    `).join('');

    bodyEl.innerHTML = `
      <div class="worked-example__title">${_esc(ex.title)}</div>
      <div class="example-steps" data-total="${steps.length}">
        ${stepsHtml}
      </div>
      ${steps.length > 1
        ? `<button class="btn btn--ghost example-next-btn" data-current="0" data-total="${steps.length}">
             Show Next Step ▶
           </button>`
        : ''}
    `;

    // KaTeX for first visible step
    const firstStep = bodyEl.querySelector('.example-step:not(.hidden)');
    if (firstStep) _renderKaTeX(firstStep);

    // Wire step-reveal button
    const stepBtn = bodyEl.querySelector('.example-next-btn');
    if (stepBtn) {
      stepBtn.addEventListener('click', () => {
        const cur  = parseInt(stepBtn.dataset.current, 10);
        const tot  = parseInt(stepBtn.dataset.total, 10);
        const next = cur + 1;
        if (next >= tot) return;

        const nextStepEl = bodyEl.querySelector(`[data-step="${next}"]`);
        if (nextStepEl) {
          nextStepEl.classList.remove('hidden');
          _renderKaTeX(nextStepEl);
          nextStepEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        stepBtn.dataset.current = next;
        if (next === tot - 1) {
          stepBtn.textContent = 'All Steps Shown ✓';
          stepBtn.disabled = true;
        }
      });
    }

    // Update counter + nav buttons
    counterEl.textContent = `Example ${idx + 1} of ${total}`;
    prevBtn.disabled = idx === 0;
    nextBtn.disabled = idx === total - 1;
  }

  // ── Prev / Next ────────────────────────────────────────────────
  prevBtn.addEventListener('click', () => {
    if (current > 0) renderExample(--current);
  });

  nextBtn.addEventListener('click', () => {
    if (current < total - 1) renderExample(++current);
  });

  // ── Initial render ─────────────────────────────────────────────
  renderExample(0);
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
