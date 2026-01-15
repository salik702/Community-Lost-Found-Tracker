const { Admin, AdminSession } = require('./models');
const bcrypt = require('bcryptjs');

async function testLogin() {
    try {
        const email = 'salikahmad702@gmail.com';
        const password = '########'; // Replace with the password to test

        console.log('Testing login for:', email);
        const admin = await Admin.findOne({ where: { email } });

        if (!admin) {
            console.log('Admin not found');
            return;
        }

        console.log('Admin found:', admin.toJSON());

        const isValid = await bcrypt.compare(password, admin.password_hash);
        console.log('Password valid:', isValid);

        if (isValid) {
            console.log('Creating session...');
            const session = await AdminSession.create({
                admin_id: admin.id,
                session_token: 'test-token-' + Date.now(),
                expires_at: new Date(Date.now() + 1000000)
            });
            console.log('Session created:', session.toJSON());
        }
    } catch (error) {
        console.error('Login test failed:', error);
    }
}

testLogin();
