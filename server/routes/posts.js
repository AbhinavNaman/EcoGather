import express from 'express';
import validateToken from "../middleware/validateToken.js";
const router = express.Router();

import { getPost,
  getPosts,
  getFavPosts} from '../controllers/posts.js'


router.route("/post").post(getPost)
router.route("/posts").post(getPosts)
router.route("/favPosts").post(getFavPosts)

export default router;
