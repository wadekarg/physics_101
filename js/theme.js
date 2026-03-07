// theme.js — Dark/light theme toggle for Physics 101
// Reads/saves to localStorage key "qp-theme". Default is "light".
// Sets data-theme attribute on <html>.

const STORAGE_KEY = 'qp-theme';
const VERSION_KEY = 'qp-theme-v';
const THEME_VERSION = '2'; // bump when changing the default theme
const DEFAULT_THEME = 'light';

/**
 * Initialise the theme from localStorage (or default to "light").
 * Only respects a saved preference if the user explicitly set it
 * under the current theme version.
 */
export function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  const version = localStorage.getItem(VERSION_KEY);
  // Use saved value only if the user explicitly toggled under the current version
  const theme = (version === THEME_VERSION && (saved === 'light' || saved === 'dark'))
    ? saved
    : DEFAULT_THEME;
  applyTheme(theme);

  // Bind any toggle buttons already in the DOM
  document.querySelectorAll('[data-action="toggle-theme"]').forEach((btn) => {
    btn.addEventListener('click', toggleTheme);
  });
}

/**
 * Toggle between "dark" and "light" themes.
 * Persists the choice and marks it as user-set.
 */
export function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || DEFAULT_THEME;
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem(STORAGE_KEY, next);
  localStorage.setItem(VERSION_KEY, THEME_VERSION);
}

// ── internal helpers ────────────────────────────────────────────────

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  updateToggleButtons(theme);
}

function updateToggleButtons(theme) {
  const icon = theme === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19';
  const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

  document.querySelectorAll('[data-action="toggle-theme"]').forEach((btn) => {
    btn.setAttribute('aria-label', label);
    btn.title = label;

    const iconEl = btn.querySelector('.theme-icon');
    if (iconEl) {
      iconEl.textContent = icon;
    } else {
      btn.textContent = icon;
    }
  });
}
