export const initialBallsSetup = () => {
    const ballsCount = 15;
    const rows = 5;
    const balls = [];
    const initialX = 750;
    const initialY = 100;
    const radius = 20;
    const spacing = radius * 2 * 1.1;
    let id = 1
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col <= row; col++) {
            balls.push({
                id: id++,
                x: initialX - col * spacing,
                y: initialY + (row - col / 2) * spacing,
                radius: radius,
                dx: 0,
                dy: 0,
            });
        }
    }


    balls.unshift({
        id: 0,
        x: 250,
        y: 200,
        radius: radius,
        dx: 0,
        dy: 0,
    });

    return balls;
};