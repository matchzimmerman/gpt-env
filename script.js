const moodLevels = [
  'angry', 'upset', 'gloomy', 'meh', 'neutral',
  'okay', 'content', 'cheery', 'happy', 'ecstatic', 'hyper'
];

const profileLevels = [
  'silent', 'quiet', 'reserved', 'shy', 'plain',
  'chatty', 'outgoing', 'energetic', 'boisterous', 'wild', 'extreme'
];

const profileSpeech = [
  'barely mutters',
  'speaks softly',
  'says a few words',
  'quietly responds',
  'says plainly',
  'chatters',
  'talks openly',
  'energetically says',
  'shouts',
  'yells wildly',
  'exclaims loudly'
];

const moodDialog = [
  'grumbles about the situation.',
  'complains in an upset tone.',
  'sighs gloomily.',
  'responds with an uninterested "meh."',
  'states things neutrally.',
  'mentions everything is okay.',
  'talks about feeling content.',
  'cheerfully remarks about the day.',
  'says how happy they are.',
  'bubbles over with ecstatic energy.',
  'speaks with hyper enthusiasm.'
];

function getMoodText(value) {
  return moodLevels[value];
}

function getProfileText(value) {
  return profileLevels[value];
}

function generateLine(name, moodVal, profileVal) {
  const speech = profileSpeech[profileVal];
  const line = moodDialog[moodVal];
  return `${name} ${speech}, "${line}"`;
}

function update() {
  const moodA = parseInt(document.getElementById('moodA').value, 10);
  const moodB = parseInt(document.getElementById('moodB').value, 10);
  const profileA = parseInt(document.getElementById('profileA').value, 10);
  const profileB = parseInt(document.getElementById('profileB').value, 10);

  document.getElementById('lineA').textContent = generateLine('A', moodA, profileA);
  document.getElementById('lineB').textContent = generateLine('B', moodB, profileB);
}

document.querySelectorAll('input[type=range]').forEach(el => {
  el.addEventListener('input', update);
});

update();

// NPC movement and interaction
const arena = document.getElementById('arena');
const npcAEl = document.getElementById('npcA');
const npcBEl = document.getElementById('npcB');
const dialogBox = document.getElementById('dialog');

const npcSize = 40;
const arenaWidth = arena.clientWidth;
const arenaHeight = arena.clientHeight;

const npcA = { x: 50, y: 50, dx: 2, dy: 1.5 };
const npcB = { x: 300, y: 200, dx: -2, dy: 2 };

let lastTalk = 0;

function moveNPC(npc, el) {
  npc.x += npc.dx;
  npc.y += npc.dy;

  if (npc.x <= 0 || npc.x >= arenaWidth - npcSize) npc.dx *= -1;
  if (npc.y <= 0 || npc.y >= arenaHeight - npcSize) npc.dy *= -1;

  el.style.left = npc.x + 'px';
  el.style.top = npc.y + 'px';
}

function areColliding(a, b) {
  return !(
    a.x + npcSize < b.x ||
    a.x > b.x + npcSize ||
    a.y + npcSize < b.y ||
    a.y > b.y + npcSize
  );
}

function talk() {
  update();
  dialogBox.style.display = 'block';
  setTimeout(() => {
    dialogBox.style.display = 'none';
  }, 1500);
}

setInterval(() => {
  moveNPC(npcA, npcAEl);
  moveNPC(npcB, npcBEl);

  if (areColliding(npcA, npcB) && Date.now() - lastTalk > 2000) {
    talk();
    lastTalk = Date.now();
  }
}, 30);
