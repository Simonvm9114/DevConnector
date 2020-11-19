const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
// Custom middleware
const auth = require('../../middleware/auth');
// Models
const User = require('../../models/User');
const Post = require('../../models/Post');

// @route   POST api/post
// @desc    Create a post
// @access  Private
router.post(
  '/',
  [auth, [check('text', '~ is required').notEmpty()]],
  async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        user: req.user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
      });

      await newPost.save();

      res.json(newPost);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/post
// @desc    Fetch all posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const allPosts = await Post.find().sort('-date');

    res.json(allPosts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/post/:post_id
// @desc    Fetch a single post by id
// @access  Public
router.get(
  '/:post_id',
  [check('post_id', '~ should be a valid MongoDB ObjectId').isMongoId()],
  async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    try {
      const post = await Post.findById(req.params.post_id);

      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/post/:post_id
// @desc    Delete a post by id
// @access  Private
router.delete(
  '/:post_id',
  [
    auth,
    [check('post_id', '~ should be a valid MongoDB ObjectId').isMongoId()],
  ],
  async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    try {
      const post = await Post.findById(req.params.post_id);
      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }
      if (post.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }

      await post.remove();

      res.send('Post deleted');
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   POST api/post/like/:post_id
// @desc    Like a post
// @access  Private
router.post(
  '/like/:post_id',
  [
    auth,
    [check('post_id', '~ should be a valid MongoDB ObjectId').isMongoId()],
  ],
  async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    try {
      const post = await Post.findById(req.params.post_id);
      // If the post doesn't exist
      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }
      // If the user already liked the post
      if (
        post.likes.filter((like) => like.user.toString() === req.user.id)
          .length > 0
      ) {
        return res.status(400).json({ msg: 'User already liked this post' });
      }

      post.likes.push({ user: req.user.id });

      await post.save();

      res.json(post.likes);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/post/like/:post_id
// @desc    Unlike a post
// @access  Private
router.delete(
  '/like/:post_id',
  [
    auth,
    [check('post_id', '~ should be a valid MongoDB ObjectId').isMongoId()],
  ],
  async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }
    try {
      const post = await Post.findById(req.params.post_id);
      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }

      const newLikes = post.likes.filter((like) => {
        return like.user.toString() !== req.user.id;
      });

      // If the user haven't liked the post yet
      if (post.likes === newLikes) {
        return res.status(400).json({ msg: "user didn't like the post yet." });
      }

      post.likes = newLikes;

      post.save();

      res.json(post.likes);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   POST api/post/comment/:post_id
// @desc    Create a comment
// @access  Private
router.post(
  '/comment/:post_id',
  [
    auth,
    [
      check('post_id', '~ should be a valid MongoDB ObjectId').isMongoId(),
      check('text', '~ is required').notEmpty(),
    ],
  ],
  async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    try {
      const { name, avatar } = await User.findById(req.user.id);
      const post = await Post.findById(req.params.post_id);
      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }

      const newComment = {
        user: req.user.id,
        text: req.body.text,
        name,
        avatar,
      };

      post.comments.push(newComment);

      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/post/comment/:post_id/:comment_id
// @desc    Delete a comment
// @access  Private
router.delete(
  '/comment/:post_id/:comment_id',
  [
    auth,
    [
      check('post_id', 'comment_id')
        .isMongoId()
        .withMessage('~ should be a valid MongoDB ObjectId'),
    ],
  ],
  async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }
    try {
      const post = await Post.findById(req.params.post_id);
      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }

      const commentToRemove = post.comments.find(
        (comment) => comment.id.toString() === req.params.comment_id
      );

      if (!commentToRemove) {
        return res.status(404).json({ msg: 'Comment not found' });
      }

      if (commentToRemove.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }

      const removeIndex = post.comments
        .map((comment) => comment.id.toString())
        .indexOf(req.params.comment_id);

      post.comments.splice(removeIndex, 1);

      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
