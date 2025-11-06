const express = require('express');
const router = express.Router();
const { createRoom, getToken } = require('../controllers/dailyController');

router.post('/create-room', createRoom);
router.post('/get-token', getToken);

module.exports = router;
