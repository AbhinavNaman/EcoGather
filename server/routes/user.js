import express from 'express';
import validateToken from '../middleware/validateToken.js';
const router = express.Router();

import  {
  registerUser,
  authUser,
  eventRegistration,
  favouriteHandler,
  leaderBoard,
} from '../controllers/users.js';

router.route('/register').post(registerUser);
router.route('/login').post(authUser);
router.route("/eventRegister").post(validateToken, eventRegistration);
router.route('/favourite').post(validateToken, favouriteHandler);
router.route('/leaderboard').post(leaderBoard);
export default router;