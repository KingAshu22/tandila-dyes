import { connectToDB } from "@/app/_utils/mongodb";
import RollPress from "@/models/RollPress";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const { challanNo } = await params;
    console.log("Inside get /api/rollpress/:challanNo");
    await connectToDB();
    try {
        const rollpress = await RollPress.find({ challanNo: challanNo });

        if (!rollpress) {
            return NextResponse.json({ message: "Rollpress not found" }, { status: 404 });
        }

        return NextResponse.json(rollpress);
    } catch (error) {
        console.error("Error fetching rollpress data:", error);
        return NextResponse.json(
            { message: "Failed to fetch Rollpress data.", error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(req, { params }) {
    try {
        console.log("Updating Rollpress data...");
        await connectToDB();
        const { challanNo } = await params; // Correctly extract params
        const body = await req.json(); // Parse the incoming JSON data

        const updatedRollPress = await RollPress.findOneAndUpdate(
            { challanNo }, // Use a proper query object
            body,
            { new: true }
        );

        if (!updatedRollPress) {
            return new Response(JSON.stringify({ message: "RollPress not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(
            JSON.stringify({ message: "RollPress updated successfully!", updatedRollPress }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error updating Roll Press data:", error);
        return new Response(
            JSON.stringify({
                message: "Failed to update Roll Press data.",
                error: error.message,
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

export async function DELETE(req, { params }) {
    try {
        console.log("Deleting Roll Press data...");
        await connectToDB();
        const { challanNo } = await params; // Correctly extract params
        const deletedRollPress = await RollPress.findOneAndDelete({ challanNo }); // Use a proper query object

        if (!deletedRollPress) {
            return NextResponse.json({ error: "RollPress not found" }, { status: 404 });
        }

        return NextResponse.json(
            { message: "RollPress deleted successfully!" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting RollPress data:", error);
        return NextResponse.json(
            { message: "Failed to delete RollPress data." },
            { status: 500 }
        );
    }
}
