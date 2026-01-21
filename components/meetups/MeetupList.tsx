//Necessary Imports.
import MeetupItem from "./MeetupItem";
import classes from "./MeetupList.module.css";
import { deleteMeetup } from "@/lib/meetup";
import { revalidatePath } from "next/cache";
import React from "react";

//Interface to describe the shape of Meetup.
interface Meetup {
  id: string;
  image: string;
  title: string;
  address: string;
}
//Interface to describe what the item for MeetupList looks like.
interface MeetupListProps {
  meetups: Meetup[];
}

function MeetupList(props: MeetupListProps) {
  //Functional component required for deleting meetups.
  async function handleDelete(id: string) {
    "use server"; //Backend is required for this bit.
    await deleteMeetup(id);
    revalidatePath("/");
  }
  return (
    <ul className={classes.list}>
      {props.meetups.map((meetup) => (
        <MeetupItem
          key={meetup.id}
          id={meetup.id}
          image={meetup.image}
          title={meetup.title}
          address={meetup.address}
          onDelete={handleDelete}
        />
      ))}
    </ul>
  );
}

export default MeetupList;
