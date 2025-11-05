const express = require('express');
const router = express.Router();
const { history } = require('../controllers/chatController');
router.get('/:consultationId', history);
module.exports = router;
