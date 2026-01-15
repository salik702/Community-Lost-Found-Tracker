const bcrypt = require('bcryptjs');
const { Admin } = require('./models');

async function debugLogin() {
  try {
    console.log('Starting login debug...');

    const email = 'salikahmad702@gmail.com';
    const password = '########'; // Replace with the password to test

    console.log('Looking for admin with email:', email);

    // Find admin by email
    const admin = await Admin.findOne({
      where: {
        email: email,
      },
    });

    if (!admin) {
      console.log('❌ Admin not found in database');
      // List all admins to see what's in there
      const allAdmins = await Admin.findAll();
      console.log('All admins in database:');
      allAdmins.forEach((a, i) => {
        console.log(`  ${i + 1}. Email: ${a.email}, Name: ${a.name}`);
      });
      return;
    }

    console.log('✅ Admin found in database');
    console.log('Admin details:');
    console.log('  ID:', admin.id);
    console.log('  Email:', admin.email);
    console.log('  Name:', admin.name);
    console.log('  Password hash:', admin.password_hash);
    console.log('  Created at:', admin.created_at);

    // Verify password
    console.log('Verifying password...');
    const isValid = await bcrypt.compare(password, admin.password_hash);
    console.log('Password validation result:', isValid);

    if (isValid) {
      console.log('✅ Login credentials are valid!');
    } else {
      console.log('❌ Password is invalid');
    }
  } catch (error) {
    console.error('❌ Error during login debug:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

debugLogin();
