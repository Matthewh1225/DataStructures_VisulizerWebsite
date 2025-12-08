
import { useEffect } from "react";

const IDLE_TIMEOUT = 10 * 60 * 1000; // 10 minutes of inactivity
const ABSOLUTE_TIMEOUT = 30 * 60 * 1000; // 30 minutes max session

function isAuthed() {
  const authUser = localStorage.getItem('authUser');
  const loginTime = localStorage.getItem('loginTime');
  const lastActivity = localStorage.getItem('lastActivity');
  if (!authUser || !loginTime || !lastActivity) return false;
  
  const now = Date.now();
  const idleTime = now - parseInt(lastActivity, 10);
  const totalTime = now - parseInt(loginTime, 10);
  
  if (idleTime > IDLE_TIMEOUT || totalTime > ABSOLUTE_TIMEOUT) {
    localStorage.removeItem('authUser');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('lastActivity');
    return false;
  }
  return true;
}

export default function Verification() {
  useEffect(() => {
    if (isAuthed()) {
      window.location.href = "/Home";
    } else {
      window.location.href = "/login";
    }
  }, []);

  return (
    <>
      <h1>Verification</h1>
      <p>Redirecting...</p>
    </>
  );
}