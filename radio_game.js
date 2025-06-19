const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const tileSize = 32;

// simple 2x2 map
const maps = [
  [
    [
      [1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0],
      [1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,1],
      [1,1,1,0,0,1,1,1,1,1]
    ],
    [
      [1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,1],
      [0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,0,0,1,1,1]
    ]
  ],
  [
    [
      [1,1,1,0,0,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0],
      [1,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1]
    ],
    [
      [1,1,1,1,1,0,0,1,1,1],
      [1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,1],
      [0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1]
    ]
  ]
];

const inventory = { antenna: false, circuit: false, casing: false };
const items = [
  { sx:0, sy:0, x:5*tileSize, y:4*tileSize, name:'antenna' },
  { sx:1, sy:0, x:6*tileSize, y:6*tileSize, name:'circuit' },
  { sx:0, sy:1, x:2*tileSize, y:2*tileSize, name:'casing' }
];

let mapX = 0;
let mapY = 0;
const player = { x: tileSize*2, y: tileSize*2, w: 28, h: 28, vx:0, vy:0 };

const keys = {};

window.addEventListener('keydown', e => {
  if (e.key === 'i') {
    toggleInventory();
    return;
  }
  keys[e.key] = true;
});
window.addEventListener('keyup', e => {
  keys[e.key] = false;
});

function drawMap() {
  const map = maps[mapY][mapX];
  for (let y=0; y<map.length; y++) {
    for (let x=0; x<map[y].length; x++) {
      const tile = map[y][x];
      ctx.fillStyle = tile ? '#666' : '#004400';
      ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
    }
  }
}

function drawItems() {
  for (const item of items) {
    if (item.collected) continue;
    if (item.sx === mapX && item.sy === mapY) {
      ctx.fillStyle = '#ffff00';
      ctx.fillRect(item.x, item.y, tileSize, tileSize);
    }
  }
}

function drawPlayer() {
  ctx.fillStyle = '#55aaff';
  ctx.fillRect(player.x, player.y, player.w, player.h);
}

function collectItems() {
  for (const item of items) {
    if (item.collected) continue;
    if (item.sx === mapX && item.sy === mapY) {
      if (player.x < item.x + tileSize && player.x + player.w > item.x &&
          player.y < item.y + tileSize && player.y + player.h > item.y) {
        item.collected = true;
        inventory[item.name] = true;
      }
    }
  }
}

function movePlayer() {
  if (keys['ArrowLeft']) player.vx = -2;
  else if (keys['ArrowRight']) player.vx = 2;
  else player.vx = 0;

  if (keys['ArrowUp']) player.vy = -2;
  else if (keys['ArrowDown']) player.vy = 2;
  else player.vy = 0;

  let nx = player.x + player.vx;
  let ny = player.y + player.vy;

  const map = maps[mapY][mapX];
  const cw = canvas.width;
  const ch = canvas.height;

  // screen transition
  if (nx < 0) {
    const row = Math.floor((player.y+player.h/2)/tileSize);
    if (map[row][0] === 0 && mapX > 0) {
      mapX--; nx = cw - tileSize;
    } else { nx = 0; }
  } else if (nx + player.w > cw) {
    const row = Math.floor((player.y+player.h/2)/tileSize);
    if (map[row][map[0].length-1] === 0 && mapX < maps[0].length-1) {
      mapX++; nx = 0;
    } else { nx = cw - player.w; }
  }
  if (ny < 0) {
    const col = Math.floor((player.x+player.w/2)/tileSize);
    if (map[0][col] === 0 && mapY > 0) {
      mapY--; ny = ch - tileSize;
    } else { ny = 0; }
  } else if (ny + player.h > ch) {
    const col = Math.floor((player.x+player.w/2)/tileSize);
    if (map[map.length-1][col] === 0 && mapY < maps.length-1) {
      mapY++; ny = 0;
    } else { ny = ch - player.h; }
  }

  // collision with walls
  const tl = getTile(nx, ny);
  const tr = getTile(nx + player.w - 1, ny);
  const bl = getTile(nx, ny + player.h -1);
  const br = getTile(nx + player.w -1, ny + player.h -1);
  if (tl||tr||bl||br) return;

  player.x = nx;
  player.y = ny;
}

function getTile(px, py) {
  const map = maps[mapY][mapX];
  const col = Math.floor(px / tileSize);
  const row = Math.floor(py / tileSize);
  if (row<0||row>=map.length||col<0||col>=map[0].length) return 1;
  return map[row][col];
}

const invBox = document.getElementById('inventory');
let invOpen = false;
function toggleInventory() {
  invOpen = !invOpen;
  if (invOpen) {
    drawInventory();
    invBox.style.display = 'block';
  } else {
    invBox.style.display = 'none';
  }
}

function drawInventory() {
  let text = 'INVENTORY\n';
  for (const [k,v] of Object.entries(inventory)) {
    text += `${k}: ${v? '✔':'--'}\n`;
  }
  if (Object.values(inventory).every(v=>v)) text += 'Transmitter built!';
  invBox.textContent = text;
}

function gameLoop() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawMap();
  drawItems();
  movePlayer();
  collectItems();
  drawPlayer();
  if (invOpen) drawInventory();
  requestAnimationFrame(gameLoop);
}

gameLoop();
