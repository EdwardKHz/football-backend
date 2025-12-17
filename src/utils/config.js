import dotenv from "dotenv";
dotenv.config();

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT ;
const DB_NAME = process.env.DB_NAME;

const SERVER_PORT = process.env.SERVER_PORT || 3000;

const FOOTBALL_API_KEY = process.env.FOOTBALL_API_KEY;
const FOOTBALL_API_URL = process.env.FOOTBALL_API_URL;

export { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME, SERVER_PORT, FOOTBALL_API_KEY, FOOTBALL_API_URL };

