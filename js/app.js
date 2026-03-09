// app.js — Main application entry point for Physics 101
// Loaded as type="module" by every HTML page (index.html and topics/*.html).
// Fetches chapters.json, initialises all modules, and renders the landing page
// or wires up topic-page navigation depending on which page we're on.

import { initTheme } from './theme.js';
import { initNav, setActiveTopic } from './nav.js';
import { initSearch } from './search.js';
import { initProgress, getStats, getLevel, getProgress, addXP } from './progress.js';
import { initAchievements } from './achievements.js';
import { SimEngine } from './sim-engine.js';
import { renderSimControls } from './sim-controls.js';
import { renderQuiz } from './quiz.js';
import { renderFunFacts } from './fun-facts.js';
import { RealtimeGraph } from './graph.js';
import { escapeHtml } from './utils.js';
import { renderFormulaCard } from './formula-card.js';
import { renderWorkedExamples } from './worked-examples.js';
import { renderConceptConnections } from './concept-connections.js';
import { renderChallenges } from './sim-challenges.js';
import { initSummaryCard } from './summary-card.js';
import { renderStoryTheory } from './story-theory.js';
import { renderMatchTheMotion } from './match-the-motion.js';
import { renderTheoryAnimation } from './theory-animation.js';

// ── Determine data path (root vs topics/ subdirectory) ──────────────
const isTopicPage = window.location.pathname.includes('/topics/');
const dataPath = isTopicPage ? '../data/chapters.json' : 'data/chapters.json';
const extrasPath = isTopicPage ? '../data/topic-extras.json' : 'data/topic-extras.json';

// ── Boot ─────────────────────────────────────────────────────────────

(async function boot() {
  // 1. Theme (no dependency on data)
  initTheme();

  // 2. Progress system (localStorage-only, no fetch needed)
  initProgress();
  updateHeaderBadges();
  document.addEventListener('qp:xp', updateHeaderBadges);

  // 3. Fetch chapter data
  let chapters = [];
  try {
    const res = await fetch(dataPath);
    if (!res.ok) throw new Error(`Failed to load chapters.json (${res.status})`);
    const data = await res.json();
    chapters = Array.isArray(data) ? data : (data.chapters || []);
  } catch (err) {
    console.warn('[app] Could not load chapters data:', err);
  }

  // 4. Initialise modules that depend on chapters
  initNav(chapters);
  initSearch(chapters);
  await initAchievements();

  // 5. Decide whether we're on the landing page or a topic page
  const topicEl = document.querySelector('[data-topic-slug]');
  if (topicEl) {
    // ── Topic page ──────────────────────────────────────────────
    const slug = topicEl.getAttribute('data-topic-slug');
    setActiveTopic(slug);

    // Load topic extras
    let allExtras = {};
    try {
      const extrasRes = await fetch(extrasPath);
      if (extrasRes.ok) allExtras = await extrasRes.json();
    } catch (e) {
      console.warn('[app] Could not load topic-extras:', e);
    }
    const topicExtras = allExtras[slug] || {};
    const topicData = findTopicBySlug(chapters, slug);

    // Load KaTeX for formula rendering
    await loadKaTeX();

    // Inject feature section containers into DOM
    injectFeatureSections();

    // Render all feature modules
    renderFormulaCard(document.getElementById('formula-card'), topicExtras);
    renderWorkedExamples(document.getElementById('worked-examples'), topicExtras);
    renderConceptConnections(document.getElementById('concept-connections'), topicExtras, chapters);
    renderChallenges(document.getElementById('sim-challenges'), topicExtras, addXP);
    initSummaryCard(document.getElementById('summary-card'), topicData, topicExtras);
    renderTheoryAnimation(document.getElementById('theory'), slug);
    renderStoryTheory(document.getElementById('theory'), topicExtras);
    renderMatchTheMotion(document.getElementById('match-the-motion'), topicExtras);
    renderChapterNav(slug, chapters);

  } else if (document.getElementById('chapters-grid')) {
    // ── Landing page ────────────────────────────────────────────
    renderStatsBar();
    renderLevelDisplay();
    renderChapterCards(chapters);
    // Update landing-page stats on XP change (single listener, no leaks)
    document.addEventListener('qp:xp', () => {
      renderStatsBar();
      renderLevelDisplay();
    });
    // Update chapter progress bars when a topic is completed
    document.addEventListener('qp:topic-complete', () => renderChapterCards(chapters));
  }

  // 6. Expose global QP object for topic simulation scripts
  window.QP = {
    chapters,
    progress: { getStats, getLevel, getProgress },
    SimEngine,
    renderSimControls,
    renderQuiz,
    renderFunFacts,
    RealtimeGraph,
    renderFormulaCard,
    renderWorkedExamples,
    renderConceptConnections,
    renderChallenges,
    initSummaryCard,
    renderStoryTheory,
    renderMatchTheMotion,
    renderTheoryAnimation,
  };
})();

