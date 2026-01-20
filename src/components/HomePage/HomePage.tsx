import { useState, useEffect } from 'react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import CatFace from '../../assets/CatFace.png';
import NavBar from '../NavBar/NavBar';
import Carousel from '../Carousel/Carousel'
// App styles are now imported globally in main.tsx

/**
 * Main application component - displays the home page after successful login
 * Features: Session management, audio controls, animations
 */
export default function HomePage() {
  // ==================== STATE AND REFS ====================
  const [clickCount, setClickCount] = useState(1);
//   const [isMusicButtonMinimized, setIsMusicButtonMinimized] = useState(false);
//   const audioElementRef = useRef<HTMLAudioElement>(null);
  const navigate = useNavigate();

  // ==================== SESSION MANAGEMENT ====================
  useEffect(() => {
    const IDLE_TIMEOUT = 10 * 60 * 1000; // 10 minutes of inactivity
    const ABSOLUTE_TIMEOUT = 30 * 60 * 1000; // 30 minutes max session

    // Function to check authentication and session validity
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

      // If idle or absolute timeout exceeded, log out
      if (idleTime > IDLE_TIMEOUT || totalSessionTime > ABSOLUTE_TIMEOUT) {
        localStorage.removeItem('authUser');
        localStorage.removeItem('loginTime');
        localStorage.removeItem('lastActivity');
        navigate('/login');
      }
    };

    // Function to update last activity timestamp
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

  // ==================== EVENT HANDLERS ====================
  // Handler for music button click
//   const handleMusicClick = () => {
//     const audio = audioElementRef.current;
//     if (audio) {
//       if (audio.paused) {
//         audio.volume = 1.0;
//         audio.play();
//         setIsMusicButtonMinimized(true);
//       } else {
//         audio.pause();
//       }
//     }
//   };

  // Handler for gif click to increase volume
//   const handleGifClick = () => {
//     const audio = audioElementRef.current;
//     if (audio) {
//       audio.volume = Math.min(audio.volume + 0.1, 1.0);
//     }
//   };

  return (
    <>
      <NavBar />
      <div>
        <h2>Welcome to the Home Page!</h2>
        <Carousel />
        <img src={CatFace} className="App-logo" alt="logo" />

        <div className="counter-container">
          <button
            onClick={() => setClickCount((currentCount) => currentCount * 2 ** 34)}
            className="counter-button"
          >
            count is {clickCount}
          </button>
          <p></p>
        </div>

        <p className="read-the-docs">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam laudantium sit veniam. Mollitia vel pariatur quo ex soluta? Molestiae est nobis repudiandae aspernatur iste possimus eveniet praesentium impedit aut quidem.
        </p>
      </div>
    </>
  );
}
