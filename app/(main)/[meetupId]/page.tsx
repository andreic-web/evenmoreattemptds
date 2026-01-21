// app/[meetupId]/page.tsx
import { getMeetupClient } from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import MeetupDetail from "../../../components/meetups/MeetupDetail";
import { Metadata } from "next";
import { getSession } from "@/lib";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 5;

//Generate the data for the meetup, also allows Dynamic titles and descriptions based on Meetup Selected.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ meetupId: string }>;
}) {
  const { meetupId } = await params;

  const client = await getMeetupClient();
  const db = client.db(process.env.MONGODB_DB);
  const meetupsCollection = db.collection("meetups");

  const selectedMeetup = await meetupsCollection.findOne({
    _id: new ObjectId(meetupId),
  });

  if (!selectedMeetup) {
    return {
      title: "Meetup not found",
      description: "This meetup does not exist.",
    };
  }

  return {
    title: selectedMeetup.title,
    description: selectedMeetup.description,
  };
}

export default async function MeetupPage({
  params,
}: {
  params: Promise<{ meetupId: string }>;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login"); // Told you.
  }
  //Get details about the meetup
  const { meetupId } = await params;
  const client = await getMeetupClient();
  const db = client.db(process.env.MONGODB_DB);
  const meetupsCollection = db.collection("meetups");
  //Find said meetup in the MongoDB database.
  const selectedMeetup = await meetupsCollection.findOne({
    _id: new ObjectId(meetupId),
  });
  //If meetup is missing.
  if (!selectedMeetup) {
    return <div>Meetup not found</div>;
  }
  return (
    <MeetupDetail
      id={selectedMeetup._id.toString()}
      image={selectedMeetup.image}
      title={selectedMeetup.title}
      address={selectedMeetup.address}
      description={selectedMeetup.description}
    />
  );
}
