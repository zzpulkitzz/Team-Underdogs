const axios = require('axios');

const DAILY_API_URL = 'https://api.daily.co/v1';
const DAILY_API_KEY = process.env.DAILY_API_KEY; // you must add this to your .env

exports.createRoom = async (req, res) => {
  try {
    const apiRes = await axios.post(`${DAILY_API_URL}/rooms`, {}, {
      headers: { Authorization: `Bearer ${DAILY_API_KEY}` }
    });
    res.json(apiRes.data);
  } catch (e) {
    res.status(500).json({ error: e.response?.data || e.message });
  }
};

exports.getToken = async (req, res) => {
  // Use consultationId, userId, etc., from req.body for token scoping if desired
  try {
    const apiRes = await axios.post(`${DAILY_API_URL}/meeting-tokens`, req.body, {
      headers: { Authorization: `Bearer ${DAILY_API_KEY}` }
    });
    res.json(apiRes.data);
  } catch (e) {
    res.status(500).json({ error: e.response?.data || e.message });
  }
};
