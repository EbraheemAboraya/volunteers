const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  volunteers: {
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
