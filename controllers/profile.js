const handleProfileGet = db => (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id })
    .then(users => {
      if (users.length) res.json(users[0]);
      else res.status(400).json("Not found");
    })
    .catch(err => res.status(400).json("error getting user"));
};

const handleProfileUpdate = db => (req, res) => {
  const { id } = req.params;
  const { name, avatar } = req.body.formInput;
  db("users")
    .where({ id })
    .update({ name })
    .update({ avatar })
    .then(resp => {
      if (resp) res.json("success");
      else res.status(400).json("Unable to update");
    })
    .catch(err => res.status(400).json("error updating user"));
};

module.exports = {
  handleProfileGet,
  handleProfileUpdate
};
