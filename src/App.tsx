import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CatFace from './assets/CatFace.png';
import BumbleBee from './assets/BumbleBeeSong.mp3';
import sweetlittle from './assets/sweetlittle.gif';
import NavBar from './components/NavBar/NavBar';
// App styles are now imported globally in main.tsx

/**
 * Main application component - displays the home page after successful login
 * Features: Session management, audio controls, animations
 */
function App() {
  // Track button clicks and audio/minimize state in simple variables
  const [clickCount, setClickCount] = useState(1);
  const [isMusicButtonMinimized, setIsMusicButtonMinimized] = useState(false);
  const audioElementRef = useRef<HTMLAudioElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const IDLE_TIMEOUT = 10 * 60 * 1000; // 10 minutes of inactivity
    const ABSOLUTE_TIMEOUT = 30 * 60 * 1000; // 30 minutes max session
    
    const checkAuthStatus = () => {
      const storedUser = localStorage.getItem('authUser');
      const loginTime = localStorage.getItem('loginTime');
      const lastActivity = localStorage.getItem('lastActivity');

      // If any required value is missing, force login
      if (!storedUser || !loginTime || !lastActivity) {
        navigate('/login');
        return;
      }

      const currentTime = Date.now();
      const idleTime = currentTime - parseInt(lastActivity, 10);
      const totalSessionTime = currentTime - parseInt(loginTime, 10);

      if (idleTime > IDLE_TIMEOUT || totalSessionTime > ABSOLUTE_TIMEOUT) {
        localStorage.removeItem('authUser');
        localStorage.removeItem('loginTime');
        localStorage.removeItem('lastActivity');
        navigate('/login');
      }
    };

    const updateLastActivity = () => {
      if (localStorage.getItem('authUser')) {
        localStorage.setItem('lastActivity', Date.now().toString());
      }
    };

    // Run initial check on page load
    checkAuthStatus();

    // Track user activity to keep session alive
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    activityEvents.forEach(eventName => window.addEventListener(eventName, updateLastActivity));

    // Re-check auth every 30 seconds
    const authInterval = setInterval(checkAuthStatus, 30000);

    return () => {
      activityEvents.forEach(eventName => window.removeEventListener(eventName, updateLastActivity));
      clearInterval(authInterval);
    };
  }, [navigate]);

  // Handler for music button click
  const handleMusicClick = () => {
    const audio = audioElementRef.current;
    if (audio) {
      if (audio.paused) {
        audio.volume = 1.0;
        audio.play();
        setIsMusicButtonMinimized(true);
      } else {
        audio.pause();
      }
    }
  };

  // Handler for gif click to increase volume
  const handleGifClick = () => {
    const audio = audioElementRef.current;
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
    <NavBar />
    <div>
    </div>
    <div>
      {/* Logout button */}
      <button 
        onClick={handleLogout}
        className="logoutButton"
      >
        Logout
      </button>
      {/* Gif that increases volume on click */}
      <img
        className={`gif${isMusicButtonMinimized ? ' scaled' : ''}`}
        onClick={handleGifClick}
        src={sweetlittle}
        style={{ cursor: 'pointer' }}
        alt="Dancing character increases volume"
      />
      <audio ref={audioElementRef} src={BumbleBee} loop></audio>
       {/* Button to control music playback */}
       <button 
         onClick={handleMusicClick} 
         className={`MusicButton${isMusicButtonMinimized ? ' minimized' : ''}`}
       >
         {isMusicButtonMinimized ? '♪' : 'Click me'}
       </button>
     <a href="https://blockboster-rentals.onrender.com/" target="_blank" rel="noopener noreferrer"> 
       <img src={CatFace} className='cat' style={{cursor: 'pointer'}} alt="Cat logo"></img>
     </a>
    </div>
      <div>
    
      </div>
      <div className="card">
        <button
          onClick={() => setClickCount((currentCount) => currentCount * 2 ** 34)}
          className="card"
        >
          count is {clickCount}
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
