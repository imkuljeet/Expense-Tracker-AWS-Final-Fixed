const User = require('../models/users');

function isStringInvalid(string) {
  if (string === undefined || string.length === 0) {
    return true;
  } else {
    return false;
  }
}

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("email is", email);

    if (
      isStringInvalid(name) ||
      isStringInvalid(email) ||
      isStringInvalid(password)
    ) {
      return res
        .status(400)
        .json({ err: "Bad Parameters, Something is missing" });
    }

    await User.create({ name, email, password });
    res.status(201).json({ message: "Successfully Created New User" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (isStringInvalid(email) || isStringInvalid(password)) {
      return res.status(400).json({ success: false, message: 'Email or password is missing' });
    }

    console.log(password);

    const user = await User.findAll({ where: { email } });

    if (user.length > 0) {
      if (user[0].password === password) {
        return res.status(200).json({ success: true, message: "User logged in successfully" });
      } else {
        return res.status(400).json({ success: false, message: 'Password is incorrect' });
      }
    } else {
      return res.status(404).json({ success: false, message: 'User does not exist' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
    signup,
    login
}