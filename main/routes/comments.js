const express = require('express');
const router = express.Router();
const { Comment, Item, User } = require('../models');

/**
 * Get all comments across all items
 */
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.findAll({
      include: [
        { model: User, as: 'user' },
        { model: Item, as: 'item' },
      ],
      order: [['CommentDate', 'DESC']],
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get a specific comment by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user' },
        { model: Item, as: 'item' },
      ],
    });

    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Post a new comment
 */
router.post('/', async (req, res) => {
  try {
    const { content, itemId, author_name } = req.body;

    if (!content) return res.status(400).json({ error: 'Content is required' });
    if (!itemId) return res.status(400).json({ error: 'Item ID is required' });

    const name = author_name && author_name.trim() ? author_name.trim() : 'Anonymous';

    // Find or create a user for this comment session
    let user = await User.findOne({ where: { Name: name } });

    if (!user) {
      user = await User.create({
        Name: name,
        Email: `${name.replace(/\s+/g, '.').toLowerCase()}.${Date.now()}@anonymous.com`,
        RoleID: 3
      });
    }

    const comment = await Comment.create({
      CommentText: content,
      ItemID: itemId,
      UserID: user.UserID,
      CommentDate: new Date()
    });

    const fullComment = await Comment.findByPk(comment.CommentID, {
      include: [
        { model: User, as: 'user' },
        { model: Item, as: 'item' },
      ],
    });

    res.status(201).json(fullComment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Update an existing comment
 */
router.put('/:id', async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'Content is required' });

    await comment.update({ CommentText: content });

    const fullComment = await Comment.findByPk(comment.CommentID, {
      include: [
        { model: User, as: 'user' },
        { model: Item, as: 'item' },
      ],
    });

    res.json(fullComment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Delete a comment
 */
router.delete('/:id', async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    await comment.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
