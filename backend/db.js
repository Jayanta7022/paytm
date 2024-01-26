const mongoose = require('mongoose');
const { number } = require('zod');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    minLength: 3,
    maxLength: 50,
  },
  password: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
    maxLength: 30,
  },
  lastname: {
    type: String,
    required: true,
    maxLength: 30,
  },
});

const User = mongoose.model('User', userSchema);

const acountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
});

const Account = mongoose.model('Acount', acountSchema);
module.exports = { User, Account };
