import express from 'express';
import mongoose from 'mongoose';

import eventPost from '../models/eventPost.js';
import User from '../models/User.js';


const router = express.Router();

//  deleteParticipant----->>>> not done >>>> approved by Aditya Agarwal


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
    const {userId} = req.user;
    const newPost = new eventPost({...post, creator: userId, createdAt: new Date().toISOString()});
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




export default router;
  

