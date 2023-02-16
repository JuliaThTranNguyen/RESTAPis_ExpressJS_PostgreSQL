//index.js file -- server side
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./todo")

//middleware
app.use(cors());
app.use(express.json());

//ROUTES//
//GET ALL TODO

app.get("/todos", async (req, res) => {
    try {
      const allTodos = await pool.query("SELECT * FROM todo");
      res.json(allTodos.rows);
    } catch (err) {
      console.error(err.message);
    }
  });
  
//GET A TODO
app.get("/todos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [
        id
      ]);
  
      res.json(todo.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  });

//CREATE A TODO

app.post("/todos", async (req, res) => {
    try {
      const { user_id } = req.body;
      const { name } = req.body;
      const { description } = req.body;
      const { update_status } = req.body;
      const { created_status } = req.body;
      const { login_status } = req.body;
      const newTodo = await pool.query(
        "INSERT INTO todo (user_id, name,description, update_status, created_status,login_status) VALUES($1,$2,$3,$4,$5,$6) RETURNING *",
        [newTodo.user_id,newTodo.name,newTodo.description,newTodo.update_status,newTodo.created_status,newTodo.login_status]
      );
  
      res.json(newTodo.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  });

//UPDATE A TODO

app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updateTodo = await pool.query(
      "UPDATE todo SET description = $1 WHERE todo_id = $2",
      [description, id]
    );

    res.json("Todo was updated!");
  } catch (err) {
    console.error(err.message);
  }
});

//DELETE A TODO
app.delete("/todos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [
        id
      ]);
      res.json("Todo was deleted!");
    } catch (err) {
      console.log(err.message);
    }
  });
  

app.listen(5000, () => {
    console.log("server is running on port 5000");
});



