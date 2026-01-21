"use client";

//Mandatory imports required.
import classes from "./MeetupDetail.module.css";
import { useRouter } from "next/navigation";
import React from "react";

//Interface to describe the props for MeetupDetail.
interface MeetupDetailProps {
  id: string;
  image: string;
  title: string;
  address: string;
  description: string;
}

function MeetupDetail(props: MeetupDetailProps) {
  //To navigate programmatically.

  const router = useRouter();

  function showDetailsHandler() {
    router.push("/" + props.id);
  }

  //Rendering MeetupDetail with provided props.

  return (
    <section className={classes.detail}>
      <img src={props.image} alt={props.title} />
      <h1>{props.title}</h1>
      <address>{props.address}</address>
      <p>{props.description}</p>
      <div className={classes.actions}></div>
    </section>
  );
}

export default MeetupDetail;
