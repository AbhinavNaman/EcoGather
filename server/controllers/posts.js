const eventPost = require("../models/event")

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

module.exports = {getPost, getPosts}