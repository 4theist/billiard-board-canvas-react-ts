import React, { useEffect, useRef } from 'react';
import './Canvas.module.css'
import { BallModel } from 'models/Ball';

interface CanvasProps{
    ball: BallModel;
}

const Canvas: React.FC<CanvasProps> = ({ ball }): JSX.Element => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');

        if (context && canvas) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = ball.color;
            context.beginPath();
            context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            context.closePath();
            context.fill();
        }
    }, [ball]);

    return <canvas ref={canvasRef} width={800} height={600} />;
};

export default Canvas;
