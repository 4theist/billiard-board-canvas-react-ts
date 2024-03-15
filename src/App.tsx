import './styles/reset.css';
import './styles/index.css';
import Canvas from 'components/Canvas/Canvas';
import { BallModel } from 'models/Ball';

const App: React.FC = () => {
    const ball: BallModel = {
        id: 1,
        x: 100,
        y: 100,
        radius: 20,
        color: '#ff0000',
        speedX: 0,
        speedY: 0,
        isMoving: false,
    };

    return (
        <div>
            <Canvas ball={ball} />
        </div>
    );
};

export default App;
