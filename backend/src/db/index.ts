import { drizzle } from 'drizzle-orm/postgres-js'
import { DB_STRING } from '../constants/dotenv_constants';

export const db = drizzle(DB_STRING);