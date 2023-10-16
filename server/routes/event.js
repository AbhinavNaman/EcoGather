import express from 'express';

import {createPost, getPrevPosts, getPost, getCurrentPost, finishPost, deleteParticipant} from '../controllers/event.js';

const router = express.Router();
import validateToken from "../middleware/validateToken.js";

router.get('/',validateToken, getPrevPosts);
router.get('/:id', getCurrentPost);
router.get('/:id', getPost);
router.post('/', validateToken,  createPost);
router.delete('/:id', validateToken, finishPost);
router.post('/', deleteParticipant);

export default router;