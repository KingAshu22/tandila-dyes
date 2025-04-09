import { connectToDB } from "@/app/_utils/mongodb";
import RollPress from "@/models/RollPress";
import { NextResponse } from "next/server";

export async function GET(req) {
    console.log("Inside get /api/rollpress");
    await connectToDB();

    try {
        // Fetch rollpress
        const rollpress = await RollPress.find().sort({ _id: -1 });

        return NextResponse.json(rollpress);
    } catch (error) {
        console.error("Error fetching RollPress:", error.message);
        return NextResponse.json({ error: "Failed to fetch Rollpress" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        console.log("Inside /api/rollpress");
        await connectToDB();
        const data = await req.json(); // Parse JSON body from the request

        console.log(data);

        const rollpress = new RollPress(data);
        await rollpress.save();

        return NextResponse.json(
            { message: "Rollpress added successfully!", rollpress },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in POST /api/rollpress:", error.message);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
