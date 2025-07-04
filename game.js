const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 15;
const PLAYER_X = 10;
const AI_X = canvas.width - PADDLE_WIDTH - 10;
const PADDLE_SPEED = 6;
const AI_SPEED = 4;

// Game state
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ballX = (canvas.width - BALL_SIZE) / 2;
let ballY = (canvas.height - BALL_SIZE) / 2;
let ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 4 * (Math.random() * 2 - 1);
let playerScore = 0;
let aiScore = 0;

// Draw functions
function drawRect(x, y, w, h, color = "#fff") {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawBall(x, y, size, color = "#fff") {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawNet() {
  for (let i = 0; i < canvas.height; i += 25) {
    drawRect(canvas.width / 2 - 2, i, 4, 15, "#888");
  }
}

function drawScores() {
  ctx.font = "32px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText(playerScore, canvas.width / 4, 50);
  ctx.fillText(aiScore, (canvas.width * 3) / 4, 50);
}

// Game logic functions
function resetBall() {
  ballX = (canvas.width - BALL_SIZE) / 2;
  ballY = (canvas.height - BALL_SIZE) / 2;
  ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
  ballSpeedY = 4 * (Math.random() * 2 - 1);
}

function collision(x, y, w, h, ballX, ballY, ballSize) {
  return (
    ballX < x + w &&
    ballX + ballSize > x &&
    ballY < y + h &&
    ballY + ballSize > y
  );
}

function update() {
  // Ball movement
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Top/bottom wall collision
  if (ballY <= 0 || ballY + BALL_SIZE >= canvas.height) {
    ballSpeedY *= -1;
  }

  // Left paddle collision
  if (
    collision(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, ballX, ballY, BALL_SIZE)
  ) {
    ballSpeedX *= -1;
    // Add some "spin"
    let intersectY = (ballY + BALL_SIZE / 2) - (playerY + PADDLE_HEIGHT / 2);
    ballSpeedY = intersectY * 0.2;
    ballX = PLAYER_X + PADDLE_WIDTH;
  }

  // Right (AI) paddle collision
  if (
    collision(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, ballX, ballY, BALL_SIZE)
  ) {
    ballSpeedX *= -1;
    let intersectY = (ballY + BALL_SIZE / 2) - (aiY + PADDLE_HEIGHT / 2);
    ballSpeedY = intersectY * 0.2;
    ballX = AI_X - BALL_SIZE;
  }

  // Left wall (AI scores)
  if (ballX <= 0) {
    aiScore++;
    resetBall();
  }

  // Right wall (Player scores)
  if (ballX + BALL_SIZE >= canvas.width) {
    playerScore++;
    resetBall();
  }

  // AI movement (simple tracking)
  let aiCenter = aiY + PADDLE_HEIGHT / 2;
  if (aiCenter < ballY + BALL_SIZE / 2 - 15) {
    aiY += AI_SPEED;
  } else if (aiCenter > ballY + BALL_SIZE / 2 + 15) {
    aiY -= AI_SPEED;
  }

  // Keep paddles in bounds
  aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
  playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
}

function render() {
  // Clear
  drawRect(0, 0, canvas.width, canvas.height, "#111");
  drawNet();
  drawScores();
  // Draw paddles
  drawRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
  drawRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);
  // Draw ball
  drawBall(ballX, ballY, BALL_SIZE);
}

function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

// Mouse control for left paddle
canvas.addEventListener('mousemove', function (evt) {
  const rect = canvas.getBoundingClientRect();
  const mouseY = evt.clientY - rect.top;
  playerY = mouseY - PADDLE_HEIGHT / 2;
  playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

// Start game
gameLoop();