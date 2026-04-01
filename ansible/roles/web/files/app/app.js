const express = require('express');
const mysql = require('mysql2');
const redis = require('redis');
require('dotenv').config();

const app = express();
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const redisClient = redis.createClient({
  url: `redis://${process.env.DB_HOST}:6379`
});
redisClient.connect();

// Home
app.get("/", (req, res) => {
  res.send(`Hello from ${process.env.NODE_NAME}`);
});

// Signup
app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  db.query("INSERT INTO users (username, password) VALUES (?, ?)",
    [username, password],
    () => res.send("User created")
  );
});

// Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query("SELECT * FROM users WHERE username=? AND password=?",
    [username, password],
    (err, result) => {
      if (result.length > 0)
        res.send(`Login success from ${process.env.NODE_NAME}`);
      else
        res.send("Invalid user");
    });
});

app.listen(process.env.PORT);