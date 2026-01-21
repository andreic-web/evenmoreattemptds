//Client Component, btw.
"use client";
//Essential Imports
import { useRouter } from "next/navigation";
import Card from "../ui/Card";
import classes from "./MeetupItem.module.css";
import React from "react";

//Interface to describe the shape of MeetupItemProps.
interface MeetupItemProps {
  id: string;
  image: string;
  title: string;
  address: string;
  onDelete: (id: string) => void;
}

//Create the MeetupItem functional component.
const MeetupItem: React.FC<MeetupItemProps> = (props) => {
  //Necessary code to link to [meetupId].
  const router = useRouter();

  const showDetailsHandler = () => {
    router.push("/" + props.id);
  };

  const deleteHandler = () => {
    const confirmation = window.confirm(
      "Are you sure this is worth it? I hope you didn't have to go there again, because that meetup will be gone forever.",
    );
    if (confirmation) {
      props.onDelete(props.id);
    }
  };
  //Return the item, right before you look at its description.
  return (
    <li className={classes.item}>
      <Card>
        <div className={classes.image}>
          <img src={props.image} alt={props.title} />
        </div>
        <div className={classes.content}>
          <h3>{props.title}</h3>
          <address>{props.address}</address>
        </div>
        <div className={classes.actions}>
          <button onClick={showDetailsHandler}>Show Details</button>
          <button onClick={deleteHandler}>Delete Meetup</button>
        </div>
      </Card>
    </li>
  );
};

export default MeetupItem;
