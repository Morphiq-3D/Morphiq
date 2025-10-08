import { getOrders } from "@/services/orders.service";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const data = await getOrders();
    
        return NextResponse.json({result: data}, { status: 200 })

    } catch (e: unknown) {
        return NextResponse.json({ error: e}, { status: 500 });
    }
}

// TODO: implement get order by id functionality (function will not be here)