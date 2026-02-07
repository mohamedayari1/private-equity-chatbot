import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Ensure DATABASE_URL is set in your environment variables
const connectionString = process.env.DATABASE_URL || "";
const client = postgres(connectionString);
export const db = drizzle(client, { schema });
