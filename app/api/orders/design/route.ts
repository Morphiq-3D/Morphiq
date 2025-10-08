import { NextRequest, NextResponse } from "next/server";
import { NewOrder, NewUser, Order, User } from "@/db/types";
import { createOrder } from "@/services/orders.service";
import { createUser, getUserByEmail } from "@/services/users.service";

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
        const userResult: User[] = await getUserByEmail(userData.email);
        console.log(`searching for a user with the email ${userData.email}, result: `, userResult);
        
        if(userResult.length > 0) {
            orderData.userId = userResult[0].id;
            console.log(`user with email ${userData.email} exists, order added to there account`);
        } else {
            const createdUser: User[] = await createUser(userData);
            if (createdUser) {orderData.userId = createdUser[0].id};
            console.log(`user with email ${userData.email} does not exist, created a new user account`);
        }

        const createdOrder: Order[] = await createOrder(orderData);
        if (createdOrder.length === 0 ) {
            console.error("order creation may have failed");
            return NextResponse.json({ message: "order creation may have failed" }, { status: 500 });
        }

        console.log("order created successfully");
        return NextResponse.json({ message: "order created successfully" }, { status: 201 });

    } catch (e: unknown) {
        console.error(e);
        return NextResponse.json({ error: e }, { status: 500 });
    }
}