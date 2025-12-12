const Doctor = require('../models/Doctor');

exports.getDoctors = async (req, res) => {
  try {
    const docs = await Doctor.find().sort({ name: 1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDoctor = async (req, res) => {
  try {
    const d = await Doctor.findById(req.params.id);
    if (!d) return res.status(404).json({ error: 'Doctor not found' });
    res.json(d);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createDoctor = async (req, res) => {
  try {
    const { name, specialty } = req.body;
    if (!name || !specialty) return res.status(400).json({ error: 'name and specialty required' });
    const doctor = new Doctor({ name, specialty });
    await doctor.save();
    res.status(201).json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateDoctor = async (req, res) => {
  try {
    const updated = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Doctor not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    const deleted = await Doctor.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Doctor not found' });
    res.json({ message: 'Doctor deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
