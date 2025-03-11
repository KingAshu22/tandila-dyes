import { connectToDB } from "@/app/_utils/mongodb";
import Manager from "@/models/Manager";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { code } = await params;
  console.log("Inside get /api/managers/:code");
  await connectToDB();
  try {
    const manager = await Manager.find({ code: code });

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

export async function PUT(req, { params }) {
  try {
    console.log("Updating Manager");
    await connectToDB();
    const { code } = await params; // Correctly extract params
    const body = await req.json(); // Parse the incoming JSON data

    const updatedManager = await Manager.findOneAndUpdate(
      { code }, // Use a proper query object
      body,
      { new: true }
    );

    if (!updatedManager) {
      return new Response(JSON.stringify({ message: "Manager not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "Manager updated successfully!", updatedManager }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error updating Manager data:", error);
    return new Response(
      JSON.stringify({
        message: "Failed to update Manager data.",
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
    console.log("Deleting Manager");
    await connectToDB();
    const { code } = await params; // Correctly extract params
    const deletedManager = await Manager.findOneAndDelete({ code }); // Use a proper query object

    if (!deletedManager) {
      return NextResponse.json({ error: "Manager not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Manager deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting Manager data:", error);
    return NextResponse.json(
      { message: "Failed to delete Manager data." },
      { status: 500 }
    );
  }
}
