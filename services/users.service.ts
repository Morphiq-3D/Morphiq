import { getDB } from "@/db";
import { users } from "@/db/schema"
import { NewUser } from "@/db/types";
import { eq } from "drizzle-orm";

const db = getDB();

export async function getUsers() {
    return await db?.select().from(users);
}

export async function getUserById(id: number) {
    return await db?.select().from(users).where(eq(users.id, id)).limit(1);
}

export async function getUserByEmail(email: string) {
    return await db?.select().from(users).where(eq(users.email, email)).limit(1);
}

export async function createUser(data: NewUser) {
    return await db?.insert(users).values(data).returning();
}

export async function updateUser(id: number, data: NewUser) {
    return await db?.update(users).set(data).where(eq(users.id, id));
}

export async function deleteUser(id: number) {
    return await db?.delete(users).where(eq(users.id, id));
}