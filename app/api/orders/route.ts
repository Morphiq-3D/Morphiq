import { getDb } from "@/db";
import { orders } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const db = getDb();
        const data =  await db?.select().from(orders);
    
        return NextResponse.json({result: data}, { status: 200 })

    } catch (e: unknown) {
        return NextResponse.json({ error: e}, { status: 500 });
    }
}