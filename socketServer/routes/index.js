const express = require('express');
const { Timer, Chat } = require('../schemas/schema.js');
const router = express.Router();

// Define a route to render a chat page
router.get('/', async (req, res, next) => {
  try {
    const timers = await Timer.find({});
    const chat = await Chat.find({});
  } catch (err) {
    console.error(err);
    next(err);
  }
  res.render('mongoose');
});

module.exports = router;
