const bcrypt = require('bcryptjs');
const { Admin } = require('./models');

async function testLogin() {
  try {
    const email = 'salikahmad702@gmail.com';
    const password = '########'; // Replace with the password to test

    // Find admin by email
    const admin = await Admin.findOne({
      where: {
        email: email,
      },
    });

    if (!admin) {
      console.log('Admin not found');
      return;
    }

    console.log('Admin found:', admin.email);

    // Verify password
    const isValid = await bcrypt.compare(password, admin.password_hash);
    console.log('Password valid:', isValid);

    if (isValid) {
      console.log('Login would be successful!');
    } else {
      console.log('Invalid credentials');
    }
  } catch (error) {
    console.error('Login test error:', error.message);
  }
}

testLogin();
