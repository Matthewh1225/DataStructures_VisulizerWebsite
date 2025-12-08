import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import sqlite3 from 'sqlite3';

const app = express();
const PORT = process.env.PORT || 4000;
const DB_PATH = './data.sqlite';
const db = new sqlite3.Database(DB_PATH);

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: false,
}));
app.use(express.json());

// Initialize DB schema
function initDb() {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
  );
}
initDb();

function run(query, params = []) {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function get(query, params = []) {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

app.post('/signup', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    await run('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username.trim(), hash]);
    res.status(201).json({ ok: true });
  } catch (err) {
    if (err && err.message && err.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'username already exists' });
    }
    console.error('Signup error:', err);
    res.status(500).json({ error: 'signup_failed' });
  }
});

// Dev/admin helper to add a user (no auth; restrict in production)
app.post('/admin/add-user', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    await run('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username.trim(), hash]);
    res.status(201).json({ ok: true });
  } catch (err) {
    if (err && err.message && err.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'username already exists' });
    }
    console.error('Admin add user error:', err);
    res.status(500).json({ error: 'add_user_failed' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }
  try {
    const user = await get('SELECT * FROM users WHERE username = ?', [username.trim()]);
    if (!user) {
      return res.status(401).json({ error: 'invalid_credentials' });
    }
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: 'invalid_credentials' });
    }
    res.json({ ok: true, user: { id: user.id, username: user.username } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'login_failed' });
  }
});

// Simple users list endpoint (dev only)
app.get('/users', async (_req, res) => {
  db.all('SELECT id, username, created_at FROM users', [], (err, rows) => {
    if (err) {
      console.error('Users list error:', err);
      return res.status(500).json({ error: 'list_failed' });
    }
    res.json(rows);
  });
});

// Ignore Chrome DevTools well-known requests
app.get('/.well-known/*', (_req, res) => res.status(204).end());

app.listen(PORT, () => {
  console.log(`Auth API running on http://localhost:${PORT}`);
});
