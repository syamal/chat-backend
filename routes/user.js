const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');


// User Controller
const userController = require('../controllers/userController');

// Register Route *Public

router.post('/register', userController.postRegister);

router.post('/login', userController.postLogin);

router.post('/', userController.getUser);

router.post('/all', userController.getAllExcpetOne);


module.exports = router;