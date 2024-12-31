import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { schema } from "./schema";

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:9tDi5GUeMjWX@ep-cold-wave-a1remq8o.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
});

const db = drizzle(pool, { schema });

export default db;
