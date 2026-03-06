// app.js — Main application entry point for Quantum Playground
// Loaded as type="module" by every HTML page (index.html and topics/*.html).
// Fetches chapters.json, initialises all modules, and renders the landing page
// or wires up topic-page navigation depending on which page we're on.

import { initTheme } from './theme.js';
import { initNav, setActiveTopic } from './nav.js';
import { initSearch } from './search.js';
import { initProgress, getStats, getLevel, getProgress } from './progress.js';
import { initAchievements } from './achievements.js';
import { SimEngine } from './sim-engine.js';
import { renderSimControls } from './sim-controls.js';
import { renderQuiz } from './quiz.js';
import { renderFunFacts } from './fun-facts.js';
import { RealtimeGraph } from './graph.js';

// ── Determine data path (root vs topics/ subdirectory) ──────────────
const isTopicPage = window.location.pathname.includes('/topics/');
const dataPath = isTopicPage ? '../data/chapters.json' : 'data/chapters.json';

// ── Boot ─────────────────────────────────────────────────────────────

(async function boot() {
  // 1. Theme (no dependency on data)
  initTheme();

  // 2. Progress system (localStorage-only, no fetch needed)
  initProgress();

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
  } else if (document.getElementById('chapters-grid')) {
    // ── Landing page ────────────────────────────────────────────
    renderStatsBar();
    renderLevelDisplay();
    renderChapterCards(chapters);
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
  };
})();

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

  // Re-render whenever XP changes
  document.addEventListener('qp:xp', () => {
    renderStatsBar();
  });
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

  // Re-render on XP change
  document.addEventListener('qp:xp', () => {
    renderLevelDisplay();
  });
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
    const chapterIcon = chapter.icon || '\uD83D\uDCD6';
    const chapterNum = chapter.id || idx + 1;
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

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
