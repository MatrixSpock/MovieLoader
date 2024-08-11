// Set-Up Routes

const express = require('express');
const router = express.Router();
const path = require('path');

router
  .route('/')
  .get(async (req, res) => {
    res.sendFile(path.resolve('static/webpage.html'));
  });

module.exports = router;
