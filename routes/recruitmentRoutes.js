const express = require('express');
const router = express.Router();
const recruitmentController = require('../controllers/recruitmentController');

// Jobs
router.get('/jobs', recruitmentController.getJobs);
router.post('/jobs', recruitmentController.createJob);
router.put('/jobs/:id', recruitmentController.updateJob);

// Candidates
router.get('/candidates', recruitmentController.getCandidates);
router.post('/candidates', recruitmentController.createCandidate);

// Placements
router.get('/placements', recruitmentController.getPlacements);
router.post('/placements', recruitmentController.createPlacement);

module.exports = router;