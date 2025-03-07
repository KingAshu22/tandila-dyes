import { connectToDB } from "@/app/_utils/mongodb";
import Entry from "@/models/Entry";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const { batchNo } = await params;
    console.log("Inside get /api/entry/:batchNo");
    await connectToDB();
    try {
        const entry = await Entry.find({ batchNo: batchNo });

        if (!entry) {
            return NextResponse.json({ message: "Entry not found" }, { status: 404 });
        }

        return NextResponse.json(entry);
    } catch (error) {
        console.error("Error fetching Entry data:", error);
        return NextResponse.json(
            { message: "Failed to fetch Entry data.", error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(req, { params }) {
    try {
        console.log("Updating Entry");
        await connectToDB();
        const { batchNo } = await params; // Correctly extract params
        const body = await req.json(); // Parse the incoming JSON data

        const updatedEntry = await Entry.findOneAndUpdate(
            { batchNo }, // Use a proper query object
            body,
            { new: true }
        );

        if (!updatedEntry) {
            return new Response(JSON.stringify({ message: "Entry not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(
            JSON.stringify({ message: "Entry updated successfully!", updatedEntry }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error updating Entry data:", error);
        return new Response(
            JSON.stringify({
                message: "Failed to update Entry data.",
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
        console.log("Deleting Entry");
        await connectToDB();
        const { batchNo } = await params; // Correctly extract params
        const deletedEntry = await Entry.findOneAndDelete({ batchNo }); // Use a proper query object

        if (!deletedEntry) {
            return NextResponse.json({ error: "Entry not found" }, { status: 404 });
        }

        return NextResponse.json(
            { message: "Entry deleted successfully!" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting Entry data:", error);
        return NextResponse.json(
            { message: "Failed to delete Entry data." },
            { status: 500 }
        );
    }
}
