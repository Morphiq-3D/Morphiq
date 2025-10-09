import { User } from "@/db/types";
import { createUser, getUserByEmail } from "@/services/users.service";
import { createOrder } from "@/services/orders.service";
import { NextRequest, NextResponse } from "next/server";
import { createAddress, getAddressByUserId, updateUserAddress } from "@/services/addresses.service";
import { sendPrintOrderConfirmationEmail, sendWelcomeEmail } from "@/services/mail.service";
import { userInsertSchema } from "@/validation/users.schema";
import { orderInsertSchema } from "@/validation/orders.schema";
import { addressInsertSchema } from "@/validation/addresses.schema";
import { z, ZodError } from "zod";

const requestSchema = z.object({
    user: userInsertSchema,
    order: orderInsertSchema,
    address: addressInsertSchema
})

export async function POST(req: NextRequest) {
    try {
        // {user, order, address }
        const body = await req.json();
        // console.log("request body", body);

        const parsed = requestSchema.parse(body);

        const { user, order, address } = parsed;

        order.userId = 0; order.type = "print";

        // check whether user exists or not using email
        const searchResult: User[] = await getUserByEmail(user.email);
        console.log("search result: ", searchResult);

        if (searchResult.length === 0) {
            // user with this email does not exist, create new user
            const createdUser: User[] = await createUser(user);
            order.userId = createdUser[0].id;
            
            // create user's address
            await createAddress({userId: createdUser[0].id, ...address});

            console.log(`user with email ${user.email} does not exist, created a new user account`);
            sendWelcomeEmail(user.email);
        } else {
            order.userId = searchResult[0].id;

            // check whether the user has an address or not
            const userAddress = await getAddressByUserId(searchResult[0].id);
            
            if (userAddress.length === 0) {
                // create a new address
                await createAddress({ ...address, userId: searchResult[0].id });
            } else {
                // update the existing address
                await updateUserAddress(searchResult[0].id, address);
            }
            
            console.log(`user with email ${user.email} exists, order added to there account`);
        }

        const createdOrder = createOrder(order);
        if (!createdOrder) {
            console.error("order creation may have failed");
            return NextResponse.json({ message: "order creation may have failed" }, { status: 500 });
        }

        console.log("order created successfully");
        sendPrintOrderConfirmationEmail(user.email);
        return NextResponse.json({ message: "order created successfully" }, { status: 201 });


    } catch (error) {
        if (error instanceof ZodError) {

            const errors = error.issues.map(e => ({
                path: e.path.join("."),
                message: e.message
            }));

            console.log("validation errors: ", errors);
            return NextResponse.json({ message: "validation error", errors}, { status: 400 });

        } else {
            console.error(error);
            return NextResponse.json({ error: error }, { status: 500 });
        }
    }
}