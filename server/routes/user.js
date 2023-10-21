import express from 'express';
import validateToken from '../middleware/validateToken.js';
const router = express.Router();

import  {
  registerUser,
  authUser,
  eventRegistration,
  favouriteHandler,
} from '../controllers/users.js';

router.route('/register').post(registerUser);
router.route('/login').post(authUser);
<<<<<<< HEAD
router.route("/eventRegister/:eventId").post(eventRegistration);
router.route('/favourite').post(favouriteHandler);
router.route('/leaderboard').get(leaderBoard);
=======
router.route("/eventRegister").post(validateToken, eventRegistration);
router.route('/favourite').post(validateToken, favouriteHandler);
>>>>>>> 1684b56 (leaderboard done)
export default router;