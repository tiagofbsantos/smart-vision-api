import jwt from "jsonwebtoken";

import redisClient from "../databaseClients/redisClient";
import config from "../config";

class SessionService {
  async createSession(user) {
    const { email, id } = user;

    const token = this.signToken(email);

    await this.setToken(token, id);

    return { success: "true", userData: id, token, user };
  }

  signToken(email) {
    const jwtPayload = { email };

    return jwt.sign(jwtPayload, config.jwtSecret, { expiresIn: "2 days" });
  }

  async setToken(token, id) {
    return Promise.resolve(redisClient.set(token, id));
  }
}

export default new SessionService();
