// db/index.ts
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema"

let db: ReturnType<typeof drizzle> | null = null;

export function getDB() {
    if (!db) {
        const sql = neon(process.env.DATABASE_URL!);
        db = drizzle(sql, {
            schema: schema,
            casing: "snake_case"
        });
    }
    return db;
}
