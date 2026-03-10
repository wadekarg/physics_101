// theme.js — Dark/light theme toggle for Physics 101
// Reads/saves to localStorage key "qp-theme". Default is "light".
// Sets data-theme attribute on <html>.

const STORAGE_KEY = 'qp-theme';
const VERSION_KEY = 'qp-theme-v';
const THEME_VERSION = '3'; // bump when changing the default theme
const DEFAULT_THEME = 'dark';

const THEMES = ['dark', 'light', 'aurora'];

// What the button shows (icon for the NEXT theme)
const THEME_META = {
  dark:   { icon: '\u2600\uFE0F',     label: 'Switch to light mode'  },
  light:  { icon: '\uD83C\uDF0C',     label: 'Switch to aurora mode' },
  aurora: { icon: '\uD83C\uDF19',     label: 'Switch to dark mode'   },
};

/**
 * Initialise the theme from localStorage (or default to "dark").
 */
export function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  const version = localStorage.getItem(VERSION_KEY);
  const theme = (version === THEME_VERSION && THEMES.includes(saved))
    ? saved
    : DEFAULT_THEME;
  applyTheme(theme);

  document.querySelectorAll('[data-action="toggle-theme"]').forEach((btn) => {
    btn.addEventListener('click', cycleTheme);
  });
}

/**
 * Cycle dark → light → aurora → dark …
 */
export function cycleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || DEFAULT_THEME;
  const idx = THEMES.indexOf(current);
  const next = THEMES[(idx + 1) % THEMES.length];
  applyTheme(next);
  localStorage.setItem(STORAGE_KEY, next);
  localStorage.setItem(VERSION_KEY, THEME_VERSION);
}

// keep old name as alias so any external callers don't break
export { cycleTheme as toggleTheme };

// ── internal helpers ────────────────────────────────────────────────

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  updateToggleButtons(theme);
}

function updateToggleButtons(theme) {
  const meta = THEME_META[theme] || THEME_META.dark;

  document.querySelectorAll('[data-action="toggle-theme"]').forEach((btn) => {
    btn.setAttribute('aria-label', meta.label);
    btn.title = meta.label;

    const iconEl = btn.querySelector('.theme-icon');
    if (iconEl) {
      iconEl.textContent = meta.icon;
    } else {
      btn.textContent = meta.icon;
    }
  });
}
