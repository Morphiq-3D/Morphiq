import { getDB } from "@/db";
import { addresses } from "@/db/schema"
import { NewAddress } from "@/db/types";
import { eq, sql } from "drizzle-orm";

const db = getDB();

export async function getAddresses() {
    return await db?.select().from(addresses);
}

export async function getAddressById(id: number) {
    return await db?.select().from(addresses).where(eq(addresses.id, id)).limit(1);
}

export async function getAddressByUserId(userId: number) {
    return await db?.select().from(addresses).where(eq(addresses.userId, userId));
}

export async function createAddress(data: NewAddress) {
    return await db?.insert(addresses).values(data).returning();
}

export async function updateAddress(id: number, data: NewAddress) {
    return await db?.update(addresses).set({...data, updatedAt: sql`now()`}).where(eq(addresses.id, id));
}

export async function updateUserAddress(userId: number, data: NewAddress) {
    return await db?.update(addresses).set({...data, updatedAt: sql`now()`}).where(eq(addresses.userId, userId));
}

export async function deleteAddress(id: number) {
    return await db?.delete(addresses).where(eq(addresses.id, id));
}