const { sequelize, Admin } = require('./models');

async function testSequelize() {
  try {
    console.log('Testing Sequelize connection...');
    
    // Test the connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Test querying the admin table
    const admin = await Admin.findOne({
      where: {
        email: 'salikahmad702@gmail.com'
      }
    });
    
    if (admin) {
      console.log('✅ Admin account found:', admin.email);
    } else {
      console.log('❌ Admin account not found');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testSequelize();