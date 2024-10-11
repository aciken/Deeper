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
  goals: {
    type: Array,
    default: []
  }
});


const User = mongoose.model('User', UserSchema);

module.exports = User;