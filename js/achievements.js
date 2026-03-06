// achievements.js — Achievement / badge system for Quantum Playground
// Loads definitions from achievements.json, checks conditions after
// XP / topic / quiz events, and shows a toast notification on unlock.

import { getProgress } from './progress.js';

let definitions = []; // loaded from achievements.json

/**
 * Initialise the achievement system.
 * Fetches achievement definitions and subscribes to progress events.
 */
export async function initAchievements() {
  try {
    const isTopicPage = window.location.pathname.includes('/topics/');
    const achievementsPath = isTopicPage ? '../data/achievements.json' : 'data/achievements.json';
    const res = await fetch(achievementsPath);
    if (!res.ok) throw new Error('Failed to load achievements.json');
    const data = await res.json();
    definitions = Array.isArray(data) ? data : (data.achievements || []);
  } catch (err) {
    console.warn('[achievements] Could not load definitions:', err);
    definitions = getDefaultDefinitions();
  }

  // Ensure the toast container exists in the DOM
  ensureToastContainer();

  // Listen for progress events and check achievements
  document.addEventListener('qp:xp', () => checkAchievements());
  document.addEventListener('qp:topic-complete', () => checkAchievements());
  document.addEventListener('qp:quiz-complete', () => checkAchievements());
  document.addEventListener('qp:streak', () => checkAchievements());

  // Run an initial check in case the user already qualifies
  checkAchievements();
}

/**
 * Evaluate every achievement definition against current progress.
 * Newly-unlocked achievements are saved and a toast is shown.
 */
export function checkAchievements() {
  const progress = getProgress();
  const unlocked = progress.achievements || [];

  definitions.forEach((ach) => {
    if (unlocked.includes(ach.id)) return; // already earned

    if (evaluateCondition(ach, progress)) {
      unlock(ach, progress);
    }
  });
}

/**
 * Display a toast notification for an achievement.
 * @param {{ id: string, title: string, description: string, icon: string }} achievement
 */
export function showAchievementToast(achievement) {
  const container = document.getElementById('achievement-toasts');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'achievement-toast';

  const achTitle = achievement.title || achievement.name || 'Achievement';
  toast.innerHTML = `
    <div class="achievement-toast-icon">${achievement.icon || '\uD83C\uDFC6'}</div>
    <div class="achievement-toast-body">
      <div class="achievement-toast-label">Achievement Unlocked!</div>
      <div class="achievement-toast-title">${escapeHtml(achTitle)}</div>
      <div class="achievement-toast-desc">${escapeHtml(achievement.description)}</div>
    </div>
  `;

  container.appendChild(toast);

  // Trigger reflow so the CSS transition kicks in
  requestAnimationFrame(() => {
    toast.classList.add('visible');
  });

  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    toast.classList.remove('visible');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    // Fallback removal if transitionend never fires
    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 600);
  }, 5000);
}

// ── internal helpers ────────────────────────────────────────────────

function unlock(achievement, progress) {
  // Persist to progress store
  progress.achievements.push(achievement.id);
  // We write directly to localStorage because progress.js exposes getProgress
  // as a read snapshot. We need to keep achievements in sync.
  const raw = localStorage.getItem('qp-progress');
  if (raw) {
    try {
      const stored = JSON.parse(raw);
      stored.achievements = stored.achievements || [];
      if (!stored.achievements.includes(achievement.id)) {
        stored.achievements.push(achievement.id);
      }
      localStorage.setItem('qp-progress', JSON.stringify(stored));
    } catch { /* ignore */ }
  }

  showAchievementToast(achievement);
}

