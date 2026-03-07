// quiz.js — Quiz engine for Physics 101
// Shows one question at a time with Prev/Next navigation.
// Next is locked until the current question is answered.
// Prev lets you review already-answered questions.

import { addXP, completeQuiz, recordPerfectQuiz } from './progress.js';
import { escapeHtml } from './utils.js';

const XP_PER_CORRECT = 25;

/**
 * Render a quiz inside the given container element.
 *
 * @param {HTMLElement} containerEl
 * @param {Array} questions — array of question objects:
 *   { question: string, options: string[], correct: number, explanation: string }
 * @param {string} topicId
 */
export function renderQuiz(containerEl, questions, topicId) {
  if (!containerEl || !questions || questions.length === 0) return;

  containerEl.innerHTML = '';
  containerEl.classList.add('quiz-container');

  const total = questions.length;

  // Per-question state
  const answered  = new Array(total).fill(false);
  const selected  = new Array(total).fill(-1);
  const wasCorrect = new Array(total).fill(false);
  let xpAwarded   = new Array(total).fill(false);
  let correctCount = 0;
  let current     = 0;

  // ── Build shell ────────────────────────────────────────────────
  containerEl.innerHTML = `
    <div class="quiz-nav">
      <button class="btn btn--ghost quiz-prev-btn" disabled>◀ Prev</button>
      <span class="quiz-counter">Question 1 of ${total}</span>
      <button class="btn btn--ghost quiz-next-btn" disabled>Next ▶</button>
    </div>
    <div class="quiz-body"></div>
  `;

  const prevBtn   = containerEl.querySelector('.quiz-prev-btn');
  const nextBtn   = containerEl.querySelector('.quiz-next-btn');
  const counterEl = containerEl.querySelector('.quiz-counter');
  const bodyEl    = containerEl.querySelector('.quiz-body');

  // ── Render a single question ────────────────────────────────────
  function renderQuestion(idx) {
    const q          = questions[idx];
    const isAnswered = answered[idx];
    const chosenIdx  = selected[idx];

    const optionsHtml = q.options.map((opt, oi) => {
      let cls = 'quiz-option';
      if (isAnswered) {
        cls += ' disabled';
        if (oi === q.correct)  cls += ' correct';
        if (oi === chosenIdx && oi !== q.correct) cls += ' incorrect';
      }
      return `<button class="${cls}" data-oi="${oi}">${escapeHtml(opt)}</button>`;
    }).join('');

    const explanationHtml = isAnswered && q.explanation
      ? `<div class="quiz-explanation"><strong>Explanation:</strong> ${escapeHtml(q.explanation)}</div>`
      : '';

    bodyEl.innerHTML = `
      <div class="quiz-question" data-index="${idx}">
        <div class="quiz-question-text">
          <span class="quiz-q-num">${idx + 1}.</span> ${escapeHtml(q.question)}
        </div>
        <div class="quiz-options">${optionsHtml}</div>
        ${explanationHtml}
      </div>
    `;

    // Wire option clicks if not yet answered
    if (!isAnswered) {
      bodyEl.querySelectorAll('.quiz-option').forEach(btn => {
        btn.addEventListener('click', () => handleAnswer(idx, parseInt(btn.dataset.oi, 10)));
      });
    }

    // Update nav
    counterEl.textContent = `Question ${idx + 1} of ${total}`;
    prevBtn.disabled = idx === 0;
    // Next: enabled if answered (or if it's the last question and all answered)
    nextBtn.disabled = !isAnswered;
    nextBtn.textContent = (idx === total - 1) ? 'Finish ✓' : 'Next ▶';
  }

  // ── Handle answer selection ─────────────────────────────────────
  function handleAnswer(idx, chosenIdx) {
    if (answered[idx]) return;

    answered[idx]  = true;
    selected[idx]  = chosenIdx;
    const correct  = chosenIdx === questions[idx].correct;
    wasCorrect[idx] = correct;

    if (correct && !xpAwarded[idx]) {
      xpAwarded[idx] = true;
      correctCount++;
      addXP(XP_PER_CORRECT);
    }

    // Re-render with answered state
    renderQuestion(idx);
  }

  // ── Prev / Next ─────────────────────────────────────────────────
  prevBtn.addEventListener('click', () => {
    if (current > 0) renderQuestion(--current);
  });

  nextBtn.addEventListener('click', () => {
    if (current < total - 1) {
      renderQuestion(++current);
    } else {
      // All questions done — show results
      showResults(containerEl, correctCount, total, topicId);
    }
  });

  // ── Initial render ──────────────────────────────────────────────
  renderQuestion(0);
}

// ── Results ───────────────────────────────────────────────────────

function showResults(containerEl, correct, total, topicId) {
  completeQuiz(topicId);

  const pct = Math.round((correct / total) * 100);
  const totalXP = correct * XP_PER_CORRECT;

  let emoji, message;
  if (pct === 100) {
    emoji = '🌟'; message = 'Perfect score! Outstanding!';
    recordPerfectQuiz(topicId);
  } else if (pct >= 75) {
    emoji = '🎉'; message = 'Great job!';
  } else if (pct >= 50) {
    emoji = '👍'; message = 'Good effort! Review the explanations to learn more.';
  } else {
    emoji = '📚'; message = "Keep studying! You'll get there.";
  }

  // Replace nav + body with results
  containerEl.innerHTML = `
    <div class="quiz-results">
      <div class="quiz-results-icon">${emoji}</div>
      <div class="quiz-results-score">${correct} / ${total} correct (${pct}%)</div>
      <div class="quiz-results-xp">+${totalXP} XP earned</div>
      <div class="quiz-results-message">${message}</div>
    </div>
  `;

  containerEl.querySelector('.quiz-results')
    .scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

