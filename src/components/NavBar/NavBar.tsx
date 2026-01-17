import './NavBar.css';
import { useNavigate } from 'react-router-dom';

export default function NavBar() {
  const navigate = useNavigate();
  
  return (
    <div className="NavBar">
      <button className="HomeLink" onClick={() => navigate('/Home')}>Home</button>
      <button className="KeyDetailsPanelLink" onClick={() => navigate('/KeyDetailsPanel')}>Key Details Panel</button>
    </div>
  );
}
