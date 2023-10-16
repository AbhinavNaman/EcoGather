const express = require('express');
const validateToken = require("../middleware/validateToken")
const router = express.Router();

const {
  getPost,
  getPosts,
  getFavPosts
} = require('../controllers/posts');


router.route("/post/:id").get(validateToken, getPost)
router.route("/posts").get(validateToken, getPosts)
router.route("/favPosts").get(validateToken, getFavPosts)

module.exports = router;