const {
  sequelize,
  User,
  Item,
  Category,
  Condition,
  Comment,
} = require('./models');

async function seedDatabase() {
  try {
    // Sync database
    await sequelize.sync({ force: true });
    console.log('Database synced successfully');

    // Create categories
    const categories = await Category.bulkCreate([
      { name: 'Electronics' },
      { name: 'Clothing' },
      { name: 'Jewelry' },
      { name: 'Documents' },
      { name: 'Keys' },
      { name: 'Wallet/Purse' },
      { name: 'Other' },
    ]);
    console.log('Categories created:', categories.length);

    // Create conditions
    const conditions = await Condition.bulkCreate([
      { name: 'New' },
      { name: 'Good' },
      { name: 'Fair' },
      { name: 'Poor' },
      { name: 'Broken' },
    ]);
    console.log('Conditions created:', conditions.length);

    // Create users
    const users = await User.bulkCreate([
      { name: 'John Doe', email: 'john@example.com' },
      { name: 'Jane Smith', email: 'jane@example.com' },
      { name: 'Bob Johnson', email: 'bob@example.com' },
    ]);
    console.log('Users created:', users.length);

    // Create items
    const items = await Item.bulkCreate([
      {
        name: 'iPhone 12',
        description: 'Black iPhone 12 with cracked screen',
        categoryId: categories[0].id,
        conditionId: conditions[3].id,
        location: 'Central Park',
        status: 'Lost',
        userId: users[0].id,
        dateReported: new Date('2023-05-15T10:30:00'),
      },
      {
        name: 'Leather Wallet',
        description: 'Brown leather wallet with ID and credit cards',
        categoryId: categories[5].id,
        conditionId: conditions[1].id,
        location: 'Downtown Library',
        status: 'Found',
        userId: users[1].id,
        dateReported: new Date('2023-05-16T14:45:00'),
      },
      {
        name: 'Silver Necklace',
        description: 'Delicate silver chain with heart pendant',
        categoryId: categories[2].id,
        conditionId: conditions[0].id,
        location: 'Main Street Cafe',
        status: 'Stolen',
        userId: users[2].id,
        dateReported: new Date('2023-05-17T09:15:00'),
      },
    ]);
    console.log('Items created:', items.length);

    // Create comments
    const comments = await Comment.bulkCreate([
      {
        content: 'Has anyone turned this in?',
        itemId: items[0].id,
        userId: users[0].id,
      },
      {
        content: 'I think I saw this at the library info desk',
        itemId: items[0].id,
        userId: users[1].id,
      },
      {
        content: 'I found this wallet and turned it in to the library staff',
        itemId: items[1].id,
        userId: users[1].id,
      },
    ]);
    console.log('Comments created:', comments.length);

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
