import bcrypt from "bcrypt";
import postgresClient from "../databaseClients/postgresClient";
import redisClient from "../databaseClients/redisClient";
import ApiError from "../restApi/ApiError";

class UserService {
  async getAuthTokenId(authorization) {
    try {
      const session = await redisClient.get(authorization);

      if (!session) throw new ApiError("unauthorized", 401);

      return { id: session };
    } catch (err) {
      throw new ApiError("unauthorized", 401);
    }
  }

  async handleSignin(email: string, password: string) {
    if (!email || !password) throw new ApiError("incorrect_form_submission");

    const login = await postgresClient
      .select("hash", "email")
      .from("login")
      .where("email", "=", email);

    const isValid = bcrypt.compareSync(password, login[0].hash);
    if (!isValid) throw new ApiError("wrong_credentials");

    const users = await postgresClient
      .select("*")
      .from("users")
      .where("email", "=", email);

    if (!users || users.length === 0) throw new ApiError("unable_to_get_user");

    return users[0];
  }
}

export default new UserService();
