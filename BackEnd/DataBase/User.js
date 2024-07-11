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
  Schedule: [{
    day: Number,
    tasks: [Array] // Assuming the array contains strings. Adjust the type as necessary.
  }]
});

// Pre-fill the Schedule with 31 days, each having an empty array for tasks
UserSchema.pre('save', function(next) {
if (this.isNew || this.isModified('Schedule')) {
  this.Schedule = [...Array(31)].map((_, index) => ({ day: index + 1, tasks: [] }));
}
next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;