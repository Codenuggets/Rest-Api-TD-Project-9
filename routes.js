const { sequelize, models } = require('./db');
const { Course, User } = models;
const validator = require('./validator');

const auth = require('basic-auth');
const bcryptjs = require('bcryptjs');
const bodyParser = require('body-parser');
const express = require('express');
const { check, validationResult } = require('express-validator');

const router = express.Router();

// Sets up bodyParser middleware to read the body of requests
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const authenticateUser = async (req, res, next) => {
  let message = null;

  // Parse the user's credentials from the Authorization header.
  const credentials = auth(req);
  console.log(credentials);

  // If the user's credentials are available...
  if (credentials) {

    const user = await User.findOne({
      where: { emailAddress: credentials.name }
    });

    // If a user was successfully retrieved
    if (user) {
      const authenticated = bcryptjs
        .compareSync(credentials.pass, user.password);

      // If the passwords match...
      if (authenticated) {
        console.log(`Authentication successful for username: ${user.username}`);

        // Then store the retrieved user object on the request object
        // so any middleware functions that follow this middleware function
        // will have access to the user's information.
        req.currentUser = user;
      } else {
        message = `Authentication failure for username: ${user.username}`;
      }
    } else {
      message = `User not found for username: ${credentials.name}`;
    }
  } else {
    message = 'Auth header not found';
  }

  // If user authentication failed...
  if (message) {
    console.warn(message);

    // Return a response with a 401 Unauthorized HTTP status code.
    res.status(401).json({ message: 'Only users can perform this action' });
  } else {
    // Or if user authentication succeeded...
    // Call the next() method.
    next();
  }
};

// STATUS 200 | Returns currently authenticated user
router.get('/users', authenticateUser, (req, res) => {
  const user = req.currentUser;

  res.json({
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.emailAddress
  });
});

// STATUS 201 | Creates user, sets location header to "/" and returns no content
router.post('/users', [
  validator.firstName,
  validator.lastName,
  validator.email,
  validator.password ],
  async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg);

      // Return the validation errors to the client.
      return res.status(400).json({ errors: errorMessages });
    } else {
      try {
        const takenEmail = await User.findOne({
          where: {emailAddress: req.body.emailAddress}
        });
        if(!takenEmail) {
          await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            emailAddress: req.body.emailAddress,
            password: bcryptjs.hashSync(req.body.password)
          });
          res.status(201).location('/').end();
        } else {
          res.status(400).json({ error: "Email is already registered to a User" });
        }

      } catch (error) {
        next(error);
      }
    }
});

// STATUS 200 | Returns a list of courses(Including the user that owns each course)
router.get('/courses', async (req, res) => {
    const courses = await Course.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: {exclude: ['createdAt', 'updatedAt', 'password']},
        },
      ],
      attributes: {exclude: ['createdAt', 'updatedAt']},
    });
    res.json(courses);
});

// STATUS 200 | Returns the course(Including the user that owns the course) for the provided course ID
router.get('/courses/:id', async (req, res) => {
  const course = await Course.findByPk(req.params.id, {
    include: [
      {
        model: User,
        as: 'user',
        attributes: {exclude: ['createdAt', 'updatedAt', 'password']},
      },
    ],
    attributes: {exclude: ['createdAt', 'updatedAt']},
  });
    res.json(course);
});

// STATUS 201 | Creates a course, sets the Location header to the URI for the course and returns no content
router.post('/courses', [
  authenticateUser,
  validator.title,
  validator.description,
  validator.userId ],
  async (req, res, next) => {
    const errors = validationResult(req);
    let course;

    if(!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg);

      // Return the validation errors to the client.
      return res.status(400).json({ errors: errorMessages });
    } else {
      try {
        course = await Course.create({
          title: req.body.title,
          description: req.body.description,
          estimatedTime: req.body.estimatedTime,
          materialsNeeded: req.body.materialsNeeded,
          userId: req.body.userId,
        });
        res.status(201).location('api/courses/' + course.id).end();
      } catch (error) {
        if(error.name === 'SequelizeValidationError'){
          // If so the error messages are passed into the error object, the page is rerendered with the message displayed for the user
          const errors = error.errors.map(error => error.message);
          res.status(400);
          next(error);
        } else {
          res.status(400);
          next(error);
        }
      }
    }
  });

// STATUS 204 | Updates a course and returns no content
router.put('/courses/:id', [
  authenticateUser,
  validator.title,
  validator.description ],
  async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg);

      // Return the validation errors to the client.
      return res.status(400).json({ errors: errorMessages });
    } else {
      const user = req.currentUser;

      const course = await Course.findByPk(req.params.id);
      if(user.id == course.userId){
        await course.update({
          title: req.body.title,
          description: req.body.description,
          estimatedTime: req.body.estimatedTime,
          materialsNeeded: req.body.materialsNeeded,
        });
        res.status(204).end();
      } else {
        res.status(403).json({ error: "User has to own course to update them"});
      }
    }
});

// STATUS 204 | Deletes a course and returns no content
router.delete('/courses/:id', authenticateUser, async (req, res, next) => {
  const course = await Course.findByPk(req.params.id);
  const user = req.currentUser;
  if(course) {
    if(user.id == course.userId){
      await course.destroy();
      res.status(204).end();
    } else {
      res.status(403).json({ error: "User has to own a course to delete it"});
    }
  } else {
    res.status(400).json({ error: "Course not found"});
  }
});

module.exports = router;
