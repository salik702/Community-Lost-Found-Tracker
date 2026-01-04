const { Admin } = require('./models');

async function checkAdmins() {
  try {
    const admins = await Admin.findAll();
    console.log('Total admins:', admins.length);
    admins.forEach((admin) => {
      console.log('Email:', admin.email, '| Name:', admin.name);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkAdmins();
