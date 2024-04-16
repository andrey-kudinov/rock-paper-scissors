// Создание холста
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

// Количество каждого типа мячей
const ballCountK = 10;
const ballCountN = 10;
const ballCountB = 10;

// Функция для создания мяча
const createBall = (letter) => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    dx: (Math.random() - 0.5) * 10,
    dy: (Math.random() - 0.5) * 10,
    radius: 15,
    letter: letter,
});

// Функция для отрисовки мяча
const drawBall = (ball) => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.letter === 'К' ? 'blue' : ball.letter === 'Н' ? 'red' : 'gray';
    ctx.fill();
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(ball.letter, ball.x, ball.y);
    ctx.closePath();
};

// Функция для обновления мяча
const updateBall = (ball) => {
    const dx = ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius ? -ball.dx : ball.dx;
    const dy = ball.y + ball.dy > canvas.height - ball.radius || ball.y + ball.dy < ball.radius ? -ball.dy : ball.dy;
    return { ...ball, dx, dy, x: ball.x + dx, y: ball.y + dy };
};

// Функция для проверки пересечения мячей
const checkCollision = (ball1, ball2) => {
    const dx = ball1.x - ball2.x;
    const dy = ball1.y - ball2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < ball1.radius + ball2.radius;
};

// Создание мячей
let balls = [
  ...Array.from({ length: ballCountK }, () => createBall('К')),
  ...Array.from({ length: ballCountN }, () => createBall('Н')),
  ...Array.from({ length: ballCountB }, () => createBall('Б')),
];

// Функция для отрисовки и обновления мячей
const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balls.forEach((ball, i) => {
        balls[i] = updateBall(ball);
        drawBall(balls[i]);
    });

    // Проверка на пересечение мячей
    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            if (checkCollision(balls[i], balls[j])) {
                if ((balls[i].letter === 'К' && balls[j].letter === 'Н') || (balls[i].letter === 'Н' && balls[j].letter === 'К')) {
                    balls[i].letter = 'К';
                    balls[j].letter = 'К';
                } else if ((balls[i].letter === 'К' && balls[j].letter === 'Б') || (balls[i].letter === 'Б' && balls[j].letter === 'К')) {
                    balls[i].letter = 'Б';
                    balls[j].letter = 'Б';
                } else if ((balls[i].letter === 'Н' && balls[j].letter === 'Б') || (balls[i].letter === 'Б' && balls[j].letter === 'Н')) {
                    balls[i].letter = 'Н';
                    balls[j].letter = 'Н';
                }
            }
        }
    }

    requestAnimationFrame(draw);
};

draw();