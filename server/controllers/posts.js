import eventPost from "../models/event.js";
import User from "../models/user.js";

export const getPost = async (req, res) => {

    const {id} = req.params;
    const post = await eventPost.findById(id)

    if(post) {
        return res.json({postDetails: post})
    }
    res.json({msg: "Post not found"})

}

export const getPosts = async (req, res) => {
    const posts = await eventPost.find();

    if(posts) {
        return res.json({posts: posts})
    }
    res.json({msg: "Error fetching posts"})
}

export const getFavPosts = async (req, res) => {
    const {userId} = req.user;
    const posts = await User.find({_id: userId});
    const favPost = posts.favourites.populate();

    if(favPost) {
        return res.json(favPost)
    }
    res.json({msg: "Error fetching posts"})
}
