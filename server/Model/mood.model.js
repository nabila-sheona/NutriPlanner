const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mood: {
    type: String,
    required: true,
    enum: ['Happy', 'Sad', 'Stressed', 'Energetic', 'Calm']
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Mood = mongoose.model('Mood', moodSchema);

module.exports = Mood;