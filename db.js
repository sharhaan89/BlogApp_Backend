"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg_1 = require("pg");
const schema_1 = require("./schema");
const pool = new pg_1.Pool({
    connectionString: "postgresql://neondb_owner:9tDi5GUeMjWX@ep-cold-wave-a1remq8o.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
});
const db = (0, node_postgres_1.drizzle)(pool, { schema: schema_1.schema });
exports.default = db;
