const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

router
  .route('/')
  // @route   GET api/profile
  // @desc    Get all profiles
  // @access  Public
  .get(async (req, res) => {
    try {
      const profiles = await Profile.find().populate('user', [
        'name',
        'avatar',
      ]);

      res.json(profiles);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  })

  // @route   POST api/profile
  // @desc    Create or modify a users profile
  // @access  Private
  .post(
    [
      auth,
      [
        check(['status', 'skills'])
          .exists()
          .withMessage('~ should contain a value'),
      ],
    ],
    async (req, res) => {
      console.log(req.body);
      const validationErrors = validationResult(req);
      if (!validationErrors.isEmpty()) {
        return res.status(400).json({ errors: validationErrors.array() });
      }

      const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin,
      } = req.body;

      // Build social object
      const socialFields = { youtube, facebook, twitter, instagram, linkedin };

      Object.keys(socialFields).forEach(
        (key) => socialFields[key] === undefined && delete socialFields[key]
      ); // Throws away all fields that are undefined

      // Build profile object
      const profileFields = {
        user: req.user.id,
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills: skills.split(',').map((skill) => skill.trim()),
        social: socialFields,
      };

      Object.keys(profileFields).forEach(
        (key) => profileFields[key] === undefined && delete profileFields[key]
      ); // Throws away all fields that are undefined

      try {
        // Check if the user already has a profile
        let profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          profileFields,
          { new: true }
        );

        if (profile) {
          return res.json(profile);
        }

        profile = await new Profile(profileFields);
        await profile.save();
        res.status(201).json(profile);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  );

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res
        .status(400)
        .json({ errors: { msg: 'There is no profile for this user.' } });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route   GET api/profile/:id
// @desc    Fetch a profile by id
// @access  Public
router.get(
  '/:profile_id',
  [check('profile_id').isMongoId().withMessage('invalid ~')],
  async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    try {
      const profile = await Profile.findById(
        req.params.profile_id
      ).populate('user', ['name', 'avatar']);

      if (!profile) {
        return res.status(404).json({ errors: { msg: 'Profile not found' } });
      }

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/profile/user/:user_id
// @desc    Fetch a profile by user id
// @access  Public
router.get(
  '/user/:user_id',
  [check('user_id').isMongoId().withMessage('invalid ~')],
  async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    try {
      const profile = await Profile.findOne({
        user: req.params.user_id,
      }).populate('user', ['name', 'avatar']);

      if (!profile) {
        return res.status(404).json({ errors: { msg: 'User not found' } });
      }

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
