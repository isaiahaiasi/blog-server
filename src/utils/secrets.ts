import dotenv from "dotenv";

// TODO: handle .env/individual env vars not existing
dotenv.config({ path: ".env" });

export const PORT = process.env.PORT ?? 3000;
export const NODE_ENV = process.env.NODE_ENV;
export const MONGODB_URI = process.env.MONGODB_URI || "ERROR"; // ! TEMP
export const JWT_SECRET = process.env.JWT_SECRET || "ERROR";
