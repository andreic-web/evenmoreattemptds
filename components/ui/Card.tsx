//Necessary Imports.
import classes from "./Card.module.css";
import React, { ReactNode } from "react";

//Interface to describe that Card component will have ReactNode as children.
interface CardProps {
  children: ReactNode;
}

//To actually display the Card component.
function Card(props: CardProps) {
  return <div className={classes.card}>{props.children}</div>;
}

export default Card;
