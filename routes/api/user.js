const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');

// @route   POST api/user
// @desc    Register user
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Enter a valid email adres')
      .isEmail()
      .custom((value) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject('E-mail adres is already in use');
          }
        });
      }),
    check('password')
      .isLength({ min: 6, max: 20 })
      .withMessage('Must be 6-20 characters')
      .matches(/\d/)
      .withMessage('Should contain a number'),
  ],
  async (req, res) => {
    console.log(req.body);
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    const { name, email, password } = req.body;

    try {
      const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' });

      const user = new User({ name, email, password, avatar });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = { user: { id: user.id } };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );

      // res.send('User registered');
    } catch (err) {
      console.log(err.message);
      return res.status(500).send('Server error');
    }
  }
);

module.exports = router;
