const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program' 
    },
    volunteers: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Volunteer'
    },
    content: {
        type: String,
        required: true
    }
});    

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;