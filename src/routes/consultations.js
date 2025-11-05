const express = require('express');
const router = express.Router();
const { schedule, allForUser, updateStatus } = require('../controllers/consultationController');
const { authenticateToken } = require('../middleware/auth');

router.post('/schedule', authenticateToken, schedule);
router.get('/', authenticateToken, allForUser);
router.patch('/:id/status', authenticateToken, updateStatus);

module.exports = router;
