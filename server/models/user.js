const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      index: 'text',
    },

    phoneNumber: {
        type: String,
        trim: true,
        required: true
    },

    password: {
      type: String,
      required: true,
    },
    events: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "eventPost"
        }
    ]
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