// ── Topic-page helpers ────────────────────────────────────────────────

/**
 * Dynamically load KaTeX from CDN if not already loaded.
 */
function loadKaTeX() {
  if (window.katex) return Promise.resolve();
  return new Promise((resolve) => {
    // CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
    document.head.appendChild(link);

    // JS
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
    script.onload = resolve;
    script.onerror = () => {
      console.warn('[app] KaTeX failed to load; formulas will show as raw LaTeX');
      resolve();
    };
    document.head.appendChild(script);
  });
}

/**
 * Inject feature section containers into .topic-content at the right positions.
 * No HTML files are modified — this runs after the DOM is ready.
 */
function injectFeatureSections() {
  const theory = document.getElementById('theory');
  const sim = document.getElementById('simulation');
  const quiz = document.getElementById('quiz-section');

  // After #theory: Formula Card → Worked Examples
  if (theory) {
    theory.insertAdjacentElement('afterend', makeSection('worked-examples', '✏️ Worked Examples'));
    theory.insertAdjacentElement('afterend', makeSection('formula-card', '📐 Formula Card'));
  }

  // After #simulation: Match the Motion → Simulation Challenge
  if (sim) {
    sim.insertAdjacentElement('afterend', makeSection('sim-challenges', '🧪 Challenge Lab'));
    sim.insertAdjacentElement('afterend', makeSection('match-the-motion', '🎯 Match the Motion'));
  }

  // After #quiz-section: Summary Card → Concept Connections
  if (quiz) {
    const order = [
      ['summary-card', ''],
      ['concept-connections', '🔗 Concept Connections'],
    ];
    let anchor = quiz;
    for (const [id, title] of order) {
      const section = makeSection(id, title);
      anchor.insertAdjacentElement('afterend', section);
      anchor = section;
    }
  }
}

/**
 * Create a feature section element containing a titled div.
 */
function makeSection(id, title) {
  const section = document.createElement('section');
  section.className = 'feature-section';
  section.style.marginTop = 'var(--space-xl)';
  if (title) {
    const h3 = document.createElement('h3');
    h3.style.marginBottom = 'var(--space-md)';
    h3.textContent = title;
    section.appendChild(h3);
  }
  const div = document.createElement('div');
  div.id = id;
  section.appendChild(div);
  return section;
}

/**
 * Find a topic object by its slug across all chapters.
 */
function findTopicBySlug(chapters, slug) {
  for (const chapter of chapters) {
    for (const topic of chapter.topics || []) {
      if ((topic.slug || topic.id) === slug) return topic;
    }
  }
  return null;
}

/**
 * Render Prev / Next chapter navigation at the bottom of the topic page.
 * Appended directly to .topic-content (or <main> as fallback).
 */
function renderChapterNav(slug, chapters) {
  // Flatten all topics across all chapters into one ordered list
  const allTopics = [];
  for (const ch of chapters) {
    for (const topic of ch.topics || []) {
      allTopics.push({ slug: topic.slug || topic.id, title: topic.title || '', icon: topic.icon || ch.icon || '' });
    }
  }

  const currentIdx = allTopics.findIndex(t => t.slug === slug);
  if (currentIdx === -1) return;

  const prev = currentIdx > 0 ? allTopics[currentIdx - 1] : null;
  const next = currentIdx < allTopics.length - 1 ? allTopics[currentIdx + 1] : null;

  const topicHref = (t) => `../topics/${t.slug}.html`;

  const prevHtml = prev
    ? `<a href="${topicHref(prev)}" class="chapter-nav__btn chapter-nav__btn--prev">
         <span class="chapter-nav__arrow">←</span>
         <span class="chapter-nav__text">
           <span class="chapter-nav__label">Previous Topic</span>
           <span class="chapter-nav__title">${escapeHtml(prev.icon)} ${escapeHtml(prev.title)}</span>
         </span>
       </a>`
    : `<span></span>`;

  const nextHtml = next
    ? `<a href="${topicHref(next)}" class="chapter-nav__btn chapter-nav__btn--next">
         <span class="chapter-nav__text">
           <span class="chapter-nav__label">Next Topic</span>
           <span class="chapter-nav__title">${escapeHtml(next.icon)} ${escapeHtml(next.title)}</span>
         </span>
         <span class="chapter-nav__arrow">→</span>
       </a>`
    : `<span></span>`;

  const nav = document.createElement('nav');
  nav.className = 'chapter-nav';
  nav.innerHTML = `${prevHtml}${nextHtml}`;

  const container = document.querySelector('.topic-content') || document.querySelector('main');
  if (container) container.appendChild(nav);
}

// ── Landing-page renderers ───────────────────────────────────────────

/**
 * Render the stats bar showing XP, level name, topics completed, and streak.
 */
