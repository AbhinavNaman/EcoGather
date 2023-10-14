import mongoose from 'mongoose';

const eventSchema = mongoose.Schema({
    title: String,
    date: String,
    time: String,
    name: String,
    creator: String,
    location: String,
    tagline:String,
    vac: Number,
    participant: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    selectedFile: String,
    createdAt: {
        type: Date,
        default: new Date(),
    },
})

var eventPost = mongoose.model('eventPost', eventSchema);

export default eventPost;