const createSession = require("./session").createSession;

const handleRegister = (db, bcrypt, redisClient) => (req, res) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password)
    return res.status(400).json("incorrect form submission");
  const hash = bcrypt.hashSync(password);
  db.transaction(trx => {
    trx
      .insert({ hash, email })
      .into("login")
      .returning("email")
      .then(loginEmail => {
        return trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0],
            name,
            joined: new Date()
          })
          .then(users => {
            const user = users[0];
            if (user.id && user.email) {
              createSession(user, redisClient).then(session =>
                res.json(session)
              );
            } else return res.status(400).json(user);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch(err => res.status(400).json("unable to register"));
};

module.exports = { handleRegister };
