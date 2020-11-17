const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('config');
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
          .notEmpty()
          .withMessage('~ should contain a value'),
      ],
    ],
    async (req, res) => {
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
  )

  // @route   DELETE api/profile
  // @desc    Delete current users profile
  // @access  Private
  .delete(auth, async (req, res) => {
    try {
      await Profile.findOneAndDelete({ user: req.user.id });

      await User.findByIdAndDelete(req.user.id);

      res.status(204).send();
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

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

// @route   POST api/profile/experience
// @desc    Add a work experience
// @access  Private
router.post(
  '/experience',
  [
    auth,
    [
      check('title', '~ is required').notEmpty(),
      check('company', '~ is required').notEmpty(),
      check('from', '~ is required').notEmpty(),
    ],
  ],
  async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;

    // Build social object
    const newExperience = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    Object.keys(newExperience).forEach(
      (key) => newExperience[key] === undefined && delete newExperience[key]
    ); // Throws away all fields that are undefined

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      if (!profile) {
        return res.status(404).json({ errors: { msg: 'User not found' } });
      }

      profile.experience.unshift(newExperience);
      profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/profile/experience/:experience_id
// @desc    Delete a work experience
// @access  Private
router.delete(
  '/experience/:experience_id',
  [auth, [check('experience_id').isMongoId().withMessage('invalid ~')]],
  async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      if (!profile) {
        return res.status(404).json({ errors: { msg: 'User not found' } });
      }

      profile.experience = profile.experience.filter((experience) => {
        return experience.id !== req.params.experience_id;
      });

      profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   POST api/profile/education
// @desc    Add a study
// @access  Private
router.post(
  '/education',
  [
    auth,
    [
      check('school', '~ is required').notEmpty(),
      check('degree', '~ is required').notEmpty(),
      check('fieldofstudy', '~ is required').notEmpty(),
      check('from', '~ is required').notEmpty(),
    ],
  ],
  async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body;

    // Build social object
    const newEducation = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    Object.keys(newEducation).forEach(
      (key) => newEducation[key] === undefined && delete newEducation[key]
    ); // Throws away all fields that are undefined

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      if (!profile) {
        return res.status(404).json({ errors: { msg: 'User not found' } });
      }

      profile.education.unshift(newEducation);
      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/profile/experience
// @desc    Delete a work experience
// @access  Private
router.delete(
  '/education/:education_id',
  [auth, [check('education_id').isMongoId().withMessage('invalid ~')]],
  async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      if (!profile) {
        return res.status(404).json({ errors: { msg: 'User not found' } });
      }

      profile.education = profile.education.filter((education) => {
        return education.id !== req.params.education_id;
      });

      profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/profile/github/:username
// @desc    Get user repos from Github
// @access  Public
router.get('/github/:username', async (req, res) => {
  try {
    const options = {
      method: 'GET',
      url: `https://api.github.com/users/${req.params.username}/repos`,
      params: {
        per_page: '5',
        sort: 'created:asc',
        client_id: config.get('githubClientId'),
        client_secret: config.get('githubClientSecret'),
      },
      headers: { 'user-agent': 'node.js' },
    };

    const response = await axios(options);

    if (response.status !== 200) {
      return res.status(404).json({ msg: 'No Github profile found' });
    }

    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router;
