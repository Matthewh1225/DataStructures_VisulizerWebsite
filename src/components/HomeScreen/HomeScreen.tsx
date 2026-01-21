import Background from '../../assets/background.jpeg';
import'./HomeScreen.css';
import YoutubeApp from '../YoutubeApp/YoutubeApp';

export default function HomeScreen () {    
    return (
        <div className="HomeScreenContainer">
            <div className="youtube-app-container">
                <YoutubeApp />
                <p className="youtube-text">youtube</p>
            </div >
                <img src={Background} alt="Background" className="background-image" />
        </div>
    );
}