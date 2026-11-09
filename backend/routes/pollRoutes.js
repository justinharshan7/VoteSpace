const express = require('express');
const router = express.Router();
const { createPoll, getPoll, vote, getMyPolls } = require('../controllers/pollController');
const validatePoll = require('../middleware/validatePoll');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, validatePoll, createPoll);
router.get('/mine', authMiddleware, getMyPolls);
router.get('/:id', getPoll);
router.post('/:id/vote', vote);

module.exports = router;