import { connectToDB } from "@/app/_utils/mongodb";
import Manager from "@/models/Manager";
import { NextResponse } from "next/server";


export async function GET() {
    await connectToDB()

    try {
        // Fetch the last document for the invoice number
        const lastManager = await Manager.findOne({}).sort({ _id: -1 }).select("code")

        let code
        if (!lastManager) {
            // If no AWBs exist, start with invoice number 0
            code = "0000"
        } else {
            // Increment the last invoice number
            code = lastManager.code
        }

        return NextResponse.json({
            code
        })
    } catch (error) {
        console.error("Error fetching Manager:", error.message)
        return NextResponse.json({ error: "Failed to fetch Manager" }, { status: 500 })
    }
}
