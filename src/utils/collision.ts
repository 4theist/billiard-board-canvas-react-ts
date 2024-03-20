import { Ball } from "types/ball";

export const checkCollisionWithWalls = (ball: Ball, canvasWidth: number, canvasHeight: number) => {
    if (ball.x + ball.radius > canvasWidth || ball.x - ball.radius < 0) {
        ball.dx *= -1;
    }
    if (ball.y + ball.radius > canvasHeight || ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }
};

export const checkCollisionBetweenBalls = (balls: Ball[]) => {
    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            const dx = balls[i].x - balls[j].x;
            const dy = balls[i].y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < balls[i].radius + balls[j].radius) {
                const nx = dx / distance;
                const ny = dy / distance;
                const dP = (balls[i].dx - balls[j].dx) * nx + (balls[i].dy - balls[j].dy) * ny;
                balls[i].dx -= dP * nx;
                balls[i].dy -= dP * ny;
                balls[j].dx += dP * nx;
                balls[j].dy += dP * ny;
            }
        }
    }
};
