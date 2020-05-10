const createSession = require("./session").createSession;

const signinAuthentication = (db, bcrypt, redisClient) => (req, res) => {
  const { authorization } = req.headers;
  return authorization
    ? getAuthTokenId(req, res, redisClient)
    : handleSignin(db, bcrypt, req, res)
        .then(user =>
          user.id && user.email
            ? createSession(user, redisClient)
            : Promise.reject(user)
        )
        .then(session => res.json(session))
        .catch(err => res.status(400).json(err));
};

const getAuthTokenId = (req, res, redisClient) => {
  const { authorization } = req.headers;
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(401).send("Unauthorized");
    }
    return res.json({ id: reply });
  });
};

const handleSignin = (db, bcrypt, req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return Promise.reject("incorrect form submission");
  return db
    .select("hash", "email")
    .from("login")
    .where("email", "=", email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then(users => users[0])
          .catch(err => Promise.reject("unable to get user"));
      } else return Promise.reject("wrong credentials");
    })
    .catch(err => Promise.reject("Error wrong credentials"));
};

module.exports = { signinAuthentication };
