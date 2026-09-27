import { drizzle } from 'drizzle-orm/postgres-js'
import { DB_STRING } from '../constants/dotenv_constants';

export const db = drizzle(DB_STRING);

export * from "./schema/auction.schema";
export * from "./schema/user.schema";
export * from "./schema/item.schema";
export * from "./schema/bid.schema";