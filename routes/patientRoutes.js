const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/patientController');

router.get('/', ctrl.getPatients);
router.get('/:id', ctrl.getPatient);
router.post('/', ctrl.createPatient);
router.put('/:id', ctrl.updatePatient);
router.delete('/:id', ctrl.deletePatient);

module.exports = router;
