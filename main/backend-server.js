const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const itemRoutes = require('./routes/items');
const commentRoutes = require('./routes/comments');

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

// Middleware configuration
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/items', itemRoutes);
app.use('/api/comments', commentRoutes);

/**
 * Initialize database connection and start the server
 */
sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully.');
    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Lost & Found Tracker backend listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Core system initialization failed:', err);
    process.exit(1);
  });

module.exports = app;
