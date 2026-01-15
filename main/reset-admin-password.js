const { Admin } = require('./models');
const bcrypt = require('bcryptjs');

async function resetPassword() {
    try {
        const email = 'salikahmad702@gmail.com';
        const password = '########'; // New password to set
        const hash = await bcrypt.hash(password, 10);

        const [updated] = await Admin.update(
            { password_hash: hash },
            { where: { email } }
        );

        if (updated) {
            console.log('Password updated successfully for', email);
        } else {
            console.log('Admin not found or password already same');
        }
    } catch (error) {
        console.error('Failed to update password:', error);
    }
}

resetPassword();
