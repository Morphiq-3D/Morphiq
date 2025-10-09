import { NextRequest, NextResponse } from "next/server";
import { Order, User } from "@/db/types";
import { createOrder } from "@/services/orders.service";
import { createUser, getUserByEmail } from "@/services/users.service";
import { sendDesignOrderConfirmationEmail, sendWelcomeEmail } from "@/services/mail.service";
import { orderInsertSchema } from "@/validation/orders.schema";
import { userInsertSchema } from "@/validation/users.schema";
import { z, ZodError } from "zod";

const requestSchema = z.object({
    user: userInsertSchema,
    order: orderInsertSchema
})

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        // console.log("request body: ", body);

        const structuredBody = {
            user: {
                fname: body.fname,
                lname: body.lname,
                email: body.email,
                phone: body.phone
            },
            order: {
                userId: 0,
                type: "design",
                description: body.description
            }
        }

        const parsed = requestSchema.parse(structuredBody);
        const { user, order } = parsed;

        const userResult: User[] = await getUserByEmail(user.email);
        console.log(`searching for a user with the email ${user.email}, result: `, userResult);

        if (userResult.length > 0) {
            // user exists
            order.userId = userResult[0].id;
            console.log(`user with email ${user.email} exists, order added to there account`);
        } else {
            // user doesn't exist, create a new user
            const createdUser: User[] = await createUser(user);
            if (createdUser) { order.userId = createdUser[0].id };
            console.log(`user with email ${user.email} does not exist, created a new user account`);
            sendWelcomeEmail(user.email);
        }

        const createdOrder: Order[] = await createOrder(order);
        if (createdOrder.length === 0) {
            console.error("order creation may have failed");
            return NextResponse.json({ message: "order creation may have failed" }, { status: 500 });
        }

        console.log("order created successfully");
        sendDesignOrderConfirmationEmail(user.email);
        return NextResponse.json({ message: "order created successfully" }, { status: 201 });

    } catch (error) {
        if (error instanceof ZodError) {

            const errors = error.issues.map(e => ({
                path: e.path.join("."),
                message: e.message
            }));

            console.log("validation errors: ", errors);
            return NextResponse.json({ message: "validation error", errors }, { status: 400 });

        } else {
            console.error(error);
            return NextResponse.json({ error: error }, { status: 500 });
        }
    }
}