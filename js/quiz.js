// quiz.js — Quiz engine for Quantum Playground
// Renders multiple-choice questions, handles answer selection,
// shows correct/incorrect with explanation, and awards XP.

import { addXP, completeQuiz } from './progress.js';

const XP_PER_CORRECT = 25;

/**
 * Render a quiz inside the given container element.
 *
 * @param {HTMLElement} containerEl — element to render the quiz into
 * @param {Array} questions — array of question objects:
 *   { question: string, options: string[], correct: number, explanation: string }
 * @param {string} topicId — identifier of the topic this quiz belongs to
 */
export function renderQuiz(containerEl, questions, topicId) {
  if (!containerEl || !questions || questions.length === 0) return;

  containerEl.innerHTML = '';
  containerEl.classList.add('quiz-container');

  const state = {
    answered: 0,
    correct: 0,
    total: questions.length,
  };

  // Quiz header
  const header = document.createElement('div');
  header.className = 'quiz-header';
  header.innerHTML = `
    <h3 class="quiz-title">\u2753 Knowledge Check</h3>
    <div class="quiz-progress-text">
      <span class="quiz-answered">0</span> / <span class="quiz-total">${state.total}</span> answered
    </div>
  `;
  containerEl.appendChild(header);

  // Render each question
  questions.forEach((q, index) => {
    const questionEl = createQuestionElement(q, index, state, containerEl, topicId);
    containerEl.appendChild(questionEl);
  });
}

// ── internal helpers ────────────────────────────────────────────────

function createQuestionElement(q, index, state, containerEl, topicId) {
  const wrapper = document.createElement('div');
  wrapper.className = 'quiz-question';
  wrapper.dataset.index = index;

  // Question text
  const questionText = document.createElement('div');
  questionText.className = 'quiz-question-text';
  questionText.innerHTML = `<span class="quiz-q-num">${index + 1}.</span> ${escapeHtml(q.question)}`;
  wrapper.appendChild(questionText);

  // Options
  const optionsEl = document.createElement('div');
  optionsEl.className = 'quiz-options';

  q.options.forEach((option, optIdx) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = option;
    btn.dataset.optionIndex = optIdx;

    btn.addEventListener('click', () => {
      // Ignore if already answered
      if (wrapper.classList.contains('answered')) return;
      handleAnswer(wrapper, btn, optionsEl, q, optIdx, state, containerEl, topicId);
    });

    optionsEl.appendChild(btn);
  });

  wrapper.appendChild(optionsEl);

  // Explanation (hidden until answered)
  const explanationEl = document.createElement('div');
  explanationEl.className = 'quiz-explanation hidden';
  explanationEl.innerHTML = `<strong>Explanation:</strong> ${escapeHtml(q.explanation || '')}`;
  wrapper.appendChild(explanationEl);

  return wrapper;
}

function handleAnswer(wrapper, clickedBtn, optionsEl, question, chosenIdx, state, containerEl, topicId) {
  wrapper.classList.add('answered');

  const isCorrect = chosenIdx === question.correct;

  // Highlight all options
  optionsEl.querySelectorAll('.quiz-option').forEach((btn) => {
    const idx = parseInt(btn.dataset.optionIndex, 10);
    btn.disabled = true;

    if (idx === question.correct) {
      btn.classList.add('correct');
    }
    if (idx === chosenIdx && !isCorrect) {
      btn.classList.add('incorrect');
    }
  });

  // Show explanation
  const explanationEl = wrapper.querySelector('.quiz-explanation');
  if (explanationEl && question.explanation) {
    explanationEl.classList.remove('hidden');
  }

  // Update state
  state.answered += 1;
  if (isCorrect) {
    state.correct += 1;
    addXP(XP_PER_CORRECT);
  }

  // Update progress text
  const answeredSpan = containerEl.querySelector('.quiz-answered');
  if (answeredSpan) answeredSpan.textContent = state.answered;

  // If all questions answered, show final score
  if (state.answered === state.total) {
    showResults(containerEl, state, topicId);
  }
}

function showResults(containerEl, state, topicId) {
  // Mark quiz complete for this topic
  completeQuiz(topicId);

  const pct = Math.round((state.correct / state.total) * 100);
  const totalXP = state.correct * XP_PER_CORRECT;

  let emoji, message;
  if (pct === 100) {
    emoji = '\uD83C\uDF1F';
    message = 'Perfect score! Outstanding!';
    // Record perfect quiz for achievement checking
    recordPerfectQuiz(topicId);
  } else if (pct >= 75) {
    emoji = '\uD83C\uDF89';
    message = 'Great job!';
  } else if (pct >= 50) {
    emoji = '\uD83D\uDC4D';
    message = 'Good effort! Review the explanations to learn more.';
  } else {
    emoji = '\uD83D\uDCDA';
    message = 'Keep studying! You\'ll get there.';
  }

  const resultsEl = document.createElement('div');
  resultsEl.className = 'quiz-results';
  resultsEl.innerHTML = `
    <div class="quiz-results-icon">${emoji}</div>
    <div class="quiz-results-score">${state.correct} / ${state.total} correct (${pct}%)</div>
    <div class="quiz-results-xp">+${totalXP} XP earned</div>
    <div class="quiz-results-message">${message}</div>
  `;
  containerEl.appendChild(resultsEl);

  // Smooth-scroll results into view
  resultsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function recordPerfectQuiz(topicId) {
  try {
    const raw = localStorage.getItem('qp-progress');
    if (!raw) return;
    const progress = JSON.parse(raw);
    if (!progress.perfectQuizzes) progress.perfectQuizzes = [];
    if (!progress.perfectQuizzes.includes(topicId)) {
      progress.perfectQuizzes.push(topicId);
      localStorage.setItem('qp-progress', JSON.stringify(progress));
    }
  } catch { /* ignore */ }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
