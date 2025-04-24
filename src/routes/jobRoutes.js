const express = require('express');
const { 
  getJobs, 
  getJob, 
  createNewJob, 
  updateJobById, 
  deleteJobById 
} = require('../controllers/jobController');

const router = express.Router();

// Маршруты для /api/jobs
router.route('/')
  .get(getJobs)
  .post(createNewJob);

// Маршруты для /api/jobs/:id
router.route('/:id')
  .get(getJob)
  .put(updateJobById)
  .delete(deleteJobById);

module.exports = router; 