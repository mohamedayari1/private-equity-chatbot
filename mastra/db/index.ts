import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Hardcoded Neon connection string for testing
// TODO: Move to environment variables for production
const CONNECTION_STRING =
  "postgresql://neondb_owner:npg_w2dmcUyDth8F@ep-proud-truth-aiqwhbwf-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const client = postgres(CONNECTION_STRING, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });
