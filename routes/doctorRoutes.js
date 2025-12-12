const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/doctorController');

router.get('/', ctrl.getDoctors);
router.get('/:id', ctrl.getDoctor);
router.post('/', ctrl.createDoctor);
router.put('/:id', ctrl.updateDoctor);
router.delete('/:id', ctrl.deleteDoctor);

module.exports = router;
