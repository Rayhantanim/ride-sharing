const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
  type: String,
  required: [true, 'Password is required'],
  minlength: [8, 'Password must be at least 8 characters'],
  validate: [
    {
      validator: (v) => /[A-Z]/.test(v),
      message: 'Password must contain at least one uppercase letter',
    },
    {
      validator: (v) => /[0-9]/.test(v),
      message: 'Password must contain at least one number',
    },
  ],
  select: false,
},
    provider: {
      type: String,
      enum: ['password', 'google'],
      default: 'password',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);