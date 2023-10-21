import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import eventPost from '../models/event.js';
import asyncHandler from 'express-async-handler';
import AppError from '../config/AppError.js';
import nodemailer from 'nodemailer'

export const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  console.log(password);
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = await User.findOne({ email });

  if (!email || !password) {
    throw new AppError('Fill the required fields', 400);
  }

  if (user) {
    throw new AppError('User Exists', 400);
  }

  const newUser = await User.create({ email, password: hash });

  const payload = {
    id: newUser._id,
  };

  const token = jwt.sign(payload, "processenvsecrete", { expiresIn: '24h' });

  // send registration mail
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });

  async function main() {
    const info = await transporter.sendMail({
      from: process.env.NODEMAILER_USER,
      to: email,
      subject: "Ecogather Registration",
      text: "Welcome to Ecogather! Your Registration was successful!",
      html: "<b>Welcome to Ecogather! Your Registration was Successful!<br>Get ready to meet and greet Eco-Enthusiasts like yourself!</br>",
    });
    console.log("Registration message sent: %s", info.messageId);
  }

  main().catch(console.error);

  if (newUser) {
    console.log(token);
    return res
      .status(201)
      .json({ msg: 'User Created', token: token, newUser: newUser });
  }
  throw new AppError({ msg: 'Some error occured' });
});

export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!email || !password) {
    throw new AppError('Fill the required fields', 400);
  }

  if (!user) {
    throw new AppError('User does not exist!', 404);
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, "processenvsecrete", { expiresIn: '24h' });
  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    console.log(token);
    return res
      .status(200)
      .json({ msg: 'User logged in', token: token, user: user });
  }
  throw new AppError('Password is invalid', 401);
});

export const eventRegistration = async (req, res) => {

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

    res.status(200).json({ msg: "Success" })

    // send participation mail
    const userEmail = user.email;
    const eventTitle = event.title;
    const eventDate = event.date;
    const eventTime = event.time;
    const eventLocation = event.location;

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    async function main() {
      const info = await transporter.sendMail({
        from: process.env.NODEMAILER_USER,
        to: userEmail,
        subject: `Ecogather Meet: ${eventTitle}`,
        text: `Welcome to Ecogather! Your Participation request was successful!`,
        html: `<b>Hey There! Show up to ${eventTitle} at ${eventTime} on ${eventDate}.<br>Location: ${eventLocation}</br>`,
      });
      console.log("Participation message sent: %s", info.messageId);
    }

    main().catch(console.error);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const favouriteHandler = async (req, res) => {
  try {
    const userId = req.user;
    const eventId = req.body;
    const user = await User.findById(userId);

    user.favourites.push(eventId);
    await user.save();

    res.json({ msg: "Added to favourites" })

  } catch (error) {
    res.json({ msg: "Unsuccessfull" })
  }
}
