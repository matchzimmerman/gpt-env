async function loadGlossary() {
  const res = await fetch('glossary.json');
  const data = await res.json();
  return data;
}
function createTermItem(entry) {
  const li = document.createElement('li');
  li.className = 'term-item';

  const header = document.createElement('div');
  header.className = 'term-header';
  header.textContent = entry.term;
  const icon = document.createElement('span');
  icon.className = 'icon';
  icon.textContent = '\u25B6';
  header.appendChild(icon);
  header.addEventListener('click', () => {
    li.classList.toggle('open');
    icon.textContent = li.classList.contains('open') ? '\u25BC' : '\u25B6';
  });

  const details = document.createElement('div');
  details.className = 'term-details';
  details.innerHTML = `
    <p><strong>Definition:</strong> ${entry.definition}</p>
    <p><strong>Behavioral Indicators:</strong> ${entry.behavioral_indicators}</p>
    <p><strong>Common Misinterpretations:</strong> ${entry.misinterpretations}</p>
    <p><strong>Importance:</strong> ${entry.importance}</p>`;

  li.appendChild(header);
  li.appendChild(details);
  return li;
}

function createCategory(name, entries) {
  const wrapper = document.createElement('div');
  wrapper.className = 'category';

  const header = document.createElement('div');
  header.className = 'category-header';
  header.textContent = name;
  const icon = document.createElement('span');
  icon.className = 'icon';
  icon.textContent = '\u25B6';
  header.appendChild(icon);
  header.addEventListener('click', () => {
    wrapper.classList.toggle('open');
    icon.textContent = wrapper.classList.contains('open') ? '\u25BC' : '\u25B6';
  });

  const list = document.createElement('ul');
  list.className = 'term-list';
  entries.forEach(e => list.appendChild(createTermItem(e)));

  wrapper.appendChild(header);
  wrapper.appendChild(list);
  return wrapper;
}

function filterList(list, query) {
  const items = list.querySelectorAll('.term-item');
  items.forEach(item => {
    const term = item.querySelector('.term-header').textContent.toLowerCase();
    item.style.display = term.includes(query) ? '' : 'none';
  });
}

window.addEventListener('DOMContentLoaded', async () => {
  const list = document.getElementById('glossary-list');
  const search = document.getElementById('search');
  const entries = await loadGlossary();
  const categories = {};
  entries.forEach(e => {
    categories[e.category] = categories[e.category] || [];
    categories[e.category].push(e);
  });
  Object.keys(categories).forEach(cat => {
    list.appendChild(createCategory(cat, categories[cat]));
  });
  search.addEventListener('input', () => filterList(list, search.value.toLowerCase()));
});