function renderStatsBar() {
  const container = document.getElementById('stats-bar');
  if (!container) return;

  const stats = getStats();

  container.innerHTML = `
    <div class="stats-bar">
      <div class="stat">
        <div class="stat__value">${stats.xp.toLocaleString()}</div>
        <div class="stat__label">Total XP</div>
      </div>
      <div class="stat">
        <div class="stat__value">${stats.level.icon} ${escapeHtml(stats.level.name)}</div>
        <div class="stat__label">Current Level</div>
      </div>
      <div class="stat">
        <div class="stat__value">${stats.topicsCompleted}</div>
        <div class="stat__label">Topics Completed</div>
      </div>
      <div class="stat">
        <div class="stat__value">${stats.streak}</div>
        <div class="stat__label">Day Streak</div>
      </div>
    </div>
  `;

}

/**
 * Render the level display with icon, name, XP fraction, and a progress bar.
 */
function renderLevelDisplay() {
  const container = document.getElementById('level-display');
  if (!container) return;

  const level = getLevel();
  const pct = Math.round(level.progress * 100);
  const xpText = level.nextLevelXP
    ? `${level.xp.toLocaleString()} / ${level.nextLevelXP.toLocaleString()} XP`
    : `${level.xp.toLocaleString()} XP (Max Level)`;

  container.innerHTML = `
    <div class="level-display">
      <div class="level-display__icon">${level.icon}</div>
      <div class="level-display__info">
        <div class="level-display__title">${escapeHtml(level.name)}</div>
        <div class="level-display__subtitle">${xpText}</div>
      </div>
      <div class="level-display__bar">
        <div class="progress-bar">
          <div class="progress-bar__fill" style="width: ${pct}%"></div>
        </div>
      </div>
    </div>
  `;

}

/**
 * Render the chapter cards grid on the landing page.
 * Each card links to the first topic of the chapter as topics/{slug}.html.
 * @param {Array} chapters
 */
function renderChapterCards(chapters) {
  const grid = document.getElementById('chapters-grid');
  if (!grid || !chapters || chapters.length === 0) return;

  const progress = getProgress();
  const completedSet = new Set(progress.completedTopics || []);

  // Neon accent colors per chapter (cycle through the palette)
  const accentColors = [
    'var(--neon-intro)',
    'var(--neon-mechanics)',
    'var(--neon-mechanics)',
    'var(--neon-mechanics)',
    'var(--neon-mechanics)',
    'var(--neon-mechanics)',
    'var(--neon-mechanics)',
    'var(--neon-mechanics)',
    'var(--neon-waves)',
    'var(--neon-waves)',
    'var(--neon-waves)',
    'var(--neon-thermo)',
    'var(--neon-em)',
    'var(--neon-em)',
    'var(--neon-em)',
    'var(--neon-em)',
    'var(--neon-em)',
    'var(--neon-optics)',
    'var(--neon-modern)',
    'var(--neon-modern)',
    'var(--neon-modern)',
    'var(--neon-em)',       // ch21 semiconductor
    'var(--neon-modern)',   // ch22 communication
  ];

  let html = '';

  chapters.forEach((chapter, idx) => {
    const topics = chapter.topics || [];
    const topicCount = topics.length;
    const completedCount = topics.filter((t) => {
      const slug = t.slug || t.id;
      return completedSet.has(slug) || completedSet.has(t.id);
    }).length;
    const progressPct = topicCount > 0 ? Math.round((completedCount / topicCount) * 100) : 0;

    // Link to first topic page
    const firstTopic = topics[0];
    const href = firstTopic ? `topics/${firstTopic.slug || firstTopic.id}.html` : '#';
    const chapterIcon = chapter.icon || '📖';
    const chapterNum = (chapter.id ?? idx) + 1;
    const accent = accentColors[idx] || 'var(--accent)';

    html += `
      <a href="${href}" class="card chapter-card" style="--accent: ${accent};">
        <div class="chapter-card__number">${chapterIcon}</div>
        <div class="chapter-card__number" style="font-size: var(--fs-sm); opacity: 0.5;">Chapter ${chapterNum}</div>
        <div class="chapter-card__title">${escapeHtml(chapter.title)}</div>
        <div class="chapter-card__topics">${topicCount} topic${topicCount !== 1 ? 's' : ''}${completedCount > 0 ? ' &middot; ' + completedCount + ' done' : ''}</div>
        <div class="chapter-card__progress">
          <div class="chapter-card__progress-bar" style="width: ${progressPct}%"></div>
        </div>
      </a>
    `;
  });

  grid.innerHTML = html;
}

// ── Helpers ──────────────────────────────────────────────────────────

function updateHeaderBadges() {
  const stats = getStats();
  const xpEl = document.getElementById('header-xp');
  const levelEl = document.getElementById('header-level');
  if (xpEl) xpEl.textContent = `${stats.xp.toLocaleString()} XP`;
  if (levelEl) levelEl.textContent = `${stats.level.icon} ${stats.level.name}`;
}

