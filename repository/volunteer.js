const User = require("../models/volunteer");

module.exports = {
  async save(user) {
    try {
      await user.save();
    } catch (error) {
      throw new Error("Error saving user");
    }
  },

  async findByUsername(userName) {
    try {
      return await User.findOne({ userName });
    } catch (error) {
      throw new Error("Error finding user by username");
    }
  },
};
