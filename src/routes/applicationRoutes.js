const express = require('express');
const { 
  getApplications, 
  getApplication, 
  createNewApplication, 
  updateApplicationById, 
  deleteApplicationById 
} = require('../controllers/applicationController');

const router = express.Router();

// Маршруты для /api/applications
router.route('/')
  .get(getApplications)
  .post(createNewApplication);

// Маршруты для /api/applications/:id
router.route('/:id')
  .get(getApplication)
  .put(updateApplicationById)
  .delete(deleteApplicationById);

module.exports = router; 