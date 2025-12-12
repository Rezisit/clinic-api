const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  birthDate: { type: Date },
  email: { type: String, required: true, unique: true },
  phone: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Patient', PatientSchema);
