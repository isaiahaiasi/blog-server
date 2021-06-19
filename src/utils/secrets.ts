import dotenv from "dotenv";

// TODO: handle .env/individual env vars not existing
dotenv.config({ path: ".env" });

export const NODE_ENV = process.env.NODE_ENV;
export const PORT = process.env.PORT ?? 3000;
