export const sequelize = `
import { Sequelize, DataTypes } from 'sequelize';

// Initialize Sequelize
const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://user:pass@example.com:5432/dbname', {
  dialect: 'postgres', // or 'mysql', 'sqlite', 'mariadb', 'mssql'
  logging: false, // Set to console.log to see SQL queries
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test the connection
export async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

// // Example User model
// const User = sequelize.define('User', {
//   id: {
//     type: DataTypes.UUID,
//     defaultValue: DataTypes.UUIDV4,
//     primaryKey: true
//   },
//   username: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true
//   },
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true,
//     validate: {
//       isEmail: true
//     }
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false
//   }
// }, {
//   timestamps: true
// });

// // Sync all models with the database
// export async function syncDatabase() {
//   await sequelize.sync({ alter: true });
//   console.log('Database synced');
// }

// // Example CRUD operations
// export const sequelizeOperations = {
//   createUser: async (userData) => {
//     return await User.create(userData);
//   },

//   findUserById: async (id) => {
//     return await User.findByPk(id);
//   },

//   updateUser: async (id, updateData) => {
//     const user = await User.findByPk(id);
//     if (user) {
//       return await user.update(updateData);
//     }
//     throw new Error('User not found');
//   },

//   deleteUser: async (id) => {
//     const user = await User.findByPk(id);
//     if (user) {
//       await user.destroy();
//       return true;
//     }
//     return false;
//   }
// };

// Export the Sequelize instance and models
export { sequelize };
`;
