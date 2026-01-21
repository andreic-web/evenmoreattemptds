//Required imports
import { redirect } from "next/navigation";
import { getSession } from "@/lib";
import { getMeetupClient } from "../../lib/mongodb";
import MeetupList from "../../components/meetups/MeetupList";
import { Fragment } from "react";

export const revalidate = 5; //5 second revalidation.
//Meetup interface
interface Meetup {
  title: string;
  address: string;
  image: string;
  id: string;
}

export const metadata = {
  title: "My actual first Website!",
  description:
    "Anyways, you can try to browse a bunch of meetups, both real and in your mind.",
};

export default async function Home() {
  //Session getter, to make sure no one tries anything funny.
  const session = await getSession();

  if (!session) {
    redirect("/login"); // Told you.
  }

  // Promise a connection to the MongoDB client
  const client = await getMeetupClient();
  const db = client.db(process.env.MONGODB_DB);

  // Fetch meetups from the collection
  const meetupsCollection = db.collection("meetups");
  const meetups = await meetupsCollection.find().toArray();

  // Map results into your interface shape
  const formattedMeetups: Meetup[] = meetups.map((meetup: any) => ({
    title: meetup.title,
    address: meetup.address,
    image: meetup.image,
    id: meetup._id.toString(),
  }));

  // Render directly — no getStaticProps needed
  return (
    <Fragment>
      <MeetupList meetups={formattedMeetups} />
    </Fragment>
  );
}
