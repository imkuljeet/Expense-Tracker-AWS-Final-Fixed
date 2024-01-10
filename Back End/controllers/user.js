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

module.exports = {
    signup
}