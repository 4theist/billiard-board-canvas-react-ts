import React, { useEffect, useRef, useState } from 'react';
import s from './Canvas.module.css';
import { Ball } from 'models/Ball';

const Canvas = (): JSX.Element => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [ball, setBall] = useState(new Ball(1, 100, 100, 20, '#ff0000'));
    const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
    const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const cxt = canvas?.getContext('2d');

        if (cxt && canvas) {
            cxt.clearRect(0, 0, canvas.width, canvas.height);
            ball.draw(cxt);
        }
    }, [ball]);

    
    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (isMouseDown && mousePosition) {
            const rect = canvasRef.current?.getBoundingClientRect();
            if (rect) {
                const mouseX = event.clientX - rect.left;
                const mouseY = event.clientY - rect.top;
                const dx = mouseX - mousePosition.x;
                const dy = mouseY - mousePosition.y;
                ball.speedX = dx * 0.5;
                ball.speedY = dy * 0.5;
                setMousePosition({ x: mouseX, y: mouseY });
            }
        }
    };
    const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            setMousePosition({ x: mouseX, y: mouseY });
            setIsMouseDown(true);
            ball.isMoving = true
        }
    };

    const handleMouseUp = () => {
        setIsMouseDown(false);
    };

    const updateCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');

        if (context && canvas) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            ball.draw(context);
        }
    };

    const update = () => {
        ball.move();
        ball.checkWallCollision(800, 600);
        updateCanvas();
        requestAnimationFrame(update);
    };

    useEffect(() => {
        update();
    }, []);

    return (
        <div className={s.canvas}>
            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            />
        </div>
    );
};

export default Canvas;
