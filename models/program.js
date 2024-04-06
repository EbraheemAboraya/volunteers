const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  maxVolunteer: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  image: {
    filename: String,
    contentType: String,
    image: Buffer
  },
  volunteers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer'
  }],
  Acceptedvolunteers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer'
  }]
});

const Program = mongoose.model('program', programSchema);

module.exports = Program;
