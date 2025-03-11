import { connectToDB } from "@/app/_utils/mongodb";
import Manager from "@/models/Manager";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const { code } = await params;
    console.log("Inside get /api/managers/id/:code");
    await connectToDB();
    try {
        const manager = await Manager.findOne({ _id: code });

        if (!manager) {
            return NextResponse.json({ message: "Manager not found" }, { status: 404 });
        }

        return NextResponse.json(manager);
    } catch (error) {
        console.error("Error fetching Manager data:", error);
        return NextResponse.json(
            { message: "Failed to fetch Manager data.", error: error.message },
            { status: 500 }
        );
    }
}
