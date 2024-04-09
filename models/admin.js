const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true},
  programs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program'
  }],
  image: {
    filename: String,
    contentType: String,
    image: Buffer
  },
},{timestamps: true});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
