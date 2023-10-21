import express from 'express';

import {createPost, getPrevPosts, getPost, getCurrentPost, finishPost, deleteParticipant} from '../controllers/event.js';
const router = express.Router();

router.get('/getprevposts', getPrevPosts);
router.get('/getcurrentpost', getCurrentPost);
router.get('/getpost', getPost);
router.post('/createpost', createPost);
router.post('/finish', finishPost);
router.post('/deletepost', deleteParticipant);

export default router;