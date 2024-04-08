const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  address: {
    type: String,
  },
  maxVolunteer: {
    type: Number,
  },
  type: {
    type: String,
  },

  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },

  volunteers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer'
  }],
  Acceptedvolunteers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer'
  }],
  image: {
    filename: String,
    contentType: String,
    image: Buffer
  },
  
});

const Program = mongoose.model('program', programSchema);

module.exports = Program;
