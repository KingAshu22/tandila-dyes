import { connectToDB } from "@/app/_utils/mongodb"
import Entry from "@/models/Entry"
import { NextResponse } from "next/server"

export async function GET(req) {
    const url = new URL(req.url)
    const clientCode = url.searchParams.get("clientCode")
    const fromDate = url.searchParams.get("fromDate")
    const toDate = url.searchParams.get("toDate")

    if (!clientCode || !fromDate || !toDate) {
        return NextResponse.json({ message: "Missing required parameters: clientCode, fromDate, toDate" }, { status: 400 })
    }

    await connectToDB()

    try {
        // Convert string dates to Date objects
        const startDate = new Date(fromDate)
        const endDate = new Date(toDate)
        // Set endDate to end of day
        endDate.setHours(23, 59, 59, 999)

        const entries = await Entry.find({
            clientCode: clientCode,
            date: {
                $gte: startDate,
                $lte: endDate,
            },
        })

        if (!entries || entries.length === 0) {
            return NextResponse.json({
                message: "No entries found for this client in the specified date range",
                totalAmount: 0,
            })
        }

        // Calculate total amount from all work orders
        let totalAmount = 0
        entries.forEach((entry) => {
            entry.workOrder.forEach((order) => {
                totalAmount += order.amount
            })
        })

        return NextResponse.json({
            entries,
            totalAmount,
        })
    } catch (error) {
        console.error("Error fetching entries by date range:", error)
        return NextResponse.json({ message: "Failed to fetch entries data.", error: error.message }, { status: 500 })
    }
}

