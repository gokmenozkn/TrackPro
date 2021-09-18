const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const axios = require("axios").default;
const CoinGecko = require("coingecko-api");

//2. Initiate the CoinGecko API Client
const CoinGeckoClient = new CoinGecko();

const app = express();
const port = 3000;

const pool = new Pool({
  user: "postgres",
  password: "1234",
  database: "api",
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

pool
  .connect()
  .then(() => console.log("Connected"))
  .catch((err) => console.log(err));

app.get("/", async (req, res) => {
  const data = await pool.query("SELECT NOW()");
  res.send({ data: data.rows[0] });
});

// get users
app.get("/api/users", async (req, res) => {
  const data = await pool.query("SELECT * FROM users");
  res.send({ data: data.rows });
});

// get a user
app.get("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    res.send({ data: user.rows[0] });
  } catch (e) {
    console.error(e);
  }
});

// create user
app.post("/api/users/create", async (req, res) => {
  const { name, email } = req.body;

  pool
    .query("INSERT INTO users (name, email) VALUES ($1, $2)", [name, email])
    .then((value) => {
      res.send({ value }).status(201);
    })
    .catch((e) => console.log(e));
});

// delete user
app.delete("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteUser = await pool.query("DELETE FROM users WHERE id = $1", [
      id,
    ]);
    res.send({ message: "User deleted" });
  } catch (e) {
    console.error(e);
  }
});

// Get cryptocurrencies
app.get("/currencies", async (req, res) => {
  try {
    let response = await CoinGeckoClient.coins.all({
      sparkline: true,
    });
    res.send(response.data);
  } catch (err) {
    res.send(err);
  }
});

app.get("/bitcoin", async (req, res) => {
  try {
    let response = await CoinGeckoClient.coins.fetchMarketChart('bitcoin', {
      days: 5
    })
    res.send(response);
  } catch (err) {
    res.send(err);
  }
});

app.listen(port, () => {
  console.log(`Server is listening on: ${port}`);
});
