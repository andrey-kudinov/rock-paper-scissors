const canvas = document.querySelector('canvas');
const container = document.querySelector('.canvas-container');
canvas.style.opacity = 1;
const computedStyle = getComputedStyle(container);
canvas.width = parseInt(computedStyle.width);
canvas.height = parseInt(computedStyle.height);
const ctx = canvas.getContext('2d');

let canvasId;

const radius = 30;

let speed = 3;
const maxSpeed = 5;
const minSpeed = 1;
const speedMultiplier = 0.5;

const increaseSpeedButton = document.querySelector('.increase-speed-button');
const decreaseSpeedButton = document.querySelector('.decrease-speed-button');
const speedValue = document.querySelector('.speed-value');

const useCirclesRadio = document.querySelector('#useCircles');
const useIconsRadio = document.querySelector('#useIcons');

const ballCountSelectK = document.querySelector('#ballCountK');
const ballCountSelectN = document.querySelector('#ballCountN');
const ballCountSelectB = document.querySelector('#ballCountB');

const ballCountDisplayK = document.querySelector('.ball-count-display-k');
const ballCountDisplayN = document.querySelector('.ball-count-display-n');
const ballCountDisplayB = document.querySelector('.ball-count-display-b');

let initBallCountK = ballCountSelectK.value;
let initBallCountN = ballCountSelectN.value;
let initBallCountB = ballCountSelectB.value;
let ballCountK = initBallCountK;
let ballCountN = initBallCountN;
let ballCountB = initBallCountB;

ballCountSelectK.onchange = () => {
  initBallCountK = parseInt(ballCountSelectK.value);
};
ballCountSelectN.onchange = () => {
  initBallCountN = parseInt(ballCountSelectN.value);
};
ballCountSelectB.onchange = () => {
  initBallCountB = parseInt(ballCountSelectB.value);
};

increaseSpeedButton.addEventListener('click', () => {
  if (speed < maxSpeed) {
    speed++;
    speedValue.textContent = speed;
  }
  increaseSpeedButton.disabled = speed === maxSpeed;
  decreaseSpeedButton.disabled = speed === minSpeed;
});

decreaseSpeedButton.addEventListener('click', () => {
  if (speed > minSpeed) {
    speed--;
    speedValue.textContent = speed;
  }
  increaseSpeedButton.disabled = speed === maxSpeed;
  decreaseSpeedButton.disabled = speed === minSpeed;
});

const createBall = letter => {
  const dx = (Math.random() - 0.5) * 10;
  const dy = (Math.random() - 0.5) * 10;
  const x = Math.random() * (canvas.width - 2 * radius) + radius;
  const y = Math.random() * (canvas.height - 2 * radius) + radius;
  return {
    x,
    y,
    dx,
    dy,
    originalDx: dx,
    originalDy: dy,
    radius,
    letter
  };
};

let balls = [
  ...Array.from({ length: initBallCountK }, () => createBall('К')),
  ...Array.from({ length: initBallCountN }, () => createBall('Н')),
  ...Array.from({ length: initBallCountB }, () => createBall('Б'))
];

const paper = new Image();
paper.src = 'paper.svg';
const rock = new Image();
rock.src = 'rock.svg';
const scissors = new Image();
scissors.src = 'scissors.svg';

const drawBall = ball => {
  if (useCirclesRadio.checked) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.letter === 'К' ? 'blue' : ball.letter === 'Н' ? 'red' : 'gray';
    ctx.fill();
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    const textWidth = ctx.measureText(ball.letter).width;
    const textHeight = ctx.measureText('Н').width; // 'M' is used to get an approximate height of a line of text
    ctx.fillText(ball.letter, ball.x - textWidth / 2, ball.y + textHeight / 2);
    ctx.closePath();
  }

  if (useIconsRadio.checked) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    let image;
    if (ball.letter === 'К') {
      image = rock;
    } else if (ball.letter === 'Н') {
      image = scissors;
    } else {
      image = paper;
    }
    ctx.drawImage(image, ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
    ctx.font = '30px Arial';
    ctx.fillStyle = 'rgba(0, 0, 0, 0)'; // transparent color so the letter is not visible
    const textWidth = ctx.measureText(ball.letter).width;
    const textHeight = ctx.measureText('Н').width; // 'M' is used to get an approximate height of a line of text
    ctx.fillText(ball.letter, ball.x - textWidth / 2, ball.y + textHeight / 2);
    ctx.closePath();
  }
};

