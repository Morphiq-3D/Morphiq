import { Address, NewOrder, User } from "@/db/types";
import { createUser, getUserByEmail } from "@/services/users.service";
import { createOrder } from "@/services/orders.service";
import { NextRequest, NextResponse } from "next/server";
import { createAddress, updateUserAddress } from "@/services/addresses.service";

export async function POST(req: NextRequest) {
    try {
        // TODO: add validation layer

        const { user, address, cart, priceCents, description } = await req.json();

        const orderData: NewOrder = { userId: 0, type: "print", cart, priceCents, description };

        const { fname, lname, email, phone } = user;

        // check whether user exists or not using email
        const searchResult: User[] = await getUserByEmail(email);
        console.log("search result: ", searchResult);

        if (searchResult.length === 0) {
            // user with this email does not exist, create new user
            const createdUser: User[] = await createUser({ fname, lname, email, phone });
            orderData.userId = createdUser[0].id;
            
            // create user's address
            const createdAddress: Address[] = await createAddress({userId: createdUser[0].id, ...address});

            console.log(`user with email ${email} does not exist, created a new user account`);
        } else {
            orderData.userId = searchResult[0].id;

            // update user's address
            await updateUserAddress(searchResult[0].id, address);
            
            console.log(`user with email ${email} exists, order added to there account`);
        }

        const createdOrder = createOrder(orderData);
        if (!createdOrder) {
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