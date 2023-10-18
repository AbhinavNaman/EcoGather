import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      index: 'text',
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
    ],
    favourites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "eventPost"
      }
    ]

  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
