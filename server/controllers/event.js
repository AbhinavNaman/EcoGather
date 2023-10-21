import eventPost from '../models/event.js';
import User from '../models/user.js';
import nodemailer from 'nodemailer'
import PDFDocument from 'pdfkit'
import fs from 'fs'

export const leaderBoard = async (req, res) => {
    try {
        const users = await User.find().sort({ noOfCertificate: -1 }).exec();

        if (users) {
            res.status(200).json({ users: users });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message }); // You may want to send an error response here.
    }
}

export const getPrevPosts = async (req, res) => {
    const { userId } = req.body;
    try {
        const prevPosts = await eventPost.find({ creator: userId, completed: true });
        res.status(200).json({ prevPosts: prevPosts });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const getCurrentPost = async (req, res) => {
    const { userId } = req.body;

    try {
        const currentPosts = await eventPost.find({ creator: userId, completed: false });
        res.status(200).json({ currentPosts: currentPosts });

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPost = async (req, res) => {
  const { eventId } = req.body;

  try {
    const requiredPosts = await eventPost
      .findById(eventId)
      .populate('participants')
      .exec();

    if (!requiredPosts) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json(requiredPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


export const createPost = async (req, res) => {
    const post = req.body;
    const newPost = new eventPost({ ...post, createdAt: new Date().toISOString() });
    try {
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
}

export const finishPost = async (req, res) => {
    const { eventId } = req.body;
    try {
        const updatedPost = await eventPost.findByIdAndUpdate({ _id: eventId }, { completed: true }, { new: true });
        res.status(200).json(updatedPost);

        const participantObjectIDs = updatedPost.participants;
        const users = await User.find({ _id: { $in: participantObjectIDs } }, 'email'); // RECHECK THIS

        // generate certificate
        function generatePDF(callback, name, email) {
            const doc = new PDFDocument({
                layout: "landscape",
                size: "A4",
            });

            // The name
            // const certificateInput = name;
            // Draw the certificate image
            // doc.image("images/certificate.png", 0, 0, { width: 842 });
            // Set the font to Dancing Script
            // doc.font("fonts/DancingScript-VariableFont_wght.ttf");
            // Draw the name
            doc.fontSize(60).text(name, 20, 265, {
                align: "center"
            });

            // Save the PDF to a file
            const filePath = `${name}.pdf`;
            doc.pipe(fs.createWriteStream(filePath));
            doc.end();

            callback(filePath, name, email);
        }

        function sendEmailWithAttachment(filePath, name, email) {
            const sender = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.NODEMAILER_USER,
                    pass: process.env.NODEMAILER_PASS,
                },
            });

            // Define the email options
            const mailOptions = {
                from: process.env.NODEMAILER_USER,
                to: email,
                subject: 'Your EcoGather Certificate!',
                text: 'Please find the attached certificate below.',
                attachments: [
                    {
                        filename: `${name}.pdf`,
                        path: filePath,
                        contentType: 'application/pdf',
                    },
                ],
            };

            // Send the email
            sender.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error occurred while sending email:', error);
                } else {
                    console.log('Email sent:', info.response);
                }
            });
        }

        const userEmails = users.map(user => user.email);
        userEmails.map((email) => {
            generatePDF(sendEmailWithAttachment, email, email);
        })

    } catch (error) {
        res.status(404).json({ message: error.message });
    }

}

export const deleteParticipant = async (req, res) => {
    const { userId } = req.body;
    const { eventId } = req.params;

    try {
        // Find the user by their ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the event by its ID and populate the 'participants' field
        const event = await eventPost.findById(eventId).populate('participants');

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Find the index of the user's ID in the 'participants' array
        const participantIndex = event.participants.findIndex(participant => participant._id == userId);

        if (participantIndex !== -1) {
            // Remove the user's reference from the 'participants' array
            event.participants.splice(participantIndex, 1);

            // Save the event to persist the changes
            await event.save();

            return res.status(200).json({ message: 'Participant removed' });
        } else {
            return res.status(404).json({ message: 'Participant not found in the event' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
