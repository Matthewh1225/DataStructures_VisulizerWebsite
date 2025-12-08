import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Components/Login.tsx';
import Verification from './Components/Verification.tsx';

// Small dev helper to add users via backend from the browser console
(window as any).addUser = async (username: string, password: string) => {
  const res = await fetch('http://localhost:4000/admin/add-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({} as any));
    console.error('addUser failed', body.error || res.statusText);
  } else {
    console.log(`User ${username} added.`);
  }
};

// Helper to list all users from backend
(window as any).listUsers = async () => {
  const res = await fetch('http://localhost:4000/users');
  if (!res.ok) {
    console.error('listUsers failed', res.statusText);
    return [];
  }
  const users = await res.json();
  console.table(users);
  return users;
};

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    {/* Define the routes for the application */}
    <Routes>
      <Route path="/" element={<Verification />} />
      <Route path="/login" element={<Login />} />
      <Route path="/Home" element={<App />} />
    </Routes>
  </BrowserRouter>
);
