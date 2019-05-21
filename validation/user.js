const Validator = require("validator");

module.exports = userValidation = (email, username, password) => {
  if (!Validator.isEmail(email)) {
    throw new Error("Enter a proper email");
  }

  if (!Validator.isLength(username, { min: 3, max: 20 })) {
    throw new Error("Username has to be between 3-20 characters");
  }

  if (!Validator.isLength(password, { min: 6, max: 50 })) {
    throw new Error("Password has to be between 6-50 characters");
  }
};
