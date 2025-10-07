import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db";
import { users, orders } from "@/db/schema"
import { eq } from "drizzle-orm";
import { NewOrder, NewUser, User } from "@/db/types";

export async function POST(req: NextRequest) {
    const result = await req.json()
    console.log("result: ", result);

    // TODO: validation layer

    const userData: NewUser = {
        fname: result.fname,
        lname: result.lname,
        email: result.email,
        phone: result.phone
    }

    const orderData: NewOrder = {
        userId: 0,
        type: "design",
        description: result.description
    }

    try {
        const db = getDb();
        
        const userResult: User[] = await db?.select().from(users).where(eq(users.email, userData.email)).limit(1);
        console.log(`searching for a user with the email ${userData.email}, result: `, userResult);
        
        if(userResult.length > 0) {
            orderData.userId = userResult[0].id;
        } else {
            const createdUser: User[] = await db?.insert(users).values(userData).returning();
            if (createdUser) {orderData.userId = createdUser[0].id};
        }

        const insertionResult = await db?.insert(orders).values(orderData);
        if ('rowCount' in insertionResult && insertionResult.rowCount === 1) {
            console.log("user inserted successfully");
            return NextResponse.json({ message: "order created successfully" }, { status: 201 });
        } else {
            console.error("insert may have failed");
            return NextResponse.json({ message: "insert may have failed" }, { status: 500 });
        }
    } catch (e: unknown) {
        console.error(e);
        return NextResponse.json({ error: e }, { status: 500 });
    }
}