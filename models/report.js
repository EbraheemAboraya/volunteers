const mongoose = require("mongoose");
 
const reportSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Volunteer",
  },
  programId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "program",
  },
});
 
const Report = mongoose.model("Report", reportSchema);
 
module.exports = Report;