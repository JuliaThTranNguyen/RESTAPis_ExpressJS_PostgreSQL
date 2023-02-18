// server side -- ExpressJS & PostgreSQL
const express = require("express");
const app = express();
const port = 3000;

const cors = require("cors");
const bodyParser = require('body-parser');
const pg = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require("./todo");

app.use(cors());
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1];
    jwt.verify(bearerToken, 'secret_key', (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        req.authData = authData;
        next();
      }
    });
  } else {
    res.sendStatus(403);
  }
};

// Sign up a new user
app.post('/api/v1/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO "User" (email, password, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING id',
      [email, hashedPassword]
    );
    const user = {
      id: result.rows[0].id,
      email
    };
    const token = jwt.sign(user, 'secret_key');
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

// Sign in with email and password
app.post('/api/v1/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM "User" WHERE email = $1', [email]);
    const user = result.rows[0];
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id, email: user.email }, 'secret_key');
      res.json({ token });
    } else {
      res.status(401).send('Invalid email or password');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

// Change user's password
app.put('/api/v1/changePassword', verifyToken, async (req, res) => {
  try {
    const { id } = req.authData;
    const { oldPassword, newPassword } = req.body;
    const result = await pool.query('SELECT * FROM "User" WHERE id = $1', [id]);
    const user = result.rows[0];
    if (user && await bcrypt.compare(oldPassword, user.password)) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await pool.query('UPDATE "User" SET password = $1, updated_at = NOW() WHERE id = $2', [hashedPassword, id]);
      res.send('Password updated successfully');
    } else {
      res.status(401).send('Invalid password');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});


// GET TODOS
app.get('/api/v1/todos', async (req, res) => {
  const { status } = req.query;
  let todos;

  if (status) {
    todos = await pool.query('SELECT * FROM todo WHERE status = $1', [status]);
  } else {
    todos = await pool.query('SELECT * FROM todo');
  }

  res.json(todos.rows);
});

//POST a ToDO
app.post('/api/v1/todos', async (req, res) => {
  const { name, description, status, user_id } = req.body;

  const newTodo = await pool.query(
    'INSERT INTO todo (name, description, user_id, created_at, updated_at, status) VALUES ($1, $2, $3, NOW(), NOW(), $4) RETURNING *',
    [name, description, user_id, status]
  );

  res.json(newTodo.rows[0]);
});

// UPDATE A TODO
app.put('/api/v1/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, status } = req.body;

  const updatedTodo = await pool.query(
    'UPDATE todo SET name = $1, description = $2, status = $3, updated_at = NOW() WHERE id = $4 RETURNING *',
    [name, description, status, id]
  );

  res.json(updatedTodo.rows[0]);
});


// DELETE A TODO
app.delete('/api/v1/todos/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query('DELETE FROM Todo WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Todo item not found' });
    }

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

  

app.listen(5000, () => {
    console.log("server is running on port 5000");
});



