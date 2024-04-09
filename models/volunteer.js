const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  sex: { type: String, required: true },
  age: { type: String, required: true },


  skills: [String],
  availability: [String],
  role: { type: String, required: true },
  image: {
    filename: String,
    contentType: String,
    image: Buffer
  },
},{timestamps: true});

const Volunteer = mongoose.model("Volunteer", volunteerSchema);

module.exports = Volunteer;
