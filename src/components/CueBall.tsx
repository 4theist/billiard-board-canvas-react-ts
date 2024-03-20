import React from 'react';

interface BallProps {
    id: number;
    x: number;
    y: number;
    dx: number;
    dy: number;
    radius: number;
    color: string;
    ctx: CanvasRenderingContext2D | null;
}

const CueBall: React.FC<BallProps> = ({ id, x, y, radius, color, ctx }) => {
    
    if (!ctx) return null;
 
   
    const hasLine = id >= 9 && id <= 15;

    const drawShadow = () => {
        ctx.beginPath();
        ctx.arc(x + 2, y + 2, radius + 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fill();
        ctx.closePath();
    };

    const drawBall = () => {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = hasLine ? 'white' : color;
        ctx.fill();
        ctx.closePath();
    };

    const drawLine = () => {
        if (hasLine) {
            ctx.beginPath();
            ctx.moveTo(x - radius, y);
            ctx.lineTo(x + radius, y);
            ctx.strokeStyle = color;
            ctx.lineWidth = 18;
            ctx.stroke();
            ctx.closePath();
        }
    };

    const drawCenter = () => {
        if(id === 0) {
            return
        }
        ctx.beginPath();
        ctx.arc(x, y, radius / 2, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
    };

    const drawNumber = () => {
        ctx.font = '12px Arial';
        ctx.fillStyle = id === 0 ? 'white' : 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText((id).toString(), x, y);
    };

    drawShadow();
    drawBall();
    drawLine();
    drawCenter();
    drawNumber();

    return null;
};

export default CueBall;
