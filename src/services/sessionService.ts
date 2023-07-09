import jwt from "jsonwebtoken";

import redisClient from "../databaseClients/redisClient";
import User from "../models/User";
import config from "../config";

class SessionService {
  async createSession(user: User) {
    const { email, id } = user;

    const token = this.signToken(email);

    await this.setToken(token, id);

    return { success: "true", userData: id, token, user };
  }

  signToken(email: string) {
    const jwtPayload = { email };

    return jwt.sign(jwtPayload, config.jwtSecret, { expiresIn: "2 days" });
  }

  async setToken(token: string, id: string) {
    return await redisClient.set(token, id);
  }
}

export default new SessionService();
