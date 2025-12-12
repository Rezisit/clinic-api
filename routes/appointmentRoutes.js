const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/appointmentController');

router.get('/', ctrl.getAppointments);
router.get('/:id', ctrl.getAppointment);
router.post('/', ctrl.createAppointment);
router.put('/:id', ctrl.updateAppointment);
router.delete('/:id', ctrl.deleteAppointment);

module.exports = router;
