const { Admin } = require('./models');

async function checkAdminAccount() {
  try {
    // Check if admin with email salikahmad702@gmail.com exists
    const admin = await Admin.findOne({
      where: {
        email: 'salikahmad702@gmail.com',
      },
    });

    if (admin) {
      console.log('Admin account found:');
      console.log('Email:', admin.email);
      console.log('Name:', admin.name);
      console.log('Password hash:', admin.password_hash);
    } else {
      console.log('No admin account found with email: salikahmad702@gmail.com');

      // Check all admin accounts
      const allAdmins = await Admin.findAll();
      console.log('All admin accounts:');
      allAdmins.forEach((a) => {
        console.log('- Email:', a.email, '| Name:', a.name);
      });
    }
  } catch (error) {
    console.error('Error checking admin account:', error);
  }
}

checkAdminAccount();
