import { connectToDB } from "@/app/_utils/mongodb";
import Entry from "@/models/Entry";
import { NextResponse } from "next/server";

export async function GET(req) {
  console.log("Inside get /api/entry");
  await connectToDB();

  try {
    // Fetch entries
    const entries = await Entry.find().sort({ _id: -1 });

    return NextResponse.json(entries);
  } catch (error) {
    console.error("Error fetching Entries:", error.message);
    return NextResponse.json({ error: "Failed to fetch Entries" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    console.log("Inside /api/entry");
    await connectToDB();
    const data = await req.json(); // Parse JSON body from the request

    console.log(data);

    const entry = new Entry(data);
    await entry.save();

    return NextResponse.json(
      { message: "Entry added successfully!", entry },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /api/entry:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
