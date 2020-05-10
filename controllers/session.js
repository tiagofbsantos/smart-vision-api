const jwt = require("jsonwebtoken");

const createSession = (user, redisClient) => {
  const { email, id } = user;
  const token = signToken(email);
  return setToken(token, id, redisClient)
    .then(() => {
      return { success: "true", userData: id, token, user };
    })
    .catch(console.log);
};

const signToken = email => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, process.env.JWTSECRET, { expiresIn: "2 days" });
};

const setToken = (token, id, redisClient) => {
  return Promise.resolve(redisClient.set(token, id));
};

module.exports = { createSession };