function evaluateCondition(ach, progress) {
  const cond = ach.condition;
  if (!cond) return false;
  const val = cond.value ?? cond.count ?? 0;

  switch (cond.type) {
    // JSON format from achievements.json
    case 'topicsCompleted':
      return (progress.completedTopics || []).length >= val;

    case 'quizzesCompleted':
      return (progress.completedQuizzes || []).length >= val;

    case 'xpReached':
      return progress.xp >= val;

    case 'streak':
      return (progress.streak && progress.streak.current >= val);

    case 'chaptersCompleted': {
      const chapterIds = cond.chapters || [];
      return chapterIds.every((chId) => {
        // Check all topics in that chapter are completed
        const chapter = (window.QP?.chapters || []).find((c) => c.id === chId || c.id === `ch${chId}`);
        if (!chapter) return false;
        return (chapter.topics || []).every((t) => {
          const slug = t.slug || t.id;
          return (progress.completedTopics || []).includes(slug);
        });
      });
    }

    case 'special':
      return (progress.specialAchievements || []).includes(cond.key);

    // Fallback format used by getDefaultDefinitions()
    case 'xp_gte':
      return progress.xp >= val;

    case 'topics_completed_gte':
      return (progress.completedTopics || []).length >= val;

    case 'quizzes_completed_gte':
      return (progress.completedQuizzes || []).length >= val;

    case 'streak_gte':
      return (progress.streak && progress.streak.current >= val);

    case 'level_gte': {
      const levelOrder = [
        'Physics Rookie', 'Apprentice', 'Scholar', 'Master', 'Quantum Wizard',
      ];
      const currentIdx = levelOrder.indexOf(currentLevelName(progress.xp));
      const requiredIdx = levelOrder.indexOf(cond.value);
      return requiredIdx >= 0 && currentIdx >= requiredIdx;
    }

    default:
      return false;
  }
}

function currentLevelName(xp) {
  const levels = [
    { name: 'Physics Rookie', min: 0 },
    { name: 'Apprentice', min: 500 },
    { name: 'Scholar', min: 1500 },
    { name: 'Master', min: 3000 },
    { name: 'Quantum Wizard', min: 5000 },
  ];
  let name = levels[0].name;
  for (const l of levels) {
    if (xp >= l.min) name = l.name;
  }
  return name;
}

function ensureToastContainer() {
  if (document.getElementById('achievement-toasts')) return;
  const container = document.createElement('div');
  container.id = 'achievement-toasts';
  container.className = 'achievement-toasts';
  document.body.appendChild(container);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Fallback definitions if achievements.json can't be loaded.
 */
function getDefaultDefinitions() {
  return [
    {
      id: 'first-topic',
      title: 'First Steps',
      description: 'Complete your first topic.',
      icon: '\uD83D\uDC63',
      condition: { type: 'topics_completed_gte', value: 1 },
    },
    {
      id: 'five-topics',
      title: 'Curious Mind',
      description: 'Complete 5 topics.',
      icon: '\uD83E\uDDE0',
      condition: { type: 'topics_completed_gte', value: 5 },
    },
    {
      id: 'first-quiz',
      title: 'Quiz Taker',
      description: 'Complete your first quiz.',
      icon: '\u2753',
      condition: { type: 'quizzes_completed_gte', value: 1 },
    },
    {
      id: 'xp-500',
      title: 'Apprentice Achieved',
      description: 'Reach 500 XP and become an Apprentice.',
      icon: '\u2697\uFE0F',
      condition: { type: 'xp_gte', value: 500 },
    },
    {
      id: 'xp-1500',
      title: 'Scholar Status',
      description: 'Reach 1500 XP.',
      icon: '\uD83D\uDCDA',
      condition: { type: 'xp_gte', value: 1500 },
    },
    {
      id: 'streak-3',
      title: 'Three-Day Streak',
      description: 'Visit 3 days in a row.',
      icon: '\uD83D\uDD25',
      condition: { type: 'streak_gte', value: 3 },
    },
    {
      id: 'streak-7',
      title: 'Week Warrior',
      description: 'Visit 7 days in a row.',
      icon: '\uD83D\uDCAA',
      condition: { type: 'streak_gte', value: 7 },
    },
    {
      id: 'ten-topics',
      title: 'Dedicated Learner',
      description: 'Complete 10 topics.',
      icon: '\uD83C\uDF1F',
      condition: { type: 'topics_completed_gte', value: 10 },
    },
    {
      id: 'xp-5000',
      title: 'Quantum Wizard',
      description: 'Reach 5000 XP and achieve the highest rank.',
      icon: '\uD83E\uDDD9',
      condition: { type: 'xp_gte', value: 5000 },
    },
  ];
}
