// practice-problems.js — Randomised numerical practice with answer checking

const XP_PER_CORRECT = 15;
const TOLERANCE = 0.02; // ±2%

/**
 * Render practice problems into containerEl.
 * @param {HTMLElement} containerEl
 * @param {Object} extras — topic extras data
 * @param {Function} addXP — XP award function
 */
export function renderPracticeProblems(containerEl, extras, addXP) {
  if (!containerEl) return;
  const problems = extras.practiceProblems || [];
  if (problems.length === 0) {
    _hideSection(containerEl);
    return;
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'practice-problems';
  containerEl.appendChild(wrapper);

  problems.forEach((problem, idx) => {
    const problemEl = document.createElement('div');
    problemEl.className = 'practice-problem';
    wrapper.appendChild(problemEl);

    // Closure over current random variable values
    let currentVars = {};

    function setup() {
      currentVars = _generateVars(problem.vars || {});
      const statement = _substituteTemplate(problem.template, currentVars);
      const dp = problem.decimalPlaces !== undefined ? problem.decimalPlaces : 2;

      problemEl.innerHTML = `
        <div class="practice-problem__header">Problem ${idx + 1}</div>
        <p class="practice-problem__statement">${_esc(statement)}</p>
        <div class="practice-problem__hint-area">
          <button class="btn btn--ghost practice-problem__hint-toggle">💡 Formula Hint</button>
          <div class="practice-problem__hint-body collapsed">
            ${problem.formulaLatex
              ? `<div class="katex-block" data-latex="${_attr(problem.formulaLatex)}"></div>`
              : '<em>No formula hint available.</em>'}
          </div>
        </div>
        <div class="practice-problem__input-group">
          <input type="number" class="answer-input" placeholder="Your answer" step="any" aria-label="Answer">
          <span class="practice-problem__unit">${_esc(problem.answerUnit || '')}</span>
          <button class="btn btn--primary check-btn">Check</button>
        </div>
        <div class="practice-problem__feedback hidden"></div>
        <div class="practice-problem__solution hidden"></div>
        <button class="btn btn--ghost new-problem-btn">↺ New Problem</button>
      `;

      _renderKaTeX(problemEl);

      // ── Hint toggle ──────────────────────────────────────────
      const hintToggle = problemEl.querySelector('.practice-problem__hint-toggle');
      const hintBody = problemEl.querySelector('.practice-problem__hint-body');
      hintToggle.addEventListener('click', () => {
        hintBody.classList.toggle('collapsed');
        _renderKaTeX(hintBody);
      });

      // ── Check answer ─────────────────────────────────────────
      const checkBtn = problemEl.querySelector('.check-btn');
      const inputEl = problemEl.querySelector('.answer-input');
      const feedbackEl = problemEl.querySelector('.practice-problem__feedback');
      const solutionEl = problemEl.querySelector('.practice-problem__solution');

      function checkAnswer() {
        const raw = inputEl.value.trim();
        if (raw === '') {
          feedbackEl.textContent = 'Please enter a numeric answer.';
          feedbackEl.className = 'practice-problem__feedback feedback--warning';
          feedbackEl.classList.remove('hidden');
          return;
        }

        const userVal = parseFloat(raw);
        if (isNaN(userVal)) {
          feedbackEl.textContent = 'Invalid number. Please try again.';
          feedbackEl.className = 'practice-problem__feedback feedback--warning';
          feedbackEl.classList.remove('hidden');
          return;
        }

        const correctVal = _evaluate(problem.answerExpr, currentVars);
        if (correctVal === null) {
          feedbackEl.textContent = 'Could not evaluate the correct answer.';
          feedbackEl.className = 'practice-problem__feedback feedback--warning';
          feedbackEl.classList.remove('hidden');
          return;
        }

        const relErr = Math.abs(correctVal) > 1e-10
          ? Math.abs((userVal - correctVal) / correctVal)
          : Math.abs(userVal - correctVal);
        const isCorrect = relErr <= TOLERANCE;

        feedbackEl.textContent = isCorrect
          ? `✓ Correct! ${correctVal.toFixed(dp)} ${problem.answerUnit || ''}`
          : `✗ Incorrect. The answer is ${correctVal.toFixed(dp)} ${problem.answerUnit || ''}`;
        feedbackEl.className = `practice-problem__feedback ${isCorrect ? 'feedback--correct' : 'feedback--wrong'}`;
        feedbackEl.classList.remove('hidden');

        // Solution reveal
        let solutionHtml = '<strong>Solution:</strong><br>';
        if (problem.formulaLatex) {
          solutionHtml += `Formula: <span class="katex-inline" data-latex="${_attr(problem.formulaLatex)}"></span><br>`;
        }
        // Show substituted values
        const varStr = Object.entries(currentVars)
          .map(([k, v]) => `${k} = ${v}`)
          .join(', ');
        solutionHtml += `<span style="color: var(--text-muted); font-size: var(--fs-sm);">[${_esc(varStr)}]</span><br>`;
        solutionHtml += `Answer = <strong>${correctVal.toFixed(dp)} ${_esc(problem.answerUnit || '')}</strong>`;
        solutionEl.innerHTML = solutionHtml;
        solutionEl.classList.remove('hidden');
        _renderKaTeX(solutionEl);

        if (isCorrect) {
          addXP(XP_PER_CORRECT);
          checkBtn.disabled = true;
          inputEl.disabled = true;
        }
      }

      checkBtn.addEventListener('click', checkAnswer);
      inputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAnswer();
      });

      // ── New Problem ──────────────────────────────────────────
      const newBtn = problemEl.querySelector('.new-problem-btn');
      newBtn.addEventListener('click', () => setup());
    }

    setup();
  });
}

// ── helpers ──────────────────────────────────────────────────────────

function _generateVars(schema) {
  const values = {};
  for (const [name, spec] of Object.entries(schema)) {
    const steps = Math.round((spec.max - spec.min) / (spec.step || 1));
    const n = Math.floor(Math.random() * (steps + 1));
    values[name] = parseFloat((spec.min + n * (spec.step || 1)).toFixed(10));
  }
  return values;
}

function _substituteTemplate(template, values) {
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    key in values ? values[key] : `{${key}}`
  );
}

function _evaluate(expr, values) {
  if (!expr) return null;
  try {
    const varNames = Object.keys(values);
    const varValues = varNames.map((k) => values[k]);
    // eslint-disable-next-line no-new-func
    return new Function(...varNames, `return (${expr});`)(...varValues);
  } catch (e) {
    return null;
  }
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
