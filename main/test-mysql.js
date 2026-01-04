const mysql = require('mysql2');

console.log('Testing MySQL connection...');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3307,
  user: 'tracker_user',
  password: 'tracker_password',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    process.exit(1);
  } else {
    console.log('Successfully connected to MySQL');

    // Test if the database exists
    connection.query(
      'SHOW DATABASES LIKE "lost_stolen_items_tracker"',
      (err, results) => {
        if (err) {
          console.error('Error checking database:', err.message);
        } else {
          if (results.length > 0) {
            console.log('Database "lost_stolen_items_tracker" exists');
          } else {
            console.log('Database "lost_stolen_items_tracker" does not exist');
          }
        }

        connection.end();
      }
    );
  }
});
