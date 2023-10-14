import mongoose from 'mongoose';

const eventSchema = mongoose.Schema({
    title: String,
    date: String,
    time: String,

    creator: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    location: String,
    tagline: String,
    vacancy: Number,
    participants: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    createdAt: {
        type: Date,
        default: new Date(),
    },
})

var eventPost = mongoose.model('eventPost', eventSchema);

export default eventPost;