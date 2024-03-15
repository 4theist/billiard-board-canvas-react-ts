 export interface BallModel {
    id: number;
    x: number;
    y: number;
    radius: number;
    color: string;
    speedX: number;
    speedY: number;
    isMoving: boolean;
}

export class Ball implements BallModel {
    public id: number;
    public x: number;
    public y: number;
    public radius: number;
    public color: string;
    public speedX: number;
    public speedY: number;
    public isMoving: boolean;

    constructor(id: number, x: number, y: number, radius: number, color: string) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speedX = 0;
        this.speedY = 0;
        this.isMoving = false;
    }

    public move(): void {
        if (this.isMoving) {
            this.x += this.speedX;
            this.y += this.speedY;
        }
    }

    public applyFriction(friction: number): void {
        this.speedX *= friction;
        this.speedY *= friction;
    }

    public checkWallCollision(canvasWidth: number, canvasHeight: number): void {
        if (this.x - this.radius < 0 || this.x + this.radius > canvasWidth) {
            this.speedX = -this.speedX;
        }
        if (this.y - this.radius < 0 || this.y + this.radius > canvasHeight) {
            this.speedY = -this.speedY;
        }
    }

    public checkBallCollision(otherBall: Ball): void {
        const dx = this.x - otherBall.x;
        const dy = this.y - otherBall.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.radius + otherBall.radius) {
            // Шары столкнулись, меняем их скорости
            const angle = Math.atan2(dy, dx);
            const magnitude1 = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
            const magnitude2 = Math.sqrt(otherBall.speedX * otherBall.speedX + otherBall.speedY * otherBall.speedY);
            const direction1 = Math.atan2(this.speedY, this.speedX);
            const direction2 = Math.atan2(otherBall.speedY, otherBall.speedX);

            const newSpeedX1 = magnitude1 * Math.cos(direction1 - angle);
            const newSpeedY1 = magnitude1 * Math.sin(direction1 - angle);
            const newSpeedX2 = magnitude2 * Math.cos(direction2 - angle);
            const newSpeedY2 = magnitude2 * Math.sin(direction2 - angle);

            const finalSpeedX1 = ((this.radius - otherBall.radius) * newSpeedX1 + (otherBall.radius * 2) * newSpeedX2) / (this.radius + otherBall.radius);
            const finalSpeedX2 = ((this.radius * 2) * newSpeedX1 + (otherBall.radius - this.radius) * newSpeedX2) / (this.radius + otherBall.radius);

            const finalSpeedY1 = newSpeedY1;
            const finalSpeedY2 = newSpeedY2;

            this.speedX = Math.cos(angle) * finalSpeedX1 + Math.cos(angle + Math.PI / 2) * finalSpeedY1;
            this.speedY = Math.sin(angle) * finalSpeedX1 + Math.sin(angle + Math.PI / 2) * finalSpeedY1;
            otherBall.speedX = Math.cos(angle) * finalSpeedX2 + Math.cos(angle + Math.PI / 2) * finalSpeedY2;
            otherBall.speedY = Math.sin(angle) * finalSpeedX2 + Math.sin(angle + Math.PI / 2) * finalSpeedY2;

            // Добавим небольшой отскок, чтобы избежать зависания шаров
            this.x += Math.cos(angle) * 2;
            this.y += Math.sin(angle) * 2;
            otherBall.x += Math.cos(angle) * 2;
            otherBall.y += Math.sin(angle) * 2;
        }
    }
}
