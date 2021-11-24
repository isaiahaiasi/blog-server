import dotenv from "dotenv";

// TODO: handle .env/individual env vars not existing
dotenv.config({ path: ".env" });

export const NODE_ENV = process.env.NODE_ENV || "production";
export const PORT = process.env.PORT;
export const MONGODB_URI = process.env.MONGODB_URI as string;
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(",") || false;
