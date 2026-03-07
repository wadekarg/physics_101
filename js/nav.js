// nav.js — Sidebar navigation for Quantum Playground
// Renders collapsible chapters with topic links, highlights the current topic,
// and handles mobile sidebar toggle.

import { getProgress } from './progress.js';

let chaptersCache = [];
let activeSlug = null;
let sidebarEl = null;

/**
 * Initialise the sidebar navigation.
 * @param {Array} chapters — array of chapter objects from chapters.json
 *   Each chapter: { id, title, icon, topics: [{ id, slug, title }, ...] }
 */
export function initNav(chapters) {
  chaptersCache = chapters;
  sidebarEl = document.getElementById('sidebar');
  if (!sidebarEl) return;

  renderSidebar();

  // Update checkmark when a topic is completed
  document.addEventListener('qp:topic-complete', (e) => {
    updateTopicCheckmark(e.detail.topicId);
  });

  // Close sidebar on overlay click (mobile)
  const overlay = document.getElementById('sidebar-overlay');
  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }

  // Bind hamburger / mobile toggle
  document.querySelectorAll('[data-action="toggle-sidebar"]').forEach((btn) => {
    btn.addEventListener('click', toggleSidebar);
  });
}

/**
 * Highlight the topic that matches the given slug and expand its parent chapter.
 * @param {string} slug
 */
export function setActiveTopic(slug) {
  activeSlug = slug;
  if (!sidebarEl) return;

  // Remove previous active class
  sidebarEl.querySelectorAll('.nav-topic.active').forEach((el) => {
    el.classList.remove('active');
  });

  // Add active class to the matching link
  const link = sidebarEl.querySelector(`.nav-topic[data-slug="${slug}"]`);
  if (link) {
    link.classList.add('active');

    // Make sure the parent chapter is expanded
    const chapterGroup = link.closest('.nav-chapter');
    if (chapterGroup) {
      chapterGroup.classList.add('expanded');
    }
  }
}

/**
 * Toggle the sidebar open/closed (for mobile).
 */
export function toggleSidebar() {
  if (!sidebarEl) return;
  const isOpen = sidebarEl.classList.toggle('open');
  const overlay = document.getElementById('sidebar-overlay');
  if (overlay) {
    overlay.classList.toggle('visible', isOpen);
  }
  document.body.classList.toggle('sidebar-open', isOpen);
}

// ── internal helpers ────────────────────────────────────────────────

function closeSidebar() {
  if (!sidebarEl) return;
  sidebarEl.classList.remove('open');
  const overlay = document.getElementById('sidebar-overlay');
  if (overlay) overlay.classList.remove('visible');
  document.body.classList.remove('sidebar-open');
}

function renderSidebar() {
  const listEl = sidebarEl.querySelector('.nav-list') || sidebarEl;
  const { completedTopics = [] } = getProgress();
  const completedSet = new Set(completedTopics);

  // Build HTML
  let html = '';
  chaptersCache.forEach((chapter) => {
    const chapterIcon = chapter.icon || '\uD83D\uDCD6';
    const topics = chapter.topics || [];
    const allDone = topics.length > 0 && topics.every((t) => completedSet.has(t.slug || t.id));
    html += `<div class="nav-chapter${allDone ? ' nav-chapter--complete' : ''}" data-chapter="${chapter.id}">`;
    html += `  <button class="nav-chapter-toggle" aria-expanded="false">`;
    html += `    <span class="chapter-icon">${chapterIcon}</span>`;
    html += `    <span class="chapter-title">${escapeHtml(chapter.title)}</span>`;
    html += `    <span class="chapter-complete-badge" title="Chapter complete">✓</span>`;
    html += `    <span class="chapter-arrow">\u25B6</span>`;
    html += `  </button>`;
    html += `  <ul class="nav-topics">`;

    topics.forEach((topic) => {
      const slug = topic.slug || topic.id;
      const activeClass = slug === activeSlug ? ' active' : '';
      const doneClass = completedSet.has(slug) ? ' completed' : '';
      const isTopicPage = window.location.pathname.includes('/topics/');
      const topicHref = isTopicPage ? `${slug}.html` : `topics/${slug}.html`;
      html += `<li>`;
      html += `  <a class="nav-topic${activeClass}${doneClass}" data-slug="${slug}" href="${topicHref}">`;
      html += `    <span class="topic-title">${escapeHtml(topic.title)}</span>`;
      html += `    <span class="topic-check" aria-hidden="true">✓</span>`;
      html += `  </a>`;
      html += `</li>`;
    });

    html += `  </ul>`;
    html += `</div>`;
  });

  listEl.innerHTML = html;

  // Attach toggle handlers to chapter headers
  listEl.querySelectorAll('.nav-chapter-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const chapterEl = btn.closest('.nav-chapter');
      const expanding = !chapterEl.classList.contains('expanded');
      chapterEl.classList.toggle('expanded', expanding);
      btn.setAttribute('aria-expanded', String(expanding));
    });
  });

  // Attach click handlers to topic links (close sidebar on mobile after nav)
  listEl.querySelectorAll('.nav-topic').forEach((link) => {
    link.addEventListener('click', () => {
      // On small screens, close the sidebar after picking a topic
      if (window.innerWidth < 768) {
        closeSidebar();
      }
    });
  });
}

function updateTopicCheckmark(slug) {
  if (!sidebarEl) return;
  const link = sidebarEl.querySelector(`.nav-topic[data-slug="${slug}"]`);
  if (!link) return;
  link.classList.add('completed');

  // Mark chapter complete if every topic in it is now done
  const chapterEl = link.closest('.nav-chapter');
  if (!chapterEl) return;
  const allDone = [...chapterEl.querySelectorAll('.nav-topic')].every((l) =>
    l.classList.contains('completed')
  );
  if (allDone) chapterEl.classList.add('nav-chapter--complete');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
