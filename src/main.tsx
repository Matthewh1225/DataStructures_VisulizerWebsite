import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/global.css';
import './styles/App.css';
import App from './App.tsx';
import KeyDetailsPanel from './components/KeyDetailsPanel/KeyDetailsPanel';
import Login from './components/Login/Login';
import Verification from './components/Verification/Verification';

// Development helper functions for backend user management (browser console only)
// Example: window.addUser('newUser', 'password123')
(window as any).addUser = async (username: string, password: string) => {
  const response = await fetch('http://localhost:4000/admin/add-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  if (!response.ok) {
    const responseBody = await response.json().catch(() => ({} as any));
    console.error('addUser failed', responseBody.error || response.statusText);
    return;
  }

  console.log(`User ${username} added.`);
};

// Example: window.listUsers()
(window as any).listUsers = async () => {
  const response = await fetch('http://localhost:4000/users');
  if (!response.ok) {
    console.error('listUsers failed', response.statusText);
    return [];
  }

  const users = await response.json();
  console.table(users);
  return users;
};
(window as any).doBcrypt= async(password:string)=>{
  const response = await fetch('http://localhost:4000/bcrypt',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({password})
  });
  if(!response.ok){
    console.error('doBcrypt failed',response.statusText);
    return;
  }
  const responseBody=await response.json();
  console.log(`Bcrypted password: ${responseBody.hashedPassword}`);
  return responseBody.hashedPassword;
};
// Application entry point - renders router with authentication flow
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Verification />} />
      <Route path="/login" element={<Login />} />
      <Route path="/Home"  element={<App />} />
      <Route path="/KeyDetailsPanel" element={<KeyDetailsPanel/>} />
    </Routes>
  </BrowserRouter>
);
