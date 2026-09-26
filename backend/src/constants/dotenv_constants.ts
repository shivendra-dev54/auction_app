import dotenv from 'dotenv';
dotenv.config();

export const PORT = (process.env.PORT || "") as unknown as number;
export const DB_STRING = (process.env.DB_STRING || "");