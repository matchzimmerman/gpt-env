async function loadGlossary() {
  const res = await fetch('glossary.json');
  const data = await res.json();
  return data;
}

function createItem(entry) {
  const li = document.createElement('li');
  li.className = 'glossary-item';

  const term = document.createElement('div');
  const icon = document.createElement('span');
  icon.className = 'icon';
  icon.textContent = '\u25B6'; // triangle pointing right

  term.textContent = entry.term;
  term.appendChild(icon);
  term.className = 'term';
  term.addEventListener('click', () => {
    li.classList.toggle('open');
    icon.textContent = li.classList.contains('open') ? '\u25BC' : '\u25B6';
  });

  const def = document.createElement('div');
  def.textContent = entry.definition;
  def.className = 'definition';

  li.appendChild(term);
  li.appendChild(def);
  return li;
}

function filterList(list, query) {
  const items = list.querySelectorAll('.glossary-item');
  items.forEach(item => {
    const term = item.querySelector('.term').textContent.toLowerCase();
    item.style.display = term.includes(query) ? '' : 'none';
  });
}

window.addEventListener('DOMContentLoaded', async () => {
  const list = document.getElementById('glossary-list');
  const search = document.getElementById('search');
  const entries = await loadGlossary();
  entries.forEach(e => list.appendChild(createItem(e)));
  search.addEventListener("input", () => filterList(list, search.value.toLowerCase()));
});
