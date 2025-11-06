const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { transcribeAudio } = require('../controllers/transcriptionController');

router.post('/', upload.single('audio'), transcribeAudio);

module.exports = router;
