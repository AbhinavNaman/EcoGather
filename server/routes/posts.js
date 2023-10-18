import express from 'express';
import validateToken from "../middleware/validateToken.js";
const router = express.Router();

import { getPost,
  getPosts,
  getFavPosts} from '../controllers/posts.js'


router.route("/post/:id").get(validateToken, getPost)
router.route("/posts").get(validateToken, getPosts)
router.route("/favPosts").get(validateToken, getFavPosts)

export default router;