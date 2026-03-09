// match-the-motion.js — Scenario → motion-graph matching mini-game
// Renders into #match-the-motion container injected by injectFeatureSections().

/**
 * @param {HTMLElement} containerEl — the #match-the-motion div
 * @param {object}      extras      — topicExtras for this slug
 */
export function renderMatchTheMotion(containerEl, extras) {
  if (!containerEl) return;

  const scenarios = extras && extras.matchTheMotion;
  if (!scenarios || scenarios.length === 0) {
    const section = containerEl.closest('.feature-section');
    if (section) section.style.display = 'none';
    return;
  }

  let currentIdx = 0;
  let score      = 0;
  let answered   = false;

  // Single persistent click handler — avoids listener leaks across re-renders
  function onClick(e) {
    const card     = e.target.closest('.mtm__graph');
    const nextBtn  = e.target.closest('.mtm__next-btn');
    const retryBtn = e.target.closest('.mtm__retry-btn');

    if (retryBtn) {
      currentIdx = 0;
      score = 0;
      renderScenario();
      return;
    }

    if (nextBtn) {
      currentIdx++;
      if (currentIdx >= scenarios.length) {
        renderFinal();
      } else {
        renderScenario();
      }
      return;
    }

    if (card && !answered) {
      answered = true;
      const chosen   = parseInt(card.dataset.idx, 10);
      const scenario = scenarios[currentIdx];
      const correct  = scenario.correct;
      const feedbackEl = containerEl.querySelector('.mtm__feedback');

      containerEl.querySelectorAll('.mtm__graph').forEach(c => {
        c.disabled = true;
        c.style.pointerEvents = 'none';
      });

      if (chosen === correct) {
        score++;
        card.classList.add('mtm__graph--correct');
        feedbackEl.innerHTML =
          `<span class="mtm__fb--ok">✅ ${escText(scenario.feedbackCorrect || 'Correct!')}</span>`;
      } else {
        card.classList.add('mtm__graph--wrong');
        containerEl.querySelectorAll('.mtm__graph')[correct].classList.add('mtm__graph--correct');
        feedbackEl.innerHTML =
          `<span class="mtm__fb--no">❌ ${escText(scenario.feedbackWrong || 'Not quite.')}</span>`;
      }

      const nextLabel = currentIdx + 1 < scenarios.length ? 'Next ›' : 'See Results';
      feedbackEl.innerHTML +=
        `<br><button class="btn mtm__next-btn" style="margin-top:var(--space-md)">${nextLabel}</button>`;
    }
  }

  function renderScenario() {
    answered = false;
    const scenario = scenarios[currentIdx];

    const graphsHtml = scenario.options.map((opt, i) => `
      <button class="mtm__graph" data-idx="${i}" aria-label="${escAttr(opt.label)}">
        <svg class="mtm__svg" viewBox="0 0 100 70" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <line x1="10" y1="5"  x2="10" y2="62" stroke="currentColor" stroke-width="1.5" opacity="0.4"/>
          <line x1="10" y1="62" x2="95" y2="62" stroke="currentColor" stroke-width="1.5" opacity="0.4"/>
          <polyline points="7,10 10,5 13,10"   stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.4"/>
          <polyline points="90,59 95,62 90,65"  stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.4"/>
          ${opt.path}
        </svg>
        <span class="mtm__graph-label">${escText(opt.label)}</span>
      </button>`).join('');

    containerEl.innerHTML = `
      <div class="mtm__header">
        <span class="mtm__progress">Scenario ${currentIdx + 1} / ${scenarios.length}</span>
        <span class="mtm__score">Score: ${score}</span>
      </div>
      <div class="mtm__scenario">
        <span class="mtm__icon">${scenario.icon || '❓'}</span>
        <p class="mtm__desc">${escText(scenario.description)}</p>
        <p class="mtm__prompt">Which <strong>${escText(scenario.graphType || 'graph')}</strong> matches this motion?</p>
      </div>
      <div class="mtm__graphs">${graphsHtml}</div>
      <div class="mtm__feedback" aria-live="polite"></div>
    `;
  }

  function renderFinal() {
    const pct  = Math.round((score / scenarios.length) * 100);
    const icon = pct === 100 ? '🏆' : pct >= 60 ? '👍' : '📚';
    const msg  = pct === 100
      ? 'Perfect! You nailed every graph!'
      : pct >= 60
        ? 'Good work! Review the ones you missed.'
        : 'Keep practising — graphs get easier!';

    containerEl.innerHTML = `
      <div class="mtm__final">
        <div class="mtm__final-icon">${icon}</div>
        <div class="mtm__final-score">${score} / ${scenarios.length}</div>
        <div class="mtm__final-msg">${msg}</div>
        <button class="btn mtm__retry-btn" style="margin-top:var(--space-lg)">Try Again</button>
      </div>
    `;
  }

  // Attach single listener once
  containerEl.addEventListener('click', onClick);

  // Initial render
  renderScenario();
}

// ── Helpers ───────────────────────────────────────────────────────────

function escText(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escAttr(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;');
}
