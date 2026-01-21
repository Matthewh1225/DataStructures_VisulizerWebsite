import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
// Import NavBar for consistent navigation across the app
// Import CSS for styling the SignUp component
import NavBar from '../NavBar/NavBar';
import './SignUp.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
// SignUp component for user registration
export default function SignUp() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showpass, setshowpass] = useState(false);
  const togglepass = () => { setshowpass(!showpass); };
  const navigate = useNavigate();
  const authUser = JSON.parse(localStorage.getItem('authUser') || '{}');
  const isAdmin = authUser.role === 'admin';
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const authUser = localStorage.getItem('authUser');
    if (authUser && !isAdmin) {
      setMessage('You are already logged in.');
      // Optionally send them home instead of trying to sign up again
      // navigate('/Home');
      return; 
    }
    try {
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();
      const trimmedEmail = email.trim();
      const res = await fetch('http://localhost:4000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: trimmedUsername, password: trimmedPassword, email: trimmedEmail })
      });
      if (res.ok) {
        setMessage('Sign Up successful! Please log in.');
        navigate('/login');
      } else {
        const body = await res.json().catch(() => ({} as any));
        setMessage(body.error || 'Sign Up failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error during sign up.');
    }
  };
  return (
    <>
        <NavBar />
    <div className="SignUpContainer">
        <form onSubmit={handleSignUp}>
          <input 
            className="Input-UserName" 
            type="text" 
            placeholder="Username"   
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input 
            className="Input-Password"  
            type={!showpass ? "password" : "text"}  
            placeholder="Password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input 
            className="Input-Password"  
            type={!showpass ? "password" : "text"} 
            placeholder="Confirm Password" 
            // TODO: add confirm password state/validation
          />
          <input  
            className="Input-Email"  
            type="email" 
            placeholder="Email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button 
            className='SignUpButton' 
            type='submit'>Sign Up
          </button>
          <button 
            className='ToggleButton' 
            type="button" 
            onClick={togglepass}>{showpass ? < FaEyeSlash 
            className='EyeSlahIcon'/> : <FaEye
            className='EyeIcon'/>}
          </button>
        </form>
        {message && <p style={{ marginTop: '10px', color: 'white' }}>{message}</p>}
    </div>
    </>
  );
}