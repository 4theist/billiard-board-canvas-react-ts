import './styles/reset.css';
import './styles/index.css';
import BilliardGame from 'components/BilliardGame/BilliardGame';
import { useState } from 'react';
import { Ball } from 'types/ball';
import { initialBallsSetup } from 'utils/initialBalls';


const App: React.FC = () => {
    
    const [balls, setBalls] = useState<Ball[]>(initialBallsSetup());
    

    return (
        <div>
            <BilliardGame balls={balls} setBalls={setBalls}/>
        </div>
    );
};

export default App;
