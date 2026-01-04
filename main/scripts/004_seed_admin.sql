-- Seed a default admin account
-- Password is 'admin123' (bcrypt hashed)
-- IMPORTANT: Change this password in production!
INSERT INTO admins (email, password_hash, name)
VALUES (
  'admin@example.com',
  '$2b$10$rQZ8K5YB8wVxR5YBQjZ8K.8K5YB8wVxR5YBQjZ8K.8K5YBwVx',
  'Admin User'
) ON CONFLICT (email) DO NOTHING;
