const { Admin } = require('./models');
const bcrypt = require('bcryptjs');

async function fixCredentials() {
    try {
        const email = 'salikahmad702@gmail.com';
        const password = '#########'; // New password to set
        const hash = await bcrypt.hash(password, 10);

        console.log('Resetting password for:', email);

        const [updated] = await Admin.update(
            { password_hash: hash },
            { where: { email } }
        );

        if (updated) {
            console.log('✅ Password successfully updated to 12345678');
        } else {
            console.log('⚠️ Admin not found. Creating a new admin account...');
            await Admin.create({
                email: email,
                password_hash: hash,
                name: 'Salik Ahmad',
                created_at: new Date()
            });
            console.log('✅ New admin account created with password 12345678');
        }
    } catch (error) {
        console.error('❌ Failed to update credentials:', error);
    } finally {
        process.exit();
    }
}

fixCredentials();
