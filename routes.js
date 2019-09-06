const express = require('express');

const router = express.Router();

// STATUS 200 | Returns currently authenticated user
router.get('/users', (req, res) => {

});

// STATUS 201 | Creates user, sets location header to "/" and returns no content
router.post('/users', (req, res) => {
  res.status(201).end();
});

// STATUS 200 | Returns a list of courses(Including the user that owns each course)
router.get('/courses', (req, res) => {

});

// STATUS 200 | Returns the course(Including the user that owns the course) for the provided course ID
router.get('courses/:id', (req, res) => {

});

module.exports = router;
