import express from 'express';
import validateToken from "../middleware/validateToken.js";
const router = express.Router();

import { getPost,
  getPosts,
  getFavPosts} from '../controllers/posts.js'


router.route("/post/:id").get(getPost)
router.route("/posts").get(getPosts)
router.route("/favPosts").get(getFavPosts)

export default router;