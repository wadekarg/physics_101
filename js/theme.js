// theme.js — Dark/light theme toggle for Quantum Playground
// Reads/saves to localStorage key "qp-theme". Default is "dark".
// Sets data-theme attribute on <html>.

const STORAGE_KEY = 'qp-theme';
const DEFAULT_THEME = 'dark';

/**
 * Initialise the theme from localStorage (or default to "dark").
 * Applies the data-theme attribute and updates any toggle button icon.
 */
export function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  const theme = saved === 'light' || saved === 'dark' ? saved : DEFAULT_THEME;
  applyTheme(theme);

  // Bind any toggle buttons already in the DOM
  document.querySelectorAll('[data-action="toggle-theme"]').forEach((btn) => {
    btn.addEventListener('click', toggleTheme);
  });
}

/**
 * Toggle between "dark" and "light" themes.
 * Persists the choice and updates the UI.
 */
export function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || DEFAULT_THEME;
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem(STORAGE_KEY, next);
}

// ── internal helpers ────────────────────────────────────────────────

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEY, theme);
  updateToggleButtons(theme);
}

function updateToggleButtons(theme) {
  const icon = theme === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19';
  const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

  document.querySelectorAll('[data-action="toggle-theme"]').forEach((btn) => {
    btn.setAttribute('aria-label', label);
    btn.title = label;

    // If the button has a dedicated icon span, update it; otherwise set textContent
    const iconEl = btn.querySelector('.theme-icon');
    if (iconEl) {
      iconEl.textContent = icon;
    } else {
      btn.textContent = icon;
    }
  });
}
