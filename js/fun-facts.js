// fun-facts.js — Renders fun-fact callout cards for Quantum Playground

/**
 * Render fun-fact cards inside the given container.
 *
 * @param {HTMLElement} containerEl — element to render cards into
 * @param {string[]} facts — array of fun-fact strings
 */
export function renderFunFacts(containerEl, facts) {
  if (!containerEl || !facts || facts.length === 0) return;

  containerEl.innerHTML = '';
  containerEl.classList.add('fun-facts-container');

  facts.forEach((fact, index) => {
    const card = document.createElement('div');
    card.className = 'fun-fact-card';
    // Slight stagger for appearance animation
    card.style.animationDelay = `${index * 0.12}s`;

    card.innerHTML = `
      <div class="fun-fact-glow"></div>
      <div class="fun-fact-header">
        <span class="fun-fact-icon">\uD83D\uDCA1</span>
        <span class="fun-fact-label">Did You Know?</span>
      </div>
      <div class="fun-fact-text">${escapeHtml(fact)}</div>
    `;

    containerEl.appendChild(card);
  });
}

// ── internal helper ─────────────────────────────────────────────────

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
