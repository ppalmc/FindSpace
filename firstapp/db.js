const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "findspace",
  host: "localhost",
  port: 5432,
  database: "findspace"
});

module.exports = pool;