const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');

loginRouter.post('/', async (req, res) => {
    const { email,password } = req.body;
    const user = await User.findOne({ email });
    const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

    if (!(user && passwordCorrect)) {
    return res.status(401).json({ error: 'invalid username or password' });
  }

  const userForToken = {
    email: user.email,
    id: user.id,
  };

  const token = jwt.sign(userForToken, "appley");

  res.status(200).send({userId: user.id, token, email: user.email, name: user.name });
});

module.exports = loginRouter;