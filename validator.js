const { check } = require('express-validator');

const firstName = check('firstName')
  .exists({ checkNull: true, checkFalsy: true })
  .withMessage('Please provide a value for "firstName"');

const lastName = check('lastName')
  .exists({ checkNull: true, checkFalsy: true })
  .withMessage('Please provide a value for "lastName"');

const password = check('password')
  .exists({ checkNull: true, checkFalsy: true })
  .withMessage('Please provide a value for "password"');

const email = check('emailAddress')
  .exists({ checkNull: true, checkFalsy: true })
  .withMessage('Please provide a value for "emailAddress"')
  .isEmail()
  .withMessage('Please provide a valid email address for "emailAddress"');

const title = check('title')
  .exists({ checkNull: true, checkFalsy: true })
  .withMessage('Please provide a value for "title"');

const description = check('description')
  .exists({ checkNull: true, checkFalsy: true })
  .withMessage('Please provide a value for "description"');

const userId = check('userId')
  .exists({ checkNull: true, checkFalsy: true })
  .withMessage('Please provide a value for "userId"');

const validator = {
  firstName,
  lastName,
  password,
  email,
  title,
  description,
  userId
};

module.exports = validator;
