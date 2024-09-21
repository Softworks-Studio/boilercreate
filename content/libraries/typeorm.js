export const typeorm = `
import { DataSource } from "typeorm";
// import { User } from "./entities/User";

// Create a new DataSource (formerly known as Connection)
export const AppDataSource = new DataSource({
    type: "postgres", // or "mysql", "sqlite", etc.
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "test",
    // entities: [User], // Add all your entity classes here
    synchronize: process.env.NODE_ENV !== "production", // Automatically create database schema. Set to false in production.
    logging: process.env.NODE_ENV !== "production",
});

// Initialize the database connection
export async function initializeDatabase() {
    try {
        await AppDataSource.initialize();
        console.log("Data Source has been initialized!");
    } catch (err) {
        console.error("Error during Data Source initialization:", err);
        process.exit(1);
    }
}

// // Example CRUD operations
// export const typeormOperations = {
//     createUser: async (userData) => {
//         const userRepository = AppDataSource.getRepository(User);
//         const user = userRepository.create(userData);
//         return await userRepository.save(user);
//     },

//     findUserById: async (id) => {
//         const userRepository = AppDataSource.getRepository(User);
//         return await userRepository.findOneBy({ id });
//     },

//     updateUser: async (id, updateData) => {
//         const userRepository = AppDataSource.getRepository(User);
//         await userRepository.update(id, updateData);
//         return await userRepository.findOneBy({ id });
//     },

//     deleteUser: async (id) => {
//         const userRepository = AppDataSource.getRepository(User);
//         const result = await userRepository.delete(id);
//         return result.affected > 0;
//     }
// };

// // Example User entity (typically this would be in a separate file)
// import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

// @Entity()
// export class User {
//     @PrimaryGeneratedColumn("uuid")
//     id: string;

//     @Column({ unique: true })
//     username: string;

//     @Column({ unique: true })
//     email: string;

//     @Column()
//     password: string;

//     @Column()
//     createdAt: Date;

//     @Column({ nullable: true })
//     updatedAt: Date;
// }
`;
