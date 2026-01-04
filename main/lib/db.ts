import { Sequelize } from 'sequelize';
import sequelize from '@/config/database';

// Export the sequelize instance for use in models
export { sequelize };

// Mock sql function that throws an error since we're not using raw SQL
// This is to maintain compatibility with existing code
export const sql = () => {
  throw new Error(
    'Direct SQL queries are not supported in this configuration. Use the Sequelize models instead.'
  );
};
