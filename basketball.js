const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const PLAYER_WIDTH = 20;
const PLAYER_HEIGHT = 40;
const BALL_RADIUS = 6;

const p1Color = '#ff5555';
const p2Color = '#55aaff';

document.getElementById('score1').style.color = p1Color;
document.getElementById('score2').style.color = p2Color;

document.getElementById('score1').textContent = 0;
document.getElementById('score2').textContent = 0;

let score1 = 0;
let score2 = 0;
let timer = 60; // seconds

document.getElementById('timer').textContent = `${timer}s`;

const player1 = { x: 80, y: canvas.height - PLAYER_HEIGHT - 10, vx: 0 };
const player2 = { x: canvas.width - 100, y: canvas.height - PLAYER_HEIGHT - 10, vx: 0 };

const ball = { x: canvas.width / 2, y: canvas.height / 2, vx: 0, vy: 0, owner: null };

const hoop1 = { x: 40, y: 10, w: 40, h: 10 }; // target for player1
const hoop2 = { x: canvas.width - 80, y: 10, w: 40, h: 10 }; // target for player2

function drawCourt() {
  ctx.fillStyle = '#083c10';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#fff';
  ctx.fillRect(hoop1.x, hoop1.y, hoop1.w, hoop1.h);
  ctx.fillRect(hoop2.x, hoop2.y, hoop2.w, hoop2.h);
}

function drawPlayers() {
  ctx.fillStyle = p1Color;
  ctx.fillRect(player1.x, player1.y, PLAYER_WIDTH, PLAYER_HEIGHT);
  ctx.fillStyle = p2Color;
  ctx.fillRect(player2.x, player2.y, PLAYER_WIDTH, PLAYER_HEIGHT);
}

function drawBall() {
  ctx.fillStyle = '#ffa500';
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
  ctx.fill();
}

function resetBall(scoredBy) {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.vx = 0;
  ball.vy = 0;
  ball.owner = null;
  if (scoredBy === 1) {
    score1++;
    document.getElementById('score1').textContent = score1;
  } else if (scoredBy === 2) {
    score2++;
    document.getElementById('score2').textContent = score2;
  }
}

function updateBall() {
  if (ball.owner) {
    const owner = ball.owner === 1 ? player1 : player2;
    ball.x = owner.x + PLAYER_WIDTH / 2;
    ball.y = owner.y - BALL_RADIUS - 2;
  } else {
    ball.x += ball.vx;
    ball.y += ball.vy;
    ball.vy += 0.2; // gravity
    if (ball.y > canvas.height - BALL_RADIUS) {
      ball.y = canvas.height - BALL_RADIUS;
      ball.vy *= -0.6;
    }
    if (ball.x < BALL_RADIUS || ball.x > canvas.width - BALL_RADIUS) {
      ball.vx *= -1;
    }
    // check scoring
    if (
      ball.y - BALL_RADIUS < hoop1.y + hoop1.h &&
      ball.x > hoop1.x && ball.x < hoop1.x + hoop1.w
    ) {
      resetBall(1);
    }
    if (
      ball.y - BALL_RADIUS < hoop2.y + hoop2.h &&
      ball.x > hoop2.x && ball.x < hoop2.x + hoop2.w
    ) {
      resetBall(2);
    }
  }
}

function updatePlayers() {
  player1.x += player1.vx;
  player2.x += player2.vx;

  player1.x = Math.max(0, Math.min(canvas.width - PLAYER_WIDTH, player1.x));
  player2.x = Math.max(0, Math.min(canvas.width - PLAYER_WIDTH, player2.x));
}

function gameLoop() {
  drawCourt();
  updatePlayers();
  updateBall();
  drawPlayers();
  drawBall();
  requestAnimationFrame(gameLoop);
}

setInterval(() => {
  timer--;
  if (timer <= 0) timer = 0;
  document.getElementById('timer').textContent = `${timer}s`;
}, 1000);

document.querySelectorAll('.control button').forEach(btn => {
  const act = btn.getAttribute('data-action');
  const type = act.slice(0, act.length - 1); // left/right/shoot
  const player = parseInt(act.slice(-1));
  btn.addEventListener('touchstart', e => {
    e.preventDefault();
    handleAction(player, type, true);
  });
  btn.addEventListener('touchend', e => {
    e.preventDefault();
    handleAction(player, type, false);
  });
});

document.addEventListener('keydown', e => {
  switch (e.key) {
    case 'a':
      player1.vx = -2;
      break;
    case 'd':
      player1.vx = 2;
      break;
    case 'w':
      shoot(1);
      break;
    case 'ArrowLeft':
      player2.vx = -2;
      break;
    case 'ArrowRight':
      player2.vx = 2;
      break;
    case 'ArrowUp':
      shoot(2);
      break;
  }
});

document.addEventListener('keyup', e => {
  if (e.key === 'a' || e.key === 'd') player1.vx = 0;
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') player2.vx = 0;
});

function handleAction(player, type, active) {
  if (type === 'left') {
    if (active) {
      if (player === 1) player1.vx = -2; else player2.vx = -2;
    } else {
      if (player === 1) player1.vx = 0; else player2.vx = 0;
    }
  } else if (type === 'right') {
    if (active) {
      if (player === 1) player1.vx = 2; else player2.vx = 2;
    } else {
      if (player === 1) player1.vx = 0; else player2.vx = 0;
    }
  } else if (type === 'shoot' && active) {
    shoot(player);
  }
}

function shoot(player) {
  if (ball.owner !== player) return;
  ball.owner = null;
  const dir = player === 1 ? { x: 0, y: -4 } : { x: 0, y: -4 };
  ball.vx = dir.x;
  ball.vy = dir.y;
}

function checkBallPickup() {
  if (!ball.owner) {
    if (
      ball.x > player1.x &&
      ball.x < player1.x + PLAYER_WIDTH &&
      ball.y > player1.y &&
      ball.y < player1.y + PLAYER_HEIGHT
    ) {
      ball.owner = 1;
    }
    if (
      ball.x > player2.x &&
      ball.x < player2.x + PLAYER_WIDTH &&
      ball.y > player2.y &&
      ball.y < player2.y + PLAYER_HEIGHT
    ) {
      ball.owner = 2;
    }
  }
}

setInterval(checkBallPickup, 30);

gameLoop();
