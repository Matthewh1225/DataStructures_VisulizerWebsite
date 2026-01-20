import './NavBar.css';
import { useNavigate } from 'react-router-dom';

export default function NavBar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('authUser');
  // Handle user logout by clearing local storage and navigating to login page
const handleLogout = () => {
    localStorage.removeItem('authUser');
    localStorage.removeItem('loginTime');
    navigate('/login');
  };
  // Navigation bar component with links to Home, SignUp, Key Details Panel, and Logout
  return (
    <div>
     {/* Logout button */}
      
    <div className="NavBar">
      <button onClick={handleLogout}className="logoutbutton">Logout</button>
      <button className="HomeLink" onClick={() => navigate('/Home')}>Home</button>
      {!isLoggedIn && <button className="SignUp" onClick={() => navigate('/SignUp')}>SignUp</button>}
      <button className="KeyDetailsPanelLink" onClick={() => navigate('/KeyDetailsPanel')}>Key Details Panel</button>
    </div>
    </div>
  );
}
