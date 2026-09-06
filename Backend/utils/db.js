import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const clientConfig = {
    host: process.env.PG_HOST || "localhost",
    user: process.env.PG_USER || "postgres",
    port: Number(process.env.PG_PORT) || 5432,
    password: String(process.env.PG_PASSWORD || "manish@123"),
    database: process.env.PG_DATABASE || "JobDB",
};

const client = new Client(clientConfig);

const connectDB = async () => {
    try {
        await client.connect();
        console.log(`PostgreSQL database connected successfully to "${clientConfig.database}" using pg Client.`);
    } catch (error) {
        console.error("PostgreSQL connection error:", error.message);
    }
};

export { client };
export default connectDB;