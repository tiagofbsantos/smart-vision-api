import { Request, Response, NextFunction } from "express";

import redisClient from "../../databaseClients/redisClient";
import ApiError from "../ApiError";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) throw new ApiError("Unauthorized", 401);

    const reply = await redisClient.get(authorization);
    if (!reply) throw new ApiError("Unauthorized", 401);

    next();
  } catch (err) {
    throw new ApiError("Unauthorized", 401);
  }
};
