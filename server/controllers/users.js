const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
const eventPost = require("../models/event ")
const asyncHandler = require('express-async-handler');
const AppError = require('../config/AppError');

const registerUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = await User.findOne({ username });

  if (!username || !password) {
    throw new AppError('Fill the required fields', 400);
  }

  if (user) {
    throw new AppError('User Exists', 400);
  }

  const newUser = await User.create({ username, password: hash });

  const payload = {
    id: newUser._id,
  };

  const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '24h' });

  if (newUser) {
    console.log(token);
    return res
      .status(201)
      .json({ msg: 'User Created', token: token, newUser: newUser });
  }
  throw new AppError({ msg: 'Some error occured' });
});

const authUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!username || !password) {
    throw new AppError('Fill the required fields', 400);
  }

  if (!user) {
    throw new AppError('User does not exist!', 404);
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '24h' });
  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    console.log(token);
    return res
      .status(200)
      .json({ msg: 'User logged in', token: token, user: user });
  }
  throw new AppError('Password is invalid', 401);
});

const eventRegistration = async (req, res) => {
  
    const { userId } = req.body;
    const { eventId } = req.params;

    try {
        // Find the user by their ID
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.events.push(eventId);

        await user.save()

        // Find the event by its ID and populate the 'participants' field
        const event = await eventPost.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        
        event.participants.push(userId)

        await event.save();

        res.status(200).json({msg: "Success"})
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const favouriteHandler = async(req, res) => {
  try {
    const userId = req.user;
    const eventId = req.body;
    const user = await User.findById(userId);

    user.favourites.push(eventId);
    await user.save();

    res.json({msg: "Added to favourites"})

  } catch (error) {
    res.json({msg: "Unsuccessfull"})
  }
}

module.exports = { registerUser, authUser, eventRegistration }