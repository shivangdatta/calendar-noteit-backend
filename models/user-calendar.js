const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  date: {
    type: Date, 
    required: true,
  },
  time: {
    type: String, 
    required: true,
    match: /^([01]\d|2[0-3]):([0-5]\d)$/, 
  },
  type: {
    type: String,
    enum: ['meeting', 'task', 'reminder', 'event'], 
    required: true,
  },
  note_title: {
    type: String,
    required: true,
  },
  note_description: {
    type: String,
  },
  reminder: {
    type: Boolean,
    default: false,
  }
});

const userCalendarSchema = new mongoose.Schema({
  user_email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/, 
  },
  events: [eventSchema], 
});

const UserCalendar = mongoose.model('UserCalendar', userCalendarSchema);

module.exports = UserCalendar;
