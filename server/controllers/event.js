import express from 'express';
import eventPost from '../models/event.js';
import User from '../models/user.js';


const router = express.Router();


export const getPrevPosts = async (req, res) =>{
    const {userId} = req.user;
    // console.log(page);
    try {
        const user = await User.findById(userId);
        const prevEvents = user.populate("events");
        res.status(200).json(prevEvents);
        
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}


export const getCurrentPost = async (req, res) => { 
    const {userId} = req.user;

    try {
        const user = await User.findById(userId);
        const prevEvents = user.populate("events");
        const requiredEvent = prevEvents.filter({completed:false});
        res.status(200).json(requiredEvent);

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPost = async (req, res) => { 
    const {userId} = req.user;
    const { eventId } = req.params;

    try {
        const user = await User.findById(userId);
        const prevEvents = user.populate("events");
        const requiredEvent = prevEvents.filter({_id: eventId});
        res.status(200).json(requiredEvent);

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPost = async (req, res) =>{
    const post = req.body;
    const newPost = new eventPost({...post, createdAt: new Date().toISOString()});
    try {
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({error: error.message});
    }
}

export const finishPost = async (req, res) => {
    const { eventId } = req.params;

    try {
        const updatedPost = await eventPost.findByIdAndUpdate(eventId,{completed:true},{new:true});
        res.status(200).json(updatedPost);

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


  

