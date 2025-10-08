import { getDB } from "@/db";
import { orders } from "@/db/schema";
import { NewOrder } from "@/db/types";
import { eq, sql } from "drizzle-orm";

const db = getDB();

export async function getOrders() {
    return await db?.select().from(orders);
}

export async function getOrderById(id: number) {
    return await db?.select().from(orders).where(eq(orders.id, id));
}

export async function getOrdersByUserId(userId: number) {
    return await db?.select().from(orders).where(eq(orders.userId, userId));
}

export async function createOrder(data: NewOrder) {
    return await db?.insert(orders).values(data).returning();
}

export async function updateOrder(id: number, data: NewOrder) {
    return await db?.update(orders).set({...data, updatedAt: sql`now()`}).where(eq(orders.id, id));
}

export async function deleteOrder(id: number) {
    // TODO: delete files from cloud storage
    return await db?.delete(orders).where(eq(orders.id, id));
}