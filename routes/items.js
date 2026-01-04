const express = require('express');
const router = express.Router();
const { sequelize, Item, User, Category, Condition, Comment, Location } = require('../models');
const multer = require('multer');
const path = require('path');

// Configure storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

/**
 * Get all categories
 */
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get all conditions
 */
router.get('/conditions', async (req, res) => {
  try {
    const conditions = await Condition.findAll();
    res.json(conditions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get items with optional filtering and pagination
 */
router.get('/', async (req, res) => {
  try {
    const { status, limit } = req.query;
    let whereClause = {};

    if (status) {
      whereClause = { Status: status };
    }

    const queryOptions = {
      where: whereClause,
      include: [
        { model: User, as: 'user' },
        { model: Category, as: 'category' },
        { model: Condition, as: 'condition' },
        { model: Location, as: 'location' },
      ],
      order: [['ItemID', 'DESC']],
    };

    if (limit) {
      queryOptions.limit = parseInt(limit, 10);
    }

    const items = await Item.findAll(queryOptions);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get a specific item by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user' },
        { model: Category, as: 'category' },
        { model: Condition, as: 'condition' },
        { model: Location, as: 'location' },
        {
          model: Comment,
          as: 'comments',
          include: [{ model: User, as: 'user' }],
        },
      ],
    });

    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get comments for a specific item
 */
router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { ItemID: req.params.id },
      include: [{ model: User, as: 'user' }],
      order: [['CommentDate', 'DESC']]
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Post a comment on an item
 */
router.post('/:id/comments', async (req, res) => {
  try {
    const { comment_text, author_name } = req.body;
    const ItemID = req.params.id;

    if (!comment_text) return res.status(400).json({ error: 'Comment text required' });

    const name = author_name && author_name.trim() ? author_name.trim() : 'Anonymous';

    // Find or create a user for this comment author
    let user = await User.findOne({ where: { Name: name } });

    if (!user) {
      user = await User.create({
        Name: name,
        Email: `${name.replace(/\s+/g, '.').toLowerCase()}.${Date.now()}@anonymous.com`,
        RoleID: 3
      });
    }

    const comment = await Comment.create({
      CommentText: comment_text,
      ItemID: ItemID,
      UserID: user.UserID,
      CommentDate: new Date()
    });

    const fullComment = await Comment.findByPk(comment.CommentID, {
      include: [{ model: User, as: 'user' }]
    });

    res.status(201).json(fullComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Report a new item (Lost, Found, or Stolen)
 */
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const body = req.body || {};
    const {
      title,
      description,
      category,
      location,
      date,
      reporter_name,
      reporter_email,
      reporter_phone,
      image_url: body_image_url
    } = body;

    if (!title) return res.status(400).json({ error: 'Item title is required' });
    if (!reporter_email) return res.status(400).json({ error: 'Reporter email is required' });

    let statusVal = category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Lost';

    const fullItem = await sequelize.transaction(async (transaction) => {
      const normalizedEmail = String(reporter_email).trim().toLowerCase();
      const fallbackName = normalizedEmail.includes('@') ? normalizedEmail.split('@')[0] : normalizedEmail;
      const userName = (reporter_name && String(reporter_name).trim()) || fallbackName || 'Anonymous';

      const [user] = await User.findOrCreate({
        where: { Email: normalizedEmail },
        defaults: {
          Name: userName,
          RoleID: 3,
          Location: location || null,
          Contact: reporter_phone || null,
        },
        transaction,
      });

      // Update user details if they have changed or were missing
      if (user.Name === 'Anonymous' && userName !== 'Anonymous') {
        await user.update({ Name: userName }, { transaction });
      }

      if (reporter_phone && user.Contact !== reporter_phone) {
        await user.update({ Contact: reporter_phone }, { transaction });
      }

      let locationIdVal = 1;
      if (location) {
        const [loc] = await Location.findOrCreate({
          where: { LocationName: location },
          defaults: { LocationName: location },
          transaction,
        });
        locationIdVal = loc.LocationID;
      }

      let finalImageUrl = body_image_url || null;
      if (req.file) {
        finalImageUrl = `http://localhost:3001/uploads/${req.file.filename}`;
      }

      const item = await Item.create(
        {
          ItemName: title,
          Description: description,
          CategoryID: 8, // Set a default category if not provided
          ConditionID: 3, // Set a default condition
          PriorityID: 2,   // Set a default priority
          LocationFoundOrLost: locationIdVal,
          Status: statusVal,
          UserID: user.UserID,
          DateReported: date || new Date(),
          ImageURL: finalImageUrl,
        },
        { transaction }
      );

      return Item.findByPk(item.ItemID, {
        include: [
          { model: User, as: 'user' },
          { model: Category, as: 'category' },
          { model: Condition, as: 'condition' },
          { model: Location, as: 'location' },
        ],
        transaction,
      });
    });

    res.status(201).json(fullItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Internal handler for item updates (PUT/PATCH)
 */
const updateHandler = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id, {
      include: [{ model: User, as: 'user' }]
    });

    if (!item) return res.status(404).json({ error: 'Item not found' });

    const body = req.body || {};
    const {
      title,
      description,
      status,
      category,
      location,
      image_url,
      reporter_name,
      reporter_phone,
      reporter_email
    } = body;

    let statusVal = item.Status;
    if (status === 'resolved') {
      statusVal = 'Recovered';
    } else if (status === 'active') {
      statusVal = category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Lost';
    } else if (status && ['Lost', 'Found', 'Stolen', 'Recovered'].includes(status)) {
      statusVal = status;
    }

    let finalImageUrl = image_url !== undefined ? image_url : item.ImageURL;
    if (req.file) {
      finalImageUrl = `http://localhost:3001/uploads/${req.file.filename}`;
    }

    let locationIdVal = item.LocationFoundOrLost;
    if (location) {
      const [loc] = await Location.findOrCreate({
        where: { LocationName: location },
        defaults: { LocationName: location }
      });
      locationIdVal = loc.LocationID;
    }

    await sequelize.transaction(async (transaction) => {
      // Update Item attributes
      await item.update({
        ItemName: title || item.ItemName,
        Description: description !== undefined ? description : item.Description,
        Status: statusVal,
        ImageURL: finalImageUrl,
        LocationFoundOrLost: locationIdVal
      }, { transaction });

      // Update associated user's details if provided
      if (item.user && (reporter_name || reporter_phone || reporter_email)) {
        await item.user.update({
          Name: reporter_name || item.user.Name,
          Contact: reporter_phone || item.user.Contact,
          Email: reporter_email || item.user.Email
        }, { transaction });
      }
    });

    const fullItem = await Item.findByPk(item.ItemID, {
      include: [
        { model: User, as: 'user' },
        { model: Category, as: 'category' },
        { model: Condition, as: 'condition' },
        { model: Location, as: 'location' },
      ],
    });

    res.json(fullItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

router.put('/:id', upload.single('image'), updateHandler);
router.patch('/:id', upload.single('image'), updateHandler);

/**
 * Delete an item
 */
router.delete('/:id', async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    await item.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Send an email to the reporter (Simulated for academic/demonstration purposes)
 */
router.post('/:id/contact', async (req, res) => {
  try {
    const { message } = req.body;
    const item = await Item.findByPk(req.params.id, {
      include: [{ model: User, as: 'user' }]
    });

    if (!item) return res.status(404).json({ error: 'Item not found' });

    const recipientName = item.user ? item.user.Name : 'User';
    const recipientEmail = item.user ? item.user.Email : null;

    if (!recipientEmail) {
      return res.status(400).json({ error: 'No contact email found for this item reporter' });
    }

    // Professional logging for simulation
    console.log('--- Outgoing Email Simulation ---');
    console.log(`To: ${recipientName} <${recipientEmail}>`);
    console.log(`Subject: Update on your ${item.Status} item report: ${item.ItemName}`);
    console.log(`Content: ${message || 'System notification regarding your reported item.'}`);
    console.log('---------------------------------');

    // Save the message as an offical Alert in the database
    const { Alert } = require('../models');
    await Alert.create({
      ItemID: item.ItemID,
      UserID: item.UserID,
      AlertType: 'System Update',
      Message: message || `The administrator has sent an update regarding your item: ${item.ItemName}`,
      AlertDate: new Date(),
      IsRead: false
    });

    res.json({
      success: true,
      message: `Email successfully sent and alert recorded for ${recipientEmail}`,
      details: {
        to: recipientEmail,
        timestamp: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
