import { NextResponse } from "next/server";
import { getMeetupClient } from "../../../lib/mongodb";
import { NextRequest } from "next/server";
import { updateSession } from "@/lib";

// Define the shape of incoming data
interface MeetupData {
  title: string;
  image: string;
  address: string;
  description: string;
}

// Handle POST requests

export async function POST(req: Request) {
  try {
    const data: MeetupData = await req.json();

    // Connect to MongoDB using clientPromise
    const client = await getMeetupClient();
    const db = client.db(process.env.MONGODB_DB ?? "meetups");

    const meetupsCollection = db.collection("meetups");
    const result = await meetupsCollection.insertOne(data);

    console.log("Inserted meetup:", result);

    return NextResponse.json({ message: "Meetup inserted!" }, { status: 201 });
  } catch (error) {
    console.error("Error inserting meetup:", error);
    return NextResponse.json(
      { message: "Failed to insert meetup" },
      { status: 500 },
    );
  }
}
