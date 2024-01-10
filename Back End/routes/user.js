const express = require('express');
const router = express.Router();

const User = require('../models/users');
const userController = require('../controllers/user');

router.post('/signup', userController.signup);


module.exports = router;