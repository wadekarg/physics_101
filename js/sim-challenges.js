// sim-challenges.js — Simulation challenge card with honor-system completion

/**
 * Render the simulation challenge card into containerEl.
 * @param {HTMLElement} containerEl
 * @param {Object} extras — topic extras data
 * @param {Function} addXP — XP award function
 */
export function renderChallenges(containerEl, extras, addXP) {
  if (!containerEl) return;
  const challenge = extras.challenge;
  if (!challenge) {
    _hideSection(containerEl);
    return;
  }

  const slug = _getCurrentSlug();
  const storageKey = `qp-challenge-${slug}`;
  const alreadyDone = localStorage.getItem(storageKey) === 'done';

  containerEl.innerHTML = `
    <div class="sim-challenge">
      <div class="sim-challenge__header">
        <span class="sim-challenge__icon">🧪</span>
        <h4 class="sim-challenge__title">${_esc(challenge.title)}</h4>
        <span class="sim-challenge__xp">+${challenge.xpBonus || 75} XP</span>
      </div>
      <p class="sim-challenge__desc">${_esc(challenge.description)}</p>
      <div class="challenge-hint">
        <button class="challenge-hint__toggle">💡 Show Hint</button>
        <div class="challenge-hint__body collapsed">${_esc(challenge.hint)}</div>
      </div>
      <button class="btn btn--primary sim-challenge__complete-btn${alreadyDone ? ' completed' : ''}"
              ${alreadyDone ? 'disabled' : ''}>
        ${alreadyDone ? '✓ Completed!' : 'Mark as Completed ✓'}
      </button>
    </div>
  `;

  // ── Hint toggle ────────────────────────────────────────────────
  const hintToggle = containerEl.querySelector('.challenge-hint__toggle');
  const hintBody = containerEl.querySelector('.challenge-hint__body');
  hintToggle.addEventListener('click', () => {
    const open = !hintBody.classList.contains('collapsed');
    hintBody.classList.toggle('collapsed', open);
    hintToggle.textContent = open ? '💡 Show Hint' : '💡 Hide Hint';
  });

  // ── Complete button ────────────────────────────────────────────
  if (!alreadyDone) {
    const completeBtn = containerEl.querySelector('.sim-challenge__complete-btn');
    completeBtn.addEventListener('click', () => {
      localStorage.setItem(storageKey, 'done');
      completeBtn.textContent = '✓ Completed!';
      completeBtn.classList.add('completed');
      completeBtn.disabled = true;
      addXP(challenge.xpBonus || 75);
    });
  }
}

// ── helpers ──────────────────────────────────────────────────────────

function _getCurrentSlug() {
  const el = document.querySelector('[data-topic-slug]');
  return el ? el.getAttribute('data-topic-slug') : 'unknown';
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
