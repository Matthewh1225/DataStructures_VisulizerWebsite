import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CatFace from './assets/CatFace.png'
import BumbleBee from './assets/BumbleBeeSong.mp3'
import sweetlittle from './assets/sweetlittle.gif'
import './App.css'
import './index.css'
function App() {
  // State to manage the count
  const [count, setCount] = useState(1)
  // State to manage if the music button is minimized
  const [isMinimized, setIsMinimized] = useState(false);
  // Ref to the audio element
  const audioRef = useRef<HTMLAudioElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const IDLE_TIMEOUT = 10 * 60 * 1000; // 10 minutes of inactivity
    const ABSOLUTE_TIMEOUT = 30 * 60 * 1000; // 30 minutes max session
    
    const checkAuth = () => {
      const authUser = localStorage.getItem('authUser');
      const loginTime = localStorage.getItem('loginTime');
      const lastActivity = localStorage.getItem('lastActivity');
      
      if (!authUser || !loginTime || !lastActivity) {
        navigate('/login');
        return;
      }
      
      const now = Date.now();
      const idleTime = now - parseInt(lastActivity, 10);
      const totalTime = now - parseInt(loginTime, 10);
      
      if (idleTime > IDLE_TIMEOUT || totalTime > ABSOLUTE_TIMEOUT) {
        localStorage.removeItem('authUser');
        localStorage.removeItem('loginTime');
        localStorage.removeItem('lastActivity');
        navigate('/login');
      }
    };
    
    const updateActivity = () => {
      if (localStorage.getItem('authUser')) {
        localStorage.setItem('lastActivity', Date.now().toString());
      }
    };
    
    checkAuth();
    
    // Track user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, updateActivity));
    
    // Check auth every 30 seconds
    const interval = setInterval(checkAuth, 30000);
    
    return () => {
      events.forEach(event => window.removeEventListener(event, updateActivity));
      clearInterval(interval);
    };
  }, [navigate]);

  // Handler for music button click
  const handleMusicClick = () => {
    const audio = audioRef.current;
    if (audio) {
      if (audio.paused) {
        audio.volume = 1.0;
        audio.play();
        setIsMinimized(true);
      } else {
        audio.pause();
      }
    }
  };

  // Handler for gif click to increase volume
  const handleGifClick = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = Math.min(audio.volume + 0.1, 1.0);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authUser');
    localStorage.removeItem('loginTime');
    navigate('/login');
  };

  return (
    <>
    <div>
      {/* Logout button */}
      <button 
        onClick={handleLogout}
        className="logoutButton"
      >
        Logout
      </button>
      {/* Gif that increases volume on click */}
      <><img className={`gif${isMinimized ? ' scaled' : ''}`} onClick={handleGifClick} src={sweetlittle} style={{cursor: 'pointer'}}></img></>
      <audio ref={audioRef} src={BumbleBee} loop></audio>
       {/* Button to control music playback */}
       <button 
         onClick={handleMusicClick} 
         className={`MusicButton${isMinimized ? ' minimized' : ''}`}
       >
         {isMinimized ? '♪' : 'Click me'}
       </button>
     <a href="https://blockboster-rentals.onrender.com/" target="_blank" rel="noopener noreferrer"> 
       <img src={CatFace} className='cat' style={{cursor: 'pointer'}}></img>
     </a>
    </div>
      <div>
    
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count * 2**34)} className="card">
          count is {count}
        </button>
        <p>
        </p>
      </div>
      <p className="read-the-docs">
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam laudantium sit veniam. Mollitia vel pariatur quo ex soluta? Molestiae est nobis repudiandae aspernatur iste possimus eveniet praesentium impedit aut quidem.
      </p>
    </>
  )
}

export default App
