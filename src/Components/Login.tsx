import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  // State for email, password, and feedback message
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Handle login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();
      const res = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: trimmedUsername, password: trimmedPassword })
      });
      if (res.ok) {
        setMessage('Login successful!');
        const body = await res.json();
        const now = Date.now().toString();
        localStorage.setItem('authUser', JSON.stringify(body.user));
        localStorage.setItem('loginTime', now);
        localStorage.setItem('lastActivity', now);
        navigate('/Home');
      } else {
        const body = await res.json().catch(() => ({} as any));
        setMessage(body.error || 'Invalid username or password.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error logging in.');
    }
  };

  return (
    <div>
      <h1 className="LoginHeader">Login</h1>
      <form onSubmit={handleLogin}>
        {/* Username input field */}
        <input 
          id="login-username"
          name="username"
          className="loginInput" 
          type="text" 
          placeholder="Username" 
          required 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {/* Password input field */}
        <input 
          id="login-password"
          name="password"
          className="loginInput" 
          type="password" 
          placeholder="Password" 
          required 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* Login button */}
        <button className="loginSubmitbtn" type="submit">Login</button>
      </form>
      {/* Display feedback message */}
      {message && <p style={{ marginTop: '10px', color: 'white' }}>{message}</p>}
    </div>
  );
}