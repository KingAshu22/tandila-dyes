import { connectToDB } from "@/app/_utils/mongodb";
import Manager from "@/models/Manager";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, password } = await req.json(); // Parse the incoming JSON body

    await connectToDB();

    // Find the admin by email
    const manager = await Manager.findOne({ email });

    if (!manager) {
      return NextResponse.json({ error: "Incorrect Email" }, { status: 400 });
    }

    // Check if the password matches
    if (manager.password !== password) {
      return NextResponse.json(
        { error: "Incorrect Password" },
        { status: 400 }
      );
    }

    // Return the admin details if authentication is successful
    return NextResponse.json({ manager });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
