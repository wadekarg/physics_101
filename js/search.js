// search.js — Topic search for Physics 101
// Filters topics by name from the chapters array, shows dropdown results,
// and navigates to the selected topic.

let allTopics = []; // flat list: { slug, title, chapterTitle }
let searchInput = null;
let dropdownEl = null;
let selectedIndex = -1;

/**
 * Initialise the search widget.
 * @param {Array} chapters — chapters array from chapters.json
 */
export function initSearch(chapters) {
  // Flatten all topics for easy searching
  allTopics = [];
  chapters.forEach((chapter) => {
    (chapter.topics || []).forEach((topic) => {
      allTopics.push({
        slug: topic.slug || topic.id,
        title: topic.title,
        chapterTitle: chapter.title,
        chapterIcon: chapter.icon || '\uD83D\uDCD6',
      });
    });
  });

  searchInput = document.getElementById('search-input');
  if (!searchInput) return;

  // Create dropdown container if not already present
  dropdownEl = document.getElementById('search-dropdown');
  if (!dropdownEl) {
    dropdownEl = document.createElement('div');
    dropdownEl.id = 'search-dropdown';
    dropdownEl.className = 'search-dropdown';
    searchInput.parentElement.appendChild(dropdownEl);
    // Make parent position relative so dropdown can be absolute
    searchInput.parentElement.style.position = 'relative';
  }

  // Event listeners
  searchInput.addEventListener('input', onInput);
  searchInput.addEventListener('keydown', onKeydown);
  searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim().length > 0) {
      showResults(filterTopics(searchInput.value.trim()));
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !dropdownEl.contains(e.target)) {
      hideResults();
    }
  });
}

// ── internal helpers ────────────────────────────────────────────────

function filterTopics(query) {
  const q = query.toLowerCase();
  return allTopics.filter((t) => {
    return (
      t.title.toLowerCase().includes(q) ||
      t.chapterTitle.toLowerCase().includes(q)
    );
  });
}

function onInput() {
  const query = searchInput.value.trim();
  selectedIndex = -1;

  if (query.length === 0) {
    hideResults();
    return;
  }

  const results = filterTopics(query);
  showResults(results);
}

function onKeydown(e) {
  const items = dropdownEl.querySelectorAll('.search-result');
  if (items.length === 0) return;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
    updateHighlight(items);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    selectedIndex = Math.max(selectedIndex - 1, 0);
    updateHighlight(items);
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (selectedIndex >= 0 && selectedIndex < items.length) {
      items[selectedIndex].click();
    }
  } else if (e.key === 'Escape') {
    hideResults();
    searchInput.blur();
  }
}

function updateHighlight(items) {
  items.forEach((item, i) => {
    item.classList.toggle('highlighted', i === selectedIndex);
  });

  // Scroll the highlighted item into view within the dropdown
  if (selectedIndex >= 0 && items[selectedIndex]) {
    items[selectedIndex].scrollIntoView({ block: 'nearest' });
  }
}

function showResults(results) {
  if (results.length === 0) {
    dropdownEl.innerHTML = '<div class="search-empty">No topics found</div>';
    dropdownEl.classList.add('visible');
    return;
  }

  const query = searchInput.value.trim().toLowerCase();

  let html = '';
  results.forEach((topic) => {
    const highlighted = highlightMatch(topic.title, query);
    const isTopicPage = window.location.pathname.includes('/topics/');
    const topicHref = isTopicPage ? `${topic.slug}.html` : `topics/${topic.slug}.html`;
    html += `<a class="search-result" href="${topicHref}" data-slug="${topic.slug}">`;
    html += `  <span class="result-icon">${topic.chapterIcon}</span>`;
    html += `  <span class="result-info">`;
    html += `    <span class="result-title">${highlighted}</span>`;
    html += `    <span class="result-chapter">${escapeHtml(topic.chapterTitle)}</span>`;
    html += `  </span>`;
    html += `</a>`;
  });

  dropdownEl.innerHTML = html;
  dropdownEl.classList.add('visible');

  // Click handlers
  dropdownEl.querySelectorAll('.search-result').forEach((link) => {
    link.addEventListener('click', () => {
      hideResults();
      searchInput.value = '';
    });
  });
}

function hideResults() {
  dropdownEl.innerHTML = '';
  dropdownEl.classList.remove('visible');
  selectedIndex = -1;
}

function highlightMatch(text, query) {
  if (!query) return escapeHtml(text);
  const idx = text.toLowerCase().indexOf(query);
  if (idx === -1) return escapeHtml(text);

  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + query.length);
  const after = text.slice(idx + query.length);
  return escapeHtml(before) + '<mark>' + escapeHtml(match) + '</mark>' + escapeHtml(after);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
