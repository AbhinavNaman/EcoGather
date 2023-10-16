const express = require('express');
const validateToken = require("../middleware/validateToken")
const router = express.Router();

const {
  registerUser,
  authUser,
} = require('../controllers/users');

router.route('/register').post(registerUser);
router.route('/login').post(authUser);
router.route("/eventRegister").post(validateToken, eventRegistration);
router.route('/favourite').post(validateToken, favouriteHandler);

module.exports = router;