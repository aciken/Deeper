const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Deeper')
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log(err));

const UserSchema = new mongoose.Schema({
  name: {
      type: String,
      required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  verify:{
      type: Number,
      default: 0
  },
  array: {
    type: Array,
    default: () => new Array(31).fill([]) 
  },
  workSessions: {
    type: Array,
    default: []
  },
  allArray: {
    type: Array,
    default: []
  },
  work: {
    type: Array,
    default: []
  },
  preset: {
    type: Array,
    default: []
  },
  tracker: {
    type: Object,
    default: {
      daily: {
        daily: 0,
        morning: 0,
        afternoon: 0,
        project: 0
      },
      general: {
        general: 0,
        morning: 0,
        afternoon: 0,
        project: 0
      }
    }
  },
  points: {
    type: Object,
    default: {
      current: 0,
      currentDaily: [0,1],
      currentGeneral: [0],
      currentGeneralPlus: [0],
    }
  }
});


const User = mongoose.model('User', UserSchema);

module.exports = User;