canvas.addEventListener('click', event => {
  const letters = ['К', 'Н', 'Б'];
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  balls.forEach(ball => {
    const distance = Math.hypot(ball.x - x, ball.y - y);

    if (distance - ball.radius < 10) {
      const oldLetter = ball.letter;
      const currentIndex = letters.indexOf(oldLetter);
      const nextIndex = (currentIndex + 1) % letters.length;
      const newLetter = letters[nextIndex];
      ball.letter = newLetter;

      if (oldLetter === 'Н') ballCountN--;
      else if (oldLetter === 'К') ballCountK--;
      else if (oldLetter === 'Б') ballCountB--;

      if (newLetter === 'Н') ballCountN++;
      else if (newLetter === 'К') ballCountK++;
      else if (newLetter === 'Б') ballCountB++;

      ballCountDisplayK.textContent = ballCountK;
      ballCountDisplayN.textContent = ballCountN;
      ballCountDisplayB.textContent = ballCountB;
    }
  });
});

const updateBall = ball => {
  let dx = ball.originalDx * speed * speedMultiplier;
  let dy = ball.originalDy * speed * speedMultiplier;

  if (ball.x + dx > canvas.width - ball.radius || ball.x + dx < ball.radius) {
    dx = -dx;
    ball.originalDx = -ball.originalDx;
  }

  if (ball.y + dy > canvas.height - ball.radius || ball.y + dy < ball.radius) {
    dy = -dy;
    ball.originalDy = -ball.originalDy;
  }

  return { ...ball, dx, dy, x: ball.x + dx, y: ball.y + dy };
};

const checkCollision = (ball1, ball2) => {
  const dx = ball1.x - ball2.x;
  const dy = ball1.y - ball2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < ball1.radius + ball2.radius;
};

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  balls.forEach((ball, i) => {
    balls[i] = updateBall(ball);
    drawBall(balls[i]);
  });

  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      if (checkCollision(balls[i], balls[j])) {
        if (
          (balls[i].letter === 'К' && balls[j].letter === 'Н') ||
          (balls[i].letter === 'Н' && balls[j].letter === 'К')
        ) {
          balls[i].letter = 'К';
          balls[j].letter = 'К';
          ballCountN--;
          ballCountK++;
        } else if (
          (balls[i].letter === 'К' && balls[j].letter === 'Б') ||
          (balls[i].letter === 'Б' && balls[j].letter === 'К')
        ) {
          balls[i].letter = 'Б';
          balls[j].letter = 'Б';
          ballCountK--;
          ballCountB++;
        } else if (
          (balls[i].letter === 'Н' && balls[j].letter === 'Б') ||
          (balls[i].letter === 'Б' && balls[j].letter === 'Н')
        ) {
          balls[i].letter = 'Н';
          balls[j].letter = 'Н';
          ballCountB--;
          ballCountN++;
        }
        ballCountDisplayK.textContent = ballCountK;
        ballCountDisplayN.textContent = ballCountN;
        ballCountDisplayB.textContent = ballCountB;
      }
    }
  }

  canvasId = requestAnimationFrame(draw);
};

draw();

const restartButton = document.querySelector('.restart-button');
restartButton.addEventListener('click', () => {
  cancelAnimationFrame(canvasId);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ballCountK = initBallCountK;
  ballCountN = initBallCountN;
  ballCountB = initBallCountB;
  speed = 3;

  ballCountDisplayK.textContent = ballCountK;
  ballCountDisplayN.textContent = ballCountN;
  ballCountDisplayB.textContent = ballCountB;
  speedValue.textContent = speed;

  increaseSpeedButton.disabled = false;
  decreaseSpeedButton.disabled = false;

  balls = [
    ...Array.from({ length: initBallCountK }, () => createBall('К')),
    ...Array.from({ length: initBallCountN }, () => createBall('Н')),
    ...Array.from({ length: initBallCountB }, () => createBall('Б'))
  ];

  draw();
});
