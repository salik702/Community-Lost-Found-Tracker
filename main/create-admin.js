const bcrypt = require('bcryptjs');
const { Admin } = require('./models');

async function createAdmin() {
  try {
    // Hash the password
    const password = '########'; // Replace with desired password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin account
    const admin = await Admin.create({
      email: 'salikahmad702@gmail.com',
      password_hash: hashedPassword,
      name: 'Salik Ahmad',
    });

    console.log('Admin account created successfully!');
    console.log('Email:', admin.email);
    console.log('Name:', admin.name);

    // Verify the account
    const foundAdmin = await Admin.findOne({
      where: {
        email: 'salikahmad702@gmail.com',
      },
    });

    if (foundAdmin) {
      console.log('Account verified in database.');
    } else {
      console.log('Failed to verify account.');
    }
  } catch (error) {
    console.error('Error creating admin account:', error.message);
  }
}

createAdmin();
