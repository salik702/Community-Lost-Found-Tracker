const bcrypt = require('bcryptjs');
const { Admin } = require('./models');

// Simulate the API login function
async function simulateApiLogin(email, password) {
  try {
    console.log('Simulating API login...');
    console.log('Email:', email);
    console.log('Password:', password);

    if (!email || !password) {
      return {
        status: 400,
        json: () =>
          Promise.resolve({ error: 'Email and password are required' }),
      };
    }

    // Find admin by email
    const admin = await Admin.findOne({
      where: {
        email: email,
      },
    });

    if (!admin) {
      return {
        status: 401,
        json: () => Promise.resolve({ error: 'Invalid credentials' }),
      };
    }

    // Verify password
    const isValid = await bcrypt.compare(password, admin.password_hash);

    if (!isValid) {
      return {
        status: 401,
        json: () => Promise.resolve({ error: 'Invalid credentials' }),
      };
    }

    // Success response
    return {
      status: 200,
      json: () =>
        Promise.resolve({
          success: true,
          admin: {
            id: admin.id,
            email: admin.email,
            name: admin.name,
          },
        }),
    };
  } catch (error) {
    console.error('API Login error:', error);
    return {
      status: 500,
      json: () => Promise.resolve({ error: 'Login failed' }),
    };
  }
}

async function testApiCall() {
  try {
    console.log('Testing API call with your credentials...');

    const email = 'salikahmad702@gmail.com';
    const password = '########'; // Replace with the password to test

    const response = await simulateApiLogin(email, password);
    const data = await response.json();

    console.log('Response status:', response.status);
    console.log('Response data:', data);

    if (response.status === 200) {
      console.log('✅ API call would be successful!');
    } else {
      console.log('❌ API call failed with error:', data.error);
    }
  } catch (error) {
    console.error('❌ Error testing API call:', error.message);
  }
}

testApiCall();
