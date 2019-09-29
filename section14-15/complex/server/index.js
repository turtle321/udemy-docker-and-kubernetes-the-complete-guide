const keys = require("./keys");

// Express App Setup
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres Client Setup
const { Pool } = require("pg");
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
});
pgClient.on("error", () => console.log("Lost PG connection"));

pgClient
  .query("CREATE TABLE IF NOT EXISTS values (number INT)")
  .catch(err => console.log(err));

// Redis Client Setup
const redis = require("redis");
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: function(options) {
    if (options.error) {
      console.log("Error Redis connection", options.error);
    }
    // reconnect after
    return 1000;
  }
});
const redisPublisher = redisClient.duplicate();

// Express route handlers

app.get("/", (req, res) => {
  res.send("Hi");
});

app.get("/values/all", async (req, res) => {
  console.log("GET /values/all");
  const values = await pgClient.query("SELECT * from values");

  res.send(values.rows);
});

app.get("/values/current", async (req, res) => {
  console.log("GET /values/current");
  redisClient.hgetall("values", (err, values) => {
    res.send(values);
    console.log("HGETALL values ", values);
    console.log("Err: ", err);
  });
});

app.post("/values", async (req, res) => {
  const index = req.body.index;
  console.log("POST /values | index=", index);

  if (parseInt(index) > 40) {
    return res.status(422).send("Index too high");
  }

  redisClient.hset("values", index, "Nothing yet!", function(err, reply) {
    console.log("HSET " + index + "\nResp:\n", reply + "\nErr:\n", err);
  });
  redisPublisher.publish("insert", index, function(err, reply) {
    console.log("PUB INSERT " + index + "\nResp:\n", reply + "\nErr:\n", err);
  });
  pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

  res.send({ working: index });
});

app.listen(5000, err => {
  console.log("Listening on port 5000");
});
