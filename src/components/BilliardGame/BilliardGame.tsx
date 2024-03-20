import React, { useRef, useEffect, useState, MouseEventHandler } from 'react';
import { Ball } from 'types/ball';
import { checkCollisionBetweenBalls, checkCollisionWithWalls } from 'utils/collision';
import CueBall from '../CueBall';
import s from '../BilliardGame/BilliardGame.module..css'
import ColorPalette from 'components/ColorPalette/ColorPalette';
import { initialBallsSetup } from 'utils/initialBalls';
import { frictionCoefficient } from '../../constants';

interface GameCanvasProps {
    balls: Ball[];
    setBalls: React.Dispatch<React.SetStateAction<Ball[]>>;
}

const BilliardGame: React.FC<GameCanvasProps> = ({ balls, setBalls }) => {
    const [ballColors, setBallColors] = useState<{ [key: number]: string }>({
        0: '#FFFFFF', 
        1: '#FFFF00', 
        2: '#0000FF', 
        3: '#FF0000', 
        4: '#800080',
        5: '#FFA500',
        6: '#008000', 
        7: '#964B00', 
        8: 'black',  
        9: '#FFD700',
        10: '#00FF00', 
        11: '#FF69B4', 
        12: '#8A2BE2', 
        13: '#ADD8E6',
        14: '#FF4500', 
        15: '#800000',
    });

    const [isGameStarted, setIsGameStarted] = useState(false)
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
    const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [closurestBallId, setClosurestBallId] = useState<number>(-1)

    const handleGameStart = () => {
        setMousePosition(null)
        setIsGameStarted(true)
    }
    const handleReset = () => {
        setClosurestBallId(-1)
        setBalls(initialBallsSetup)
        setMousePosition(null)
        setIsGameStarted(false)
    }
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const handleClick = (event: MouseEvent) => {
            const mouseX = event.clientX;
            const mouseY = event.clientY;

            let closestDistance = Number.MAX_SAFE_INTEGER;
            let closestBallIndex = -1;

            balls.forEach((ball, index) => {
                const dx = mouseX - ball.x;
                const dy = mouseY - ball.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestBallIndex = index;
                }
            });

            if (closestBallIndex !== -1) {
                setClosurestBallId(balls[closestBallIndex].id);
            }
        };

        canvas.addEventListener('click', handleClick);

        return () => {
            canvas.removeEventListener('click', handleClick);
        };
    }, [balls, setClosurestBallId]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const updatePosition = (ball: Ball) => {
            ball.x += ball.dx;
            ball.y += ball.dy;
            ball.dx *= frictionCoefficient;
            ball.dy *= frictionCoefficient;
        };

        const updateCanvas = () => {
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);

            balls.forEach((ball, i) => {
                const color = ballColors[i];
                if (isGameStarted) {
                    updatePosition(ball);
                }

                CueBall({ ...ball, color,  ctx });
                checkCollisionWithWalls(ball, canvasWidth, canvasHeight);
            });
            checkCollisionBetweenBalls(balls);
            requestAnimationFrame(updateCanvas);
        };


        updateCanvas();
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mouseup', handleMouseUp);

        return () => {
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mouseup', handleMouseUp);
        };
    }, [balls, selectedColor,ballColors, isGameStarted]);

    const handleMouseMove = (event: { clientX: number; clientY: number; }) => {
        if (!isMouseDown) return;

        const mouseX = event.clientX;
        const mouseY = event.clientY;

        let closestDistance = Number.MAX_SAFE_INTEGER;
        let closestBallIndex = -1;

        balls.forEach((ball, index) => {
            const dx = mouseX - ball.x;
            const dy = mouseY - ball.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestBallIndex = 0;
            }
        });

        if (closestBallIndex !== -1) {
            setClosurestBallId(closestBallIndex + 1);

            setBalls(prevBalls => {
                return prevBalls.map((ball, index) => {
                    const speedX = index === closestBallIndex ? (mouseX - ball.x) * 0.1 : 0;
                    const speedY = index === closestBallIndex ? (mouseY - ball.y) * 0.1 : 0;
                    return { ...ball, dx: speedX, dy: speedY };
                });
            });
        }

        setMousePosition({ x: mouseX, y: mouseY });
    };


    const handleMouseDown = (event: { clientX: number; clientY: number; }) => {
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        setMousePosition({ x: mouseX, y: mouseY });
        setIsMouseDown(true);
    };

    const handleMouseUp = () => {
        setIsMouseDown(false);
    };
 
    const handleColorChange = (id: number, color: string) => {
        console.log(color)
        setSelectedColor(color);
        setBallColors(prevColors => ({
            ...prevColors,
            [id]: color,
        }));
    };

    const handleClick: MouseEventHandler<HTMLCanvasElement> = (event) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        let closestBallId = null;
        let closestDistanceSquared = Number.MAX_SAFE_INTEGER;

        balls.forEach(ball => {
            const dx = mouseX - ball.x;
            const dy = mouseY - ball.y;
            const distanceSquared = dx * dx + dy * dy;

            if (distanceSquared < closestDistanceSquared) {
                closestDistanceSquared = distanceSquared;
                closestBallId = ball.id;
            }
        });

        if (closestBallId !== null) {
            setClosurestBallId(closestBallId);
        }
    };

    return (
        <div className={s.root}>
            {!isGameStarted ? (
                <button
                    className={s.startBtn}
                    onClick={handleGameStart}
                    disabled={isGameStarted}
                >
                    Start Game!
                </button>
            ) : (
                <button
                    className={s.resetBtn}
                    onClick={handleReset}
                >
                    Reset
                </button>
            )}

            <div className={s.canvas}>
                {closurestBallId >= 0 && !isGameStarted && <ColorPalette
                    id={closurestBallId}
                    selectedColor={selectedColor}
                    onChangeColor={handleColorChange}
                    position={mousePosition}
                />}
                <canvas
                    ref={canvasRef}
                    width={800}
                    height={400}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onClick={handleClick}
                    style={{ border: '2px solid black' }}
                />
            </div>
        </div>
    );
};

export default BilliardGame;
