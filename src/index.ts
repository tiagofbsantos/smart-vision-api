import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt-nodejs";
import cors from "cors";
import morgan from "morgan";

import redisClient from "./databaseClients/redisClient";
import createAuthorizedOnlySecurityMiddlewares from "./restApi/middlewares/security/createAuthorizedOnlySecurityMiddlewares";
import * as UserController from "./restApi/controllers/UserController";
import config from "./config";

(async () => {
  try {
    await redisClient.connect();

    const app = express();
    app.use(cors());
    app.use(bodyParser.json());
    app.use(morgan("combined"));

    app.get("/", (req, res) => res.send("It is working!"));

    app.post("/signin", UserController.signinAuthentication(bcrypt));
    app.post("/register", UserController.handleRegister(bcrypt));

    const securityMiddlewares = createAuthorizedOnlySecurityMiddlewares();

    app.get("/profile/:id", securityMiddlewares, UserController.handleProfileGet);
    app.post("/profile/:id", securityMiddlewares, UserController.handleProfileUpdate);

    app.put("/image", securityMiddlewares, UserController.handleImage);
    app.post("/imageurl", securityMiddlewares, UserController.handleApiCall);

    app.listen(config.port, () =>
      console.log(`app is running on port ${config.port}`)
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
