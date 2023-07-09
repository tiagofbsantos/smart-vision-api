import { createClient } from "redis";
import config from "../config";

export default createClient({
  url: config.redisURI
});
