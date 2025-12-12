const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

function overlaps(aStart, aEnd, bStart, bEnd) {
  return (aStart < bEnd) && (bStart < aEnd);
}

exports.getAppointments = async (req, res) => {
  try {
    const appts = await Appointment.find()
      .populate('patientId')
      .populate('doctorId')
      .sort({ startAt: 1 });
    res.json(appts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id).populate('patientId').populate('doctorId');
    if (!appt) return res.status(404).json({ error: 'Appointment not found' });
    res.json(appt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createAppointment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { patientId, doctorId, startAt, endAt, notes } = req.body;
    if (!patientId || !doctorId || !startAt || !endAt) {
      throw new Error('patientId, doctorId, startAt and endAt are required');
    }
    const s = new Date(startAt);
    const e = new Date(endAt);
    if (s >= e) throw new Error('endAt must be after startAt');

    const patient = await Patient.findById(patientId).session(session);
    if (!patient) throw new Error('Patient not found');

    const doctor = await Doctor.findById(doctorId).session(session);
    if (!doctor) throw new Error('Doctor not found');

    // check for overlapping appointments for the same doctor (scheduled or completed)
    const existing = await Appointment.find({
      doctorId,
      status: { $in: ['scheduled','completed'] }
    }).session(session);

    for (const ex of existing) {
      if (overlaps(s, e, new Date(ex.startAt), new Date(ex.endAt))) {
        throw new Error('Doctor has another appointment during the requested time');
      }
    }

    const appt = new Appointment({ patientId, doctorId, startAt: s, endAt: e, notes });
    await appt.save({ session });

    await session.commitTransaction();
    session.endSession();

    const populated = await Appointment.findById(appt._id).populate('patientId').populate('doctorId');
    res.status(201).json(populated);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ error: err.message });
  }
};

exports.updateAppointment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const id = req.params.id;
    const payload = req.body;
    const appt = await Appointment.findById(id).session(session);
    if (!appt) throw new Error('Appointment not found');

    const newStart = payload.startAt ? new Date(payload.startAt) : new Date(appt.startAt);
    const newEnd = payload.endAt ? new Date(payload.endAt) : new Date(appt.endAt);
    const newDoctorId = payload.doctorId ? payload.doctorId : appt.doctorId;

    if (newStart >= newEnd) throw new Error('endAt must be after startAt');

    // check overlapping with other appointments for same doctor
    const existing = await Appointment.find({
      _id: { $ne: id },
      doctorId: newDoctorId,
      status: { $in: ['scheduled','completed'] }
    }).session(session);

    for (const ex of existing) {
      if (overlaps(newStart, newEnd, new Date(ex.startAt), new Date(ex.endAt))) {
        throw new Error('Doctor has another appointment during the requested time');
      }
    }

    // apply updates
    Object.assign(appt, payload);
    await appt.save({ session });

    await session.commitTransaction();
    session.endSession();

    const populated = await Appointment.findById(appt._id).populate('patientId').populate('doctorId');
    res.json(populated);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ error: err.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const appt = await Appointment.findById(req.params.id).session(session);
    if (!appt) throw new Error('Appointment not found');
    await appt.deleteOne({ session });
    await session.commitTransaction();
    session.endSession();
    res.json({ message: 'Appointment deleted' });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ error: err.message });
  }
};
