const express = require('express');
const router = express.Router();

// Example API route
router.get('/test', (req, res) => {
  res.json({ message: 'Backend is connected to the Frontend!' });
});

module.exports = router;
