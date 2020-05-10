const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const morgan = require("morgan");

const handleRegister = require("./controllers/register").handleRegister;
const signinAuthentication = require("./controllers/signin")
  .signinAuthentication;
const profile = require("./controllers/profile");
const image = require("./controllers/image");
const requireAuth = require("./controllers/authorization").requireAuth;

const knex = require("knex");
const db = knex({
  client: "pg",
  connection: process.env.POSTGRES_URI
});

const redis = require("redis");
const redisClient = redis.createClient(process.env.REDIS_URI);

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("combined"));

app.get("/", (req, res) => res.send("It is working!"));
app.post("/signin", signinAuthentication(db, bcrypt, redisClient));
app.post("/register", handleRegister(db, bcrypt, redisClient));
app.get("/profile/:id", requireAuth(redisClient), profile.handleProfileGet(db));
app.post(
  "/profile/:id",
  requireAuth(redisClient),
  profile.handleProfileUpdate(db)
);
app.put("/image", requireAuth(redisClient), image.handleImage(db));
app.post("/imageurl", requireAuth(redisClient), image.handleApiCall());

app.listen(process.env.PORT, () =>
  console.log(`app is running on port ${process.env.PORT}`)
);
