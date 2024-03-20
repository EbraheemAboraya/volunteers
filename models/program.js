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
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  // logo: {
  //   filename: String,
  //   contentType: String,
  //   image: Buffer
  // },
  image: {
    filename: String,
    contentType: String,
    image: Buffer
  },
  
          
});

const Program = mongoose.model('program', programSchema);

module.exports = Program;
