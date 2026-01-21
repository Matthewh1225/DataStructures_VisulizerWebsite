import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/global.css';
import HomePage from './components/HomePage/HomePage';
import KeyDetailsPanel from './components/KeyDetailsPanel/KeyDetailsPanel';
import Login from './components/Login/Login';
import Verification from './components/Verification/Verification';
import SignUp from './components/SignUp/SignUp';
import HomeScreen from './components/HomeScreen/HomeScreen';

// Expose admin utility functions to the global window object for easy access in the browser console

// Example: window.addUser('newuser', 'password123')
(window as any).addUser = async (username: string, password: string, email: string, role: string) => {
  const response = await fetch('http://localhost:4000/admin/add-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, email,role})
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
// Example: window.removeUser('usernameToRemove')
(window as any).removeUser = async (username: string) => {
  const response = await fetch('http://localhost:4000/admin/remove-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username })
  });
  if (!response.ok) {
    const responseBody = await response.json().catch(() => ({} as any));
    console.error('removeUser failed', responseBody.error || response.statusText);
    return;
  }
  console.log(`User ${username} removed.`);
};
// Example: window.doBcrypt('password123')
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
      <Route path="/Home"  element={<HomePage />} />
      <Route path="/KeyDetailsPanel" element={<KeyDetailsPanel/>} />
      <Route path="/SignUp" element={<SignUp/>} />
      <Route path="/HomeScreen" element={<HomeScreen/>} />

    </Routes>
  </BrowserRouter>
);
