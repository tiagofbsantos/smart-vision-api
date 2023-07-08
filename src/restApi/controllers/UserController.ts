import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";

import postgresClient from "../../databaseClients/postgresClient";
import clarifaiApi from "../../apiClients/clarifaiApi";
import userService from "../../services/userService";
import sessionService from "../../services/sessionService";
import ApiError from "../ApiError";
import User from "../../models/Credential";
import config from "../../config";

export const signinAuthentication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;
    const { email, password } = req.body;

    let session;

    if (authorization) {
      session = await userService.getAuthTokenId(authorization);
    } else {
      const user = await userService.handleSignin(email, password);

      if (!user) throw new ApiError("user_not_found");
      if (!user.id || !user.email) throw new ApiError("email_invalid");

      session = await sessionService.createSession(user);
    }

    res.json(session);
  } catch (error) {
    res.status(400).json(error);
    next(error);
  }
};

export const handleRegister = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) throw new ApiError("incorrect_form_submission");

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    await postgresClient.transaction(async trx => {
      const loginEmail = await trx
        .insert({ hash, email })
        .into("login")
        .returning("email");

      const users: User[] = await trx("users")
        .returning("*")
        .insert({
          email: loginEmail[0].email,
          name,
          joined: new Date()
        });

      const user = users[0];
      if (user.id && user.email) {
        sessionService.createSession(user).then(session =>
          res.json(session)
        );
      } else {
        res.status(400).json(user);
      }
    });
  } catch (error) {
    res.status(400).json("unable to register");
    next(error);
  }
}

export const handleProfileGet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const users: User[] = await postgresClient
      .select("*")
      .from("users")
      .where({ id });

    if (users.length) res.json(users[0]);
    else res.status(400).json("Not found");
  } catch (error) {
    res.status(400).json("error getting user");
    next(error);
  }
};

export const handleProfileUpdate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, avatar } = req.body.formInput;

    const response = await postgresClient("users")
      .where({ id })
      .update({ name })
      .update({ avatar });

    if (response) res.json("success");
    else res.status(400).json("Unable to update");
  } catch (error) {
    res.status(400).json("error updating user");
    next(error);
  }
};

export const handleApiCall = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await clarifaiApi.models
      .predict(config.clarifaiModel, req.body.input);

    res.json(data);
  } catch (error) {
    res.status(400).json("unable to work with API");
    next(error);
  }
};

export const handleImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.body;

    const entries = await postgresClient("users")
      .where("id", "=", id)
      .increment("entries", 1)
      .returning("entries");

    res.json(entries[0].entries);
  } catch (error) {
    res.status(400).json("unable to get entries");
    next(error);
  }
};
