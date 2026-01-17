import initSqlJs from 'sql.js';
import type { Database } from 'sql.js';
let db: Database;
const DB_KEY = 'userdb';

function toBase64(bytes: Uint8Array) {
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}

function fromBase64(b64: string) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export async function initDB() {
  const SQL = await initSqlJs({
    locateFile: (file) => `/${file}`
  });
  const stored = localStorage.getItem(DB_KEY);
  db = stored ? new SQL.Database(fromBase64(stored)) : new SQL.Database();
  createUsersTable();
  persistDB();
  return db;
}

export function createUsersTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
  `;
  db.run(sql);
}

export function getDB() {
  return db;
}

export function query(sql: string, params: any = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

export function execute(sql: string, params: any = []) {
  db.run(sql, params);
  persistDB();
}

function persistDB() {
  const data = db.export();
  const b64 = toBase64(data);
  localStorage.setItem(DB_KEY, b64);
}

// Expose a function to add users from the browser console
(window as any).addUser = (username: string, password: string) => {
  try {
    execute("INSERT INTO users (username, password) VALUES ($username, $password)", { $username: username, $password: password });
    console.log(`User ${username} added successfully.`);
  } catch (err) {
    console.error("Error adding user:", err);
  }
};

// Expose a function to list users from the browser console
(window as any).listUsers = () => {
  try {
    const rows = query("SELECT id, username, password FROM users ORDER BY id", []);
    console.table(rows);
    return rows;
  } catch (err) {
    console.error("Error listing users:", err);
    return [];
  }
};