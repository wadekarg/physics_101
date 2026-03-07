// utils.js — Shared helper utilities for Physics 101

/** Safely escape a string for use as HTML text content. */
export function escapeHtml(str) {
  if (str == null) return '';
  const d = document.createElement('div');
  d.textContent = String(str);
  return d.innerHTML;
}

/** Escape a string for use in an HTML attribute value (double-quoted). */
export function attrEsc(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

/** Hide the nearest .feature-section ancestor of a container element. */
export function hideSection(containerEl) {
  const section = containerEl ? containerEl.closest('.feature-section') : null;
  if (section) section.style.display = 'none';
}

/** Render all [data-latex] elements inside el using KaTeX (if loaded). */
export function renderKaTeX(el) {
  if (!window.katex || !el) return;
  el.querySelectorAll('[data-latex]').forEach((node) => {
    try {
      const displayMode = !node.classList.contains('katex-inline');
      window.katex.render(node.dataset.latex, node, { displayMode, throwOnError: false });
    } catch (e) { /* silent */ }
  });
}
