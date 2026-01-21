import './NavBar.css';
import { useNavigate } from 'react-router-dom';

export default function NavBar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('authUser');
  const authUser = JSON.parse(localStorage.getItem('authUser') || '{}');
  const isAdmin = authUser.role === 'admin';
  // Handle user logout by clearing local storage and navigating to login page
const handleLogout = () => {
    localStorage.removeItem('authUser');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('lastActivity');
    navigate('/login');
  };
  // Navigation bar component with links to Home, SignUp, Key Details Panel, and Logout
  return (
    <div>
     {/* Logout button */}
      
    <div className="NavBar">
      <button onClick={handleLogout}className="logoutbutton">Logout</button>
      <button className="HomeLink" onClick={() => navigate('/Home')}>Home</button>
      {(!isLoggedIn || isAdmin) && <button className="SignUp" onClick={() => navigate('/SignUp')}>SignUp</button>}
      <button className="KeyDetailsPanelLink" onClick={() => navigate('/KeyDetailsPanel')}>Key Details Panel</button>
    </div>
    </div>
  );
}
