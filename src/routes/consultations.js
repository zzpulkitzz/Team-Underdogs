const express = require('express');
const router = express.Router();
const { schedule, allForUser, updateStatus } = require('../controllers/consultationController');
router.post('/schedule', schedule);
router.get('/', allForUser);
router.patch('/:id/status', updateStatus);
module.exports = router;
