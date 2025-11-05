const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Add to your .env

exports.transcribeAudio = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(req.file.path));
    form.append('model', 'whisper-1');

    const transcriptionRes = await axios.post('https://api.openai.com/v1/audio/transcriptions', form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${OPENAI_API_KEY}`
      }
    });
    
    // Optionally: Save transcript to DB associated with consultationId from req.body
    res.json(transcriptionRes.data);
  } catch (e) {
    res.status(500).json({ error: e.response?.data || e.message });
  } finally {
    // Clean up uploaded file
    fs.unlink(req.file.path, () => {});
  }
};
