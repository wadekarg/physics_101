// story-theory.js — Chunked narrative theory with inline micro-quizzes
// Replaces #theory innerHTML when extras.storyChunks exists.
// All other topic pages are unaffected (static HTML stays).

/**
 * @param {HTMLElement} theorySection  — the #theory element
 * @param {object}      extras         — topicExtras for this slug
 */
export function renderStoryTheory(theorySection, extras) {
  if (!theorySection) return;
  if (!extras || !extras.storyChunks || extras.storyChunks.length === 0) return;

  const chunks = extras.storyChunks;
  const hook   = extras.storyHook || '';

  // ── Build HTML ────────────────────────────────────────────────────
  const hookHtml = hook
    ? `<div class="story-hook">${escText(hook)}</div>`
    : '';

  const dotsHtml = chunks.map((_, i) =>
    `<span class="story-step${i === 0 ? ' story-step--active' : ''}" data-dot="${i}"></span>`
  ).join('');

  const chunksHtml = chunks.map((chunk, i) => {
    const lockedClass = i === 0 ? 'story-chunk--open' : 'story-chunk--locked';
    const q = chunk.question;
    const interactiveHtml = q
      ? buildQuestion(q, i)
      : `<button class="btn story-continue-btn" data-chunk="${i}">Continue ›</button>`;

    return `
      <div class="story-chunk ${lockedClass}" data-chunk="${i}">
        <div class="story-chunk__title">
          <span class="story-chunk__badge">${i + 1}</span>
          ${escText(chunk.title || '')}
        </div>
        <div class="story-chunk__text">${formatText(chunk.text || '')}</div>
        <div class="story-chunk__interact">${interactiveHtml}</div>
      </div>`;
  }).join('');

  theorySection.innerHTML = `
    <h3>Theory</h3>
    ${hookHtml}
    <div class="story-progress" aria-label="Progress">${dotsHtml}</div>
    <div class="story-chunks">${chunksHtml}</div>
  `;

  // ── Event delegation (single listener, no leaks) ──────────────────
  theorySection.addEventListener('click', (e) => {
    // Continue button
    const continueBtn = e.target.closest('.story-continue-btn');
    if (continueBtn) {
      const idx = parseInt(continueBtn.dataset.chunk, 10);
      unlockNext(theorySection, chunks, idx);
      return;
    }

    // Quiz option
    const opt = e.target.closest('.iq-opt');
    if (opt && !opt.closest('.inline-q').dataset.answered) {
      handleAnswer(theorySection, chunks, opt);
    }
  });
}

// ── Helpers ───────────────────────────────────────────────────────────

function buildQuestion(q, chunkIdx) {
  const optsHtml = q.options.map((label, i) =>
    `<button class="iq-opt" data-idx="${i}" data-chunk="${chunkIdx}">${escText(label)}</button>`
  ).join('');

  return `
    <div class="inline-q"
         data-correct="${q.correct}"
         data-feedback="${escAttr(q.feedback || '')}"
         data-chunk="${chunkIdx}">
      <p class="inline-q__text">${escText(q.text)}</p>
      <div class="iq-opts">${optsHtml}</div>
      <div class="iq-feedback" aria-live="polite"></div>
    </div>`;
}

function handleAnswer(theorySection, chunks, optEl) {
  const iq       = optEl.closest('.inline-q');
  const correct  = parseInt(iq.dataset.correct, 10);
  const feedback = iq.dataset.feedback || '';
  const chosen   = parseInt(optEl.dataset.idx, 10);
  const chunkIdx = parseInt(iq.dataset.chunk, 10);
  const feedbackEl = iq.querySelector('.iq-feedback');

  // Mark as answered to prevent re-clicks
  iq.dataset.answered = '1';
  iq.querySelectorAll('.iq-opt').forEach(b => b.disabled = true);

  if (chosen === correct) {
    optEl.classList.add('iq-opt--correct');
    feedbackEl.textContent = feedback || '✅ Correct!';
    feedbackEl.className   = 'iq-feedback iq-feedback--ok';
    setTimeout(() => unlockNext(theorySection, chunks, chunkIdx), 700);
  } else {
    optEl.classList.add('iq-opt--wrong');
    // highlight correct
    iq.querySelectorAll('.iq-opt')[correct].classList.add('iq-opt--correct');
    feedbackEl.textContent = feedback || '❌ Not quite — see the correct answer above.';
    feedbackEl.className   = 'iq-feedback iq-feedback--no';
    setTimeout(() => unlockNext(theorySection, chunks, chunkIdx), 1500);
  }
}

function unlockNext(theorySection, chunks, currentIdx) {
  const next = currentIdx + 1;
  if (next >= chunks.length) return;

  const nextEl = theorySection.querySelector(`.story-chunk[data-chunk="${next}"]`);
  if (!nextEl) return;

  nextEl.classList.remove('story-chunk--locked');
  nextEl.classList.add('story-chunk--open', 'story-chunk--new');
  // Remove animation class after it fires to keep styles clean
  nextEl.addEventListener('animationend', () => nextEl.classList.remove('story-chunk--new'), { once: true });

  // Update progress dots
  updateDots(theorySection, next);

  // Smooth scroll to next chunk
  setTimeout(() => nextEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
}

function updateDots(theorySection, activeIdx) {
  theorySection.querySelectorAll('.story-step').forEach((dot, i) => {
    dot.classList.toggle('story-step--done',   i < activeIdx);
    dot.classList.toggle('story-step--active', i === activeIdx);
  });
}

/** Convert **bold** markers and \n line breaks to HTML */
function formatText(text) {
  return escText(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}

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
