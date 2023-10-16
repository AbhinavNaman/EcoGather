const eventPost = require("../models/event")
const User = require("../models/users.js")

const getPost = async (req, res) => {
    const id = req.params;
    const post = await eventPost.findById(id)

    if(post) {
        return res.json({postDetails: post})
    }
    res.json({msg: "Post not found"})

}

const getPosts = async (req, res) => {
    const posts = await eventPost.find();

    if(posts) {
        return res.json({posts: posts})
    }
    res.json({msg: "Error fetching posts"})
}

const getFavPosts = async (req, res) => {
    const {userId} = req.user;
    const posts = await User.find({_id: userId});
    const favPost = posts.favourites.populate();

    if(favPost) {
        return res.json(favPost)
    }
    res.json({msg: "Error fetching posts"})
}


module.exports = {getPost, getPosts, getFavPosts}