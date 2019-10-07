const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');


// Message Controller
const messageController = require('../controllers/messageController');


router.post('/new', messageController.postMessage);

router.post('/all', messageController.getAllMessagesForTheClient);

module.exports = router;