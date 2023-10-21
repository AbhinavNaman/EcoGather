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

    const { userId } = req.body;
    const posts = await User.find({ _id: userId });
    

    const user = await User.findOne({ _id: userId }).populate('favourites');


    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const favPost = user.favourites;

    if (favPost) {
      return res.json(favPost);
    } else {
    
      res.status(404).json({ msg: "No favorite posts found" });
    }

}
