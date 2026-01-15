const mysql = require('mysql2');

console.log('Checking database tables...');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3307,
  user: 'tracker_user',
  password: 'tracker_password',
  database: 'lost_stolen_items_tracker',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    process.exit(1);
  } else {
    console.log('Successfully connected to MySQL database');

    // Check if admins table exists
    connection.query('SHOW TABLES LIKE "admins"', (err, results) => {
      if (err) {
        console.error('Error checking admins table:', err.message);
      } else {
        if (results.length > 0) {
          console.log('✓ Admins table exists');

          // Check if our admin account exists
          connection.query(
            'SELECT * FROM admins WHERE email = ?',
            ['salikahmad702@gmail.com'],
            (err, results) => {
              if (err) {
                console.error('Error querying admin account:', err.message);
              } else {
                if (results.length > 0) {
                  console.log('✓ Admin account found:', results[0].email);
                } else {
                  console.log('✗ Admin account not found');
                }
              }

              connection.end();
            }
          );
        } else {
          console.log('✗ Admins table does not exist');
          connection.end();
        }
      }
    });
  }
});
