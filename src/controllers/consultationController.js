const { Consultation, User } = require('../models');
exports.schedule = async (req, res) => {
  const { patientId, doctorId, scheduledFor } = req.body;
  try {
    const consultation = await Consultation.create({ patientId, doctorId, scheduledFor });
    return res.status(201).json(consultation);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.allForUser = async (req, res) => {
  // Assume decoded JWT user in req.user
  const userId = req.user.id, role = req.user.role;
  try {
    const where = role === 'patient' ? { patientId: userId } : { doctorId: userId };
    const results = await Consultation.findAll({ where });
    res.json(results);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.updateStatus = async (req, res) => {
  try {
    const consultation = await Consultation.findByPk(req.params.id);
    if (!consultation) return res.status(404).json({ error: "Not found" });
    consultation.status = req.body.status;
    await consultation.save();
    res.json(consultation);
  } catch (e) { res.status(400).json({ error: e.message }); }
};
