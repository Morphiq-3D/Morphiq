import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function POST(req: NextRequest) {
    const { folder } = await req.json();
    const timestamp = Math.round((new Date()).getTime() / 1000);

    const params = {
        timestamp,
        folder,
    };

    try {
        if (!process.env.CLOUDINARY_API_SECRET) {
            throw new Error("Missing CLOUDINARY_API_SECRET environment variable");
        }

        const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET);

        return NextResponse.json({
            folder,
            signature,
            timestamp,
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY
        });
    } catch (error: unknown) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}