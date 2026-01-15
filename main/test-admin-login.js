const bcrypt = require('bcryptjs');

async function testAdminCredentials() {
  try {
    // Test the password hash for "####"
    const password = '########'; // Replace with the password to test
    const storedHash =
      '$2b$10$rQZ8K5YB8wVxR5YBQjZ8K.8K5YB8wVxR5YBQjZ8K.8K5YBwVx'; // The hash from the seed script

    const isValid = await bcrypt.compare(password, storedHash);
    console.log('Password validation result:', isValid);

    // Test with the default password "admin123"
    const defaultPassword = 'admin123';
    const isValidDefault = await bcrypt.compare(defaultPassword, storedHash);
    console.log('Default password validation result:', isValidDefault);
  } catch (error) {
    console.error('Error testing credentials:', error);
  }
}

testAdminCredentials();
