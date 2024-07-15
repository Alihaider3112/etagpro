import mongoose from 'mongoose';
const { Schema } = mongoose;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const usersSchema = new Schema({
    first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return emailRegex.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  password: {
    type: String,
    required: true
  }
})
module.exports = mongoose.models.users || mongoose.model('users', usersSchema);