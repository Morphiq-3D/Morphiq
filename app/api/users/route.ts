import { getUsers } from "@/services/users.service";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        return NextResponse.json({ result: await getUsers() }, { status: 200 });
    } catch (e: unknown) {
        return NextResponse.json({ error: e }, { status: 500 });
    }
}