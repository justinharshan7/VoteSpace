const Poll = require('../models/Poll');

exports.createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;
    const poll = await Poll.create({
      createdBy: req.userId,
      question,
      options: options.map(text => ({ text, votes: 0 }))
    });
    res.status(201).json(poll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ error: 'Poll not found' });
    res.json(poll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.vote = async (req, res) => {
  try {
    const { optionIndex } = req.body;
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ error: 'Poll not found' });
    poll.options[optionIndex].votes += 1;
    await poll.save();
    res.json(poll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyPolls = async (req, res) => {
  try {
    const polls = await Poll.find({ createdBy: req.userId })
      .select('question options createdAt')
      .sort({ createdAt: -1 });
    res.json(polls);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load your polls' });
  }
};