const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./database.db');

// users table
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT
  )
`);

// tasks table with user_id
db.run(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    status TEXT,
    user_id INTEGER
  )
`);

app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

// signup
app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  db.run(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, password],
    function (err) {
      if (err) return res.send('Error saving user');
      res.send('User created');
    }
  );
});

// login (returns user id)
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password],
    (err, row) => {
      if (err) return res.send('Error');

      if (row) {
        res.json({ message: 'Login successful', user_id: row.id });
      } else {
        res.send('Invalid username or password');
      }
    }
  );
});

// add task
app.post('/tasks', (req, res) => {
  const { title, user_id } = req.body;

  db.run(
    'INSERT INTO tasks (title, status, user_id) VALUES (?, ?, ?)',
    [title, 'pending', user_id],
    function (err) {
      if (err) return res.send('Error adding task');
      res.send('Task added');
    }
  );
});

// get tasks for specific user
app.get('/tasks/:user_id', (req, res) => {
  const { user_id } = req.params;

  db.all(
    'SELECT * FROM tasks WHERE user_id = ?',
    [user_id],
    (err, rows) => {
      if (err) return res.send('Error fetching tasks');
      res.json(rows);
    }
  );
});

// delete task
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM tasks WHERE id = ?', id, function (err) {
    if (err) return res.send('Error deleting task');
    res.send('Task deleted');
  });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
