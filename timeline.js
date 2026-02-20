const graphData = {
  orientation: 'left_to_right',
  x_axis: 'year',
  y_bands: {
    1: 'Individual',
    2: 'Organization',
    3: 'Product',
    4: 'System'
  },
  nodes: [
    { id: 'ROOT_01', year: 1948, band: 4, branch: 'Root', type: 'standard', edges: [] },
    { id: 'BRANCH_A_01', year: 1950, band: 1, branch: 'A', type: 'standard', edges: ['ROOT_01'] },
    { id: 'BRANCH_A_02', year: 1962, band: 2, branch: 'A', type: 'standard', edges: ['BRANCH_A_01'] },
    { id: 'BRANCH_A_03', year: 1970, band: 4, branch: 'A', type: 'standard', edges: ['BRANCH_A_02'] },
    { id: 'BRANCH_B_01', year: 1989, band: 2, branch: 'B', type: 'standard', edges: ['ROOT_01'] },
    { id: 'BRANCH_B_02', year: 1998, band: 3, branch: 'B', type: 'standard', edges: ['BRANCH_B_01'] },
    { id: 'BRANCH_B_03', year: 2004, band: 4, branch: 'B', type: 'standard', edges: ['BRANCH_B_02'] },
    { id: 'BRANCH_C_01', year: 2015, band: 3, branch: 'C', type: 'standard', edges: ['BRANCH_B_03'] },
    { id: 'BRANCH_C_02', year: 2020, band: 2, branch: 'C', type: 'standard', edges: ['BRANCH_C_01'] },
    { id: 'BRANCH_C_03', year: 2023, band: 4, branch: 'C', type: 'standard', edges: ['BRANCH_C_02'] },
    { id: 'HYBRID_01', year: 2024, band: 4, branch: 'Hybrid', type: 'hybrid', edges: ['BRANCH_A_03', 'BRANCH_B_03', 'BRANCH_C_03'] },
    { id: 'HYBRID_02', year: 2025, band: 4, branch: 'Hybrid', type: 'hybrid', edges: ['HYBRID_01'] }
  ]
};

const svg = document.getElementById('timeline');
const NS = 'http://www.w3.org/2000/svg';
const width = 1200;
const height = 700;
const margin = { top: 60, right: 40, bottom: 70, left: 140 };

const minYear = Math.min(...graphData.nodes.map((n) => n.year));
const maxYear = Math.max(...graphData.nodes.map((n) => n.year));

const xForYear = (year) => {
  const span = maxYear - minYear || 1;
  return margin.left + ((year - minYear) / span) * (width - margin.left - margin.right);
};

const yForBand = (band) => {
  const bands = Object.keys(graphData.y_bands).map(Number).sort((a, b) => a - b);
  const idx = bands.indexOf(band);
  const step = (height - margin.top - margin.bottom) / (bands.length - 1 || 1);
  return margin.top + idx * step;
};

const colorForBranch = (node) => {
  if (node.type === 'hybrid') return getCss('--hybrid');
  if (node.branch === 'Root') return getCss('--root');
  if (node.branch === 'A') return getCss('--a');
  if (node.branch === 'B') return getCss('--b');
  if (node.branch === 'C') return getCss('--c');
  return '#ddd';
};

function getCss(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function addSvg(tag, attrs) {
  const el = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, String(v)));
  svg.appendChild(el);
  return el;
}

const nodeById = new Map(graphData.nodes.map((n) => [n.id, n]));

Object.entries(graphData.y_bands).forEach(([band, label]) => {
  const y = yForBand(Number(band));
  addSvg('line', { x1: margin.left, y1: y, x2: width - margin.right, y2: y, class: 'band-line' });
  const t = addSvg('text', { x: margin.left - 14, y: y + 4, 'text-anchor': 'end', class: 'band-label' });
  t.textContent = label;
});

const tickStep = 5;
for (let year = minYear; year <= maxYear; year += tickStep) {
  const x = xForYear(year);
  addSvg('line', { x1: x, y1: margin.top, x2: x, y2: height - margin.bottom, class: 'year-line' });
  const t = addSvg('text', { x, y: height - margin.bottom + 24, 'text-anchor': 'middle', class: 'year-tick' });
  t.textContent = String(year);
}

addSvg('line', {
  x1: margin.left,
  y1: height - margin.bottom,
  x2: width - margin.right,
  y2: height - margin.bottom,
  class: 'band-line'
});

const axisLabel = addSvg('text', {
  x: (margin.left + width - margin.right) / 2,
  y: height - 18,
  'text-anchor': 'middle',
  class: 'axis-label'
});
axisLabel.textContent = graphData.x_axis.toUpperCase();

for (const node of graphData.nodes) {
  const x2 = xForYear(node.year);
  const y2 = yForBand(node.band);

  for (const sourceId of node.edges) {
    const source = nodeById.get(sourceId);
    if (!source) continue;

    const x1 = xForYear(source.year);
    const y1 = yForBand(source.band);
    const curve = Math.max(20, Math.abs(x2 - x1) * 0.35);

    const path = addSvg('path', {
      d: `M ${x1} ${y1} C ${x1 + curve} ${y1}, ${x2 - curve} ${y2}, ${x2} ${y2}`,
      class: `edge ${node.type === 'hybrid' || source.type === 'hybrid' ? 'hybrid' : ''}`
    });
    if (node.type === 'hybrid') {
      path.setAttribute('marker-end', 'url(#arrow)');
    }
  }
}

const defs = addSvg('defs', {});
const marker = document.createElementNS(NS, 'marker');
marker.setAttribute('id', 'arrow');
marker.setAttribute('viewBox', '0 0 10 10');
marker.setAttribute('refX', '9');
marker.setAttribute('refY', '5');
marker.setAttribute('markerWidth', '6');
marker.setAttribute('markerHeight', '6');
marker.setAttribute('orient', 'auto-start-reverse');
const arrowPath = document.createElementNS(NS, 'path');
arrowPath.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
arrowPath.setAttribute('fill', getCss('--hybrid-edge'));
marker.appendChild(arrowPath);
defs.appendChild(marker);

for (const node of graphData.nodes) {
  const x = xForYear(node.year);
  const y = yForBand(node.band);

  addSvg('circle', {
    cx: x,
    cy: y,
    r: node.type === 'hybrid' ? 10 : 8,
    fill: colorForBranch(node),
    class: 'node'
  });

  const label = addSvg('text', {
    x: x + 10,
    y: y - 10,
    class: 'node-label'
  });
  label.textContent = node.id;
}
