import { connectToDB } from "@/app/_utils/mongodb";
import Staff from "@/models/Staff";
import { NextResponse } from "next/server";


export async function GET() {
    await connectToDB()

    try {
        const lastStaff = await Staff.findOne({}).sort({ _id: -1 }).select("code")

        let code
        if (!lastStaff) {
            // If no staff exist, start with 0
            code = "0000"
        } else {
            // return the last code
            code = lastStaff.code
        }

        return NextResponse.json({
            code
        })
    } catch (error) {
        console.error("Error fetching Staff:", error.message)
        return NextResponse.json({ error: "Failed to fetch staff" }, { status: 500 })
    }
}
