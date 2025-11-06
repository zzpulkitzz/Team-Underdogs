const { Chat } = require('../models');
exports.history = async (req, res) => {
  try {
    const messages = await Chat.findAll({
      where: { consultationId: req.params.consultationId },
      order: [['sentAt', 'ASC']],
    });
    res.json(messages);
  } catch (e) { res.status(500).json({ error: e.message }); }
};
