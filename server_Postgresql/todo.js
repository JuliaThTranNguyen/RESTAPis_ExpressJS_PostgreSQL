const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password:"123@@!Me",
    host:"localhost",
    port: 5432,
    database: "todo_item"
});

module.exports = pool;