import {Pool} from 'pg';
import {DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER} from "./utils/config.js";

const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_NAME,
    password: DB_PASSWORD,
    port: DB_PORT
});

try {
    await pool.connect();
    console.log("Connected to the database");
} catch (err) {
    console.error("Failed to connect to database:", err.message);
}


export default pool;