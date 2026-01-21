//Client Component.
"use client";
import { Fragment } from "react";
import { useRouter } from "next/navigation";
import NewMeetupForm from "@/components/meetups/NewMeetupForm";

//Define MeetupData Shape
interface MeetupData {
  title: string;
  image: string;
  address: string;
  description: string;
}

export default function NewMeetup() {
  const router = useRouter();

  //Handle the syntax for MeetupData titles.
  async function addMeetupHandler(enteredMeetupData: MeetupData) {
    const response = await fetch("/api/new-meetup", {
      method: "POST",
      body: JSON.stringify(enteredMeetupData),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    console.log(data);
    router.push("/");
  }

  //Generate the actual meetup data.
  return (
    <Fragment>
      <NewMeetupForm onAddMeetup={addMeetupHandler} />
    </Fragment>
  );
}
