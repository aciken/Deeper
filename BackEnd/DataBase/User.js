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
    default: [
      {
        name: 'Morning Work',
        sessions: [
          ['06:00', '08:00', {name: 'mobile app', colors: ['#0EA5E9', '#60A5FA'], currentTime: '2h'}, 120,160],
          ['09:00', '11:00', {name: 'mobile app', colors: ['#0EA5E9', '#60A5FA'], currentTime: '2h'}, 180,220],
          ['12:00', '14:00', {name: 'mobile app', colors: ['#0EA5E9', '#60A5FA'], currentTime: '2h'}, 240,280]
        ]
      },
      {
        name: 'Evening Work',
        sessions: [
          ['15:00', '17:00', {name: 'mobile app', colors: ['#0EA5E9', '#60A5FA'], currentTime: '2h'}, 210,250],
          ['18:00', '20:00', {name: 'mobile app', colors: ['#0EA5E9', '#60A5FA'], currentTime: '2h'}, 270,310],
          ['21:00', '23:00', {name: 'mobile app', colors: ['#0EA5E9', '#60A5FA'], currentTime: '2h'}, 330,370]
        ]
      },
      {
        name: 'Noon Work',
        sessions: [
          ['12:00', '14:00', {name: 'mobile app', colors: ['#0EA5E9', '#60A5FA'], currentTime: '2h'}, 240,280]
        ]
      }
    ]
  }
});


const User = mongoose.model('User', UserSchema);

module.exports = User;