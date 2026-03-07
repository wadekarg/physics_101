// concept-connections.js — Prerequisite / leads-to / related topic links

import { escapeHtml as _esc, hideSection } from './utils.js';

/**
 * Render concept connection chips into containerEl.
 * @param {HTMLElement} containerEl
 * @param {Object} extras — topic extras data
 * @param {Array} chapters — full chapters array for title lookup
 */
export function renderConceptConnections(containerEl, extras, chapters) {
  if (!containerEl) return;
  const connections = extras.connections || {};
  const { prerequisites = [] } = connections;

  if (!prerequisites.length) {
    hideSection(containerEl);
    return;
  }

  // Build slug → title lookup (object index, O(1) per lookup)
  const topicMap = {};
  for (const chapter of chapters) {
    for (const topic of chapter.topics || []) {
      topicMap[topic.slug || topic.id] = topic.title || topic.slug || topic.id;
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
