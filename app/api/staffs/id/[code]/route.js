import { connectToDB } from "@/app/_utils/mongodb";
import Staff from "@/models/Staff";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const { code } = await params;
    console.log("Inside get /api/staffs/id/:code");
    await connectToDB();
    try {
        const staff = await Staff.findOne({ _id: code });

        if (!staff) {
            return NextResponse.json({ message: "Staff s not found" }, { status: 404 });
        }

        return NextResponse.json(staff);
    } catch (error) {
        console.error("Error fetching Staff data:", error);
        return NextResponse.json(
            { message: "Failed to fetch Staff data.", error: error.message },
            { status: 500 }
        );
    }
}
