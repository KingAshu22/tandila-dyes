import { connectToDB } from "@/app/_utils/mongodb";
import Entry from "@/models/Entry";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const { clientCode } = await params;
    console.log("Inside get /api/entry/client/:clientCode");
    await connectToDB();
    try {
        const entries = await Entry.find({ clientCode: clientCode });

        if (!entries) {
            return NextResponse.json({ message: "Entries not found" }, { status: 404 });
        }

        return NextResponse.json(entries);
    } catch (error) {
        console.error("Error fetching Entries data:", error);
        return NextResponse.json(
            { message: "Failed to fetch Entries data.", error: error.message },
            { status: 500 }
        );
    }
}
