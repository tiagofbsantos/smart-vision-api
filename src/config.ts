import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 3005;

const postgresURI = process.env.POSTGRES_URI || "postgres://postgres:secret@localhost:5432/smart-vision-api-postgres";
const redisURI = process.env.REDIS_URI || "redis://localhost:6379";

const clarifaiApiKey = process.env.CLARIFAI_API_KEY;
const jwtSecret = process.env.JWT_SECRET || "";

export default {
  port,

  postgresURI,
  redisURI,

  clarifaiApiKey,
  jwtSecret
};
