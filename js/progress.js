// progress.js — XP, levels, badges, and streaks for Quantum Playground
// All data stored in localStorage under key "qp-progress".

const STORAGE_KEY = 'qp-progress';

const LEVELS = [
  { name: 'Physics Rookie', icon: '\uD83D\uDD30', minXP: 0, maxXP: 499 },
  { name: 'Apprentice', icon: '\u2697\uFE0F', minXP: 500, maxXP: 1499 },
  { name: 'Scholar', icon: '\uD83D\uDCDA', minXP: 1500, maxXP: 2999 },
  { name: 'Master', icon: '\uD83C\uDF93', minXP: 3000, maxXP: 4999 },
  { name: 'Quantum Wizard', icon: '\uD83E\uDDD9', minXP: 5000, maxXP: Infinity },
];

const DEFAULT_PROGRESS = {
  xp: 0,
  completedTopics: [],
  completedQuizzes: [],
  achievements: [],
  streak: { current: 0, lastVisit: null },
  lastVisit: null,
};

// ── public API ──────────────────────────────────────────────────────

/**
 * Initialise the progress system. Loads from localStorage or creates defaults.
 * Also updates the daily streak.
 */
export function initProgress() {
  // Ensure storage exists
  if (!localStorage.getItem(STORAGE_KEY)) {
    save(DEFAULT_PROGRESS);
  }
  updateStreak();
}

/**
 * Return the full progress object (deep copy).
 */
export function getProgress() {
  return load();
}

/**
 * Add XP and persist.  Dispatches a custom "qp:xp" event on document.
 * @param {number} amount
 */
export function addXP(amount) {
  if (typeof amount !== 'number' || amount <= 0) return;

  const progress = load();
  const previousLevel = getLevelForXP(progress.xp).name;

  progress.xp += amount;
  save(progress);

  const newLevel = getLevelForXP(progress.xp).name;

  // Dispatch event so other modules (achievements, UI) can react
  document.dispatchEvent(
    new CustomEvent('qp:xp', {
      detail: { amount, totalXP: progress.xp, levelUp: newLevel !== previousLevel, level: newLevel },
    })
  );
}

/**
 * Mark a topic as completed (idempotent). Awards 50 XP on first completion.
 * @param {string} topicId
 */
export function completeTopic(topicId) {
  const progress = load();
  if (progress.completedTopics.includes(topicId)) return;

  progress.completedTopics.push(topicId);
  save(progress);
  addXP(50);

  document.dispatchEvent(
    new CustomEvent('qp:topic-complete', { detail: { topicId } })
  );
}

/**
 * Mark a quiz as completed for a topic (idempotent). Does NOT award XP here —
 * XP is awarded per-question inside quiz.js.
 * @param {string} topicId
 */
export function completeQuiz(topicId) {
  const progress = load();
  if (!progress.completedQuizzes.includes(topicId)) {
    progress.completedQuizzes.push(topicId);
    save(progress);
    document.dispatchEvent(
      new CustomEvent('qp:quiz-complete', { detail: { topicId } })
    );
  }
  // Also mark the topic as complete so landing-page progress bars update
  completeTopic(topicId);
}

/**
 * Check whether a topic has been completed.
 * @param {string} topicId
 * @returns {boolean}
 */
export function isTopicCompleted(topicId) {
  const progress = load();
  return progress.completedTopics.includes(topicId);
}

/**
 * Get the current level info.
 * @returns {{ name: string, icon: string, xp: number, nextLevelXP: number, progress: number }}
 */
export function getLevel() {
  const progress = load();
  return getLevelForXP(progress.xp);
}

/**
 * Update the daily visit streak.
 * Call once per page load (initProgress does this automatically).
 */
export function updateStreak() {
  const progress = load();
  const today = todayString();

  if (progress.streak.lastVisit === today) {
    // Already visited today — nothing to do
    return;
  }

  if (progress.streak.lastVisit === yesterdayString()) {
    // Consecutive day — increment
    progress.streak.current += 1;
  } else if (progress.streak.lastVisit === null) {
    // First visit ever
    progress.streak.current = 1;
  } else {
    // Streak broken — reset to 1
    progress.streak.current = 1;
  }

  progress.streak.lastVisit = today;
  progress.lastVisit = today;
  save(progress);

  document.dispatchEvent(
    new CustomEvent('qp:streak', { detail: { streak: progress.streak.current } })
  );
}

/**
 * Convenience: return a summary of key stats.
 * @returns {{ xp: number, level: object, topicsCompleted: number, streak: number }}
 */
export function getStats() {
  const progress = load();
  return {
    xp: progress.xp,
    level: getLevelForXP(progress.xp),
    topicsCompleted: progress.completedTopics.length,
    streak: progress.streak.current,
  };
}

// ── internal helpers ────────────────────────────────────────────────

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredCloneShallow(DEFAULT_PROGRESS);
    const parsed = JSON.parse(raw);
    // Merge with defaults to handle any missing keys from older versions
    return Object.assign({}, structuredCloneShallow(DEFAULT_PROGRESS), parsed, {
      streak: Object.assign({}, DEFAULT_PROGRESS.streak, parsed.streak),
    });
  } catch {
    return structuredCloneShallow(DEFAULT_PROGRESS);
  }
}

function save(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function structuredCloneShallow(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function getLevelForXP(xp) {
  let currentLevel = LEVELS[0];
  for (const level of LEVELS) {
    if (xp >= level.minXP) {
      currentLevel = level;
    }
  }

  // Figure out progress toward next level
  const currentIdx = LEVELS.indexOf(currentLevel);
  const nextLevel = LEVELS[currentIdx + 1] || null;
  const nextLevelXP = nextLevel ? nextLevel.minXP : null;
  let progressFraction = 1; // max level
  if (nextLevel) {
    const range = nextLevel.minXP - currentLevel.minXP;
    const earned = xp - currentLevel.minXP;
    progressFraction = range > 0 ? Math.min(earned / range, 1) : 1;
  }

  return {
    name: currentLevel.name,
    icon: currentLevel.icon,
    xp: xp,
    nextLevelXP: nextLevelXP,
    progress: progressFraction,
  };
}

function todayString() {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function yesterdayString() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}
