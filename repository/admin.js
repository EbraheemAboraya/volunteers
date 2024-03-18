const adminSchema = require("../models/admin");

module.exports = {
  async save(fullName, userName, password, role) {
    try {
      const newAdmin = new adminSchema({
        fullName,
        userName,
        password,
        role,
      });
      return await newAdmin.save();
    } catch (error) {
      throw new Error("Error saving user");
    }
  },

  async findByUsername(userName) {
    try {
      const admin = await adminSchema.findOne({ userName });
      return admin;
    } catch (error) {
      throw new Error("Error finding user by username");
    }
  },
};
