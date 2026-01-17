import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import pg from 'pg';

const { Pool } = pg;
const app = express();
const PORT = process.env.PORT || 4000;

// PostgreSQL connection pool
const pool = new Pool({
  database: 'datastructures_visualizer',
  // If you set a password during postgres setup, uncomment below:
  // user: 'your_username',
  // password: 'your_password',
  // host: 'localhost',
  // port: 5432,
});

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: false,
}));
app.use(express.json());

// Initialize DB schema
async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database initialized');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}
initDb();

app.post('/signup', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2)',
      [username.trim(), hash]
    );
    res.status(201).json({ ok: true });
  } catch (err) {
    if (err.code === '23505') { // Unique violation code in Postgres
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
    await pool.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2)',
      [username.trim(), hash]
    );
    res.status(201).json({ ok: true });
  } catch (err) {
    if (err.code === '23505') {
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
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username.trim()]
    );
    const user = result.rows[0];
    
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
  try {
    const result = await pool.query('SELECT id, username, created_at FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error('Users list error:', err);
    return res.status(500).json({ error: 'list_failed' });
  }
});

// POST /bcrypt: Hash a password sent in the request body
app.post('/bcrypt', async (req, res) => {
  const { password } = req.body || {};
  if (!password) {
    return res.status(400).json({ error: 'password is required' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    res.json({ hashedPassword });
  } catch (err) {
    console.error('Bcrypt error:', err);
    res.status(500).json({ error: 'bcrypt_failed' });
  }
});
// Ignore Chrome DevTools well-known requests
app.get('/.well-known/*', (_req, res) => res.status(204).end());

app.listen(PORT, () => {
  console.log(`Auth API running on http://localhost:${PORT}`);
});
