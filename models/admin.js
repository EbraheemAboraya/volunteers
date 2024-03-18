const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  fullName: { type: String, required: true },

  userName: { type: String, required: true, unique: true },

  password: { type: String, required: true },

  role: { type: String, required: true}, 

});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
