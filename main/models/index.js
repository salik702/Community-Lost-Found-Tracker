const sequelize = require('../config/database');

// Import existing models
const User = require('./User');
const Item = require('./Item');
const Category = require('./Category');
const Condition = require('./Condition');
const Comment = require('./Comment');
const Location = require('./Location');
const Admin = require('./Admin');
const AdminSession = require('./AdminSession');

// Import new models
const UserRole = require('./UserRole');
const ItemPriority = require('./ItemPriority');
const Match = require('./Match');
const Report = require('./Report');
const RecoveryMethod = require('./RecoveryMethod');
const Alert = require('./Alert');
const ItemTag = require('./ItemTag');
const UserActivityLog = require('./UserActivityLog');
const NotificationSetting = require('./NotificationSetting');

/**
 * Define Associations
 */

// Admin and Sessions
Admin.hasMany(AdminSession, { foreignKey: 'admin_id', as: 'sessions' });
AdminSession.belongsTo(Admin, { foreignKey: 'admin_id', as: 'Admin' });

// User and Roles
UserRole.hasMany(User, { foreignKey: 'RoleID', as: 'users' });
User.belongsTo(UserRole, { foreignKey: 'RoleID', as: 'role' });

// User and Items
User.hasMany(Item, { foreignKey: 'UserID', as: 'items' });
Item.belongsTo(User, { foreignKey: 'UserID', as: 'user' });

// Item and MetaData
Category.hasMany(Item, { foreignKey: 'CategoryID', as: 'items' });
Item.belongsTo(Category, { foreignKey: 'CategoryID', as: 'category' });

Condition.hasMany(Item, { foreignKey: 'ConditionID', as: 'items' });
Item.belongsTo(Condition, { foreignKey: 'ConditionID', as: 'condition' });

ItemPriority.hasMany(Item, { foreignKey: 'PriorityID', as: 'items' });
Item.belongsTo(ItemPriority, { foreignKey: 'PriorityID', as: 'priority' });

Location.hasMany(Item, { foreignKey: 'LocationFoundOrLost', as: 'items' });
Item.belongsTo(Location, { foreignKey: 'LocationFoundOrLost', as: 'location' });

// Item and Tags
Item.hasMany(ItemTag, { foreignKey: 'ItemID', as: 'tags' });
ItemTag.belongsTo(Item, { foreignKey: 'ItemID', as: 'item' });

// Item and Comments
Item.hasMany(Comment, { foreignKey: 'ItemID', as: 'comments' });
Comment.belongsTo(Item, { foreignKey: 'ItemID', as: 'item' });

User.hasMany(Comment, { foreignKey: 'UserID', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'UserID', as: 'user' });

// Matches
Item.hasMany(Match, { foreignKey: 'LostItemID', as: 'lostMatches' });
Item.hasMany(Match, { foreignKey: 'FoundItemID', as: 'foundMatches' });
Match.belongsTo(Item, { foreignKey: 'LostItemID', as: 'lostItem' });
Match.belongsTo(Item, { foreignKey: 'FoundItemID', as: 'foundItem' });

// Reports
Item.hasMany(Report, { foreignKey: 'ItemID', as: 'reports' });
Report.belongsTo(Item, { foreignKey: 'ItemID', as: 'item' });
User.hasMany(Report, { foreignKey: 'UserID', as: 'reports' });
Report.belongsTo(User, { foreignKey: 'UserID', as: 'user' });

// Alerts
User.hasMany(Alert, { foreignKey: 'UserID', as: 'alerts' });
Alert.belongsTo(User, { foreignKey: 'UserID', as: 'user' });
Item.hasMany(Alert, { foreignKey: 'ItemID', as: 'alerts' });
Alert.belongsTo(Item, { foreignKey: 'ItemID', as: 'item' });

// Activity Logs
User.hasMany(UserActivityLog, { foreignKey: 'UserID', as: 'logs' });
UserActivityLog.belongsTo(User, { foreignKey: 'UserID', as: 'user' });

// Notification Settings
User.hasOne(NotificationSetting, { foreignKey: 'UserID', as: 'settings' });
NotificationSetting.belongsTo(User, { foreignKey: 'UserID', as: 'user' });

module.exports = {
  sequelize,
  User,
  Item,
  Category,
  Condition,
  Location,
  Comment,
  Admin,
  AdminSession,
  UserRole,
  ItemPriority,
  Match,
  Report,
  RecoveryMethod,
  Alert,
  ItemTag,
  UserActivityLog,
  NotificationSetting,
};
