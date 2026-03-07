// concept-connections.js — Prerequisite / leads-to / related topic links

/**
 * Render concept connection chips into containerEl.
 * @param {HTMLElement} containerEl
 * @param {Object} extras — topic extras data
 * @param {Array} chapters — full chapters array for title lookup
 */
export function renderConceptConnections(containerEl, extras, chapters) {
  if (!containerEl) return;
  const connections = extras.connections || {};
  const { prerequisites = [], leadsTo = [], related = [] } = connections;

  if (!prerequisites.length) {
    _hideSection(containerEl);
    return;
  }

  // Build slug → title lookup
  const topicMap = {};
  for (const chapter of chapters) {
    for (const topic of chapter.topics || []) {
      const slug = topic.slug || topic.id;
      topicMap[slug] = topic.title || slug;
    }
  }

  const chipsHtml = prerequisites.map((slug) => {
    const title = topicMap[slug] || slug;
    return `<a href="../topics/${_esc(slug)}.html" class="connection-chip">${_esc(title)}</a>`;
  }).join('');

  containerEl.innerHTML = `
    <div class="concept-connections">
      <div class="connection-row">
        <div class="connection-row__label">Prerequisites</div>
        <div class="connection-row__chips">${chipsHtml}</div>
      </div>
    </div>
  `;
}

// ── helpers ──────────────────────────────────────────────────────────

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
