import Background from '../../assets/background.jpeg';
import './HomeScreen.css';
import YoutubeApp from '../YoutubeApp/YoutubeApp';
import SnakeApp from '../Snake/SnakeApp';
import React from 'react';
import TaskBar from '../TaskBar/TaskBar';
export default function HomeScreen () {    
   
    return (
        
        <div className="HomeScreenContainer">
            <div>
                <TaskBar />
            </div>
            <div className="Snake-App-Container">
                <SnakeApp />
                <p className="snake-text">snake</p>
            </div >
            <div className="Youtube-App-Container">
                <YoutubeApp />
                <p className="youtube-text">youtube</p>
            </div >
                <img src={Background} alt="Background" className="background-image" />
        </div>
    );
}
