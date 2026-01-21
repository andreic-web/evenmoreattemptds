import Link from "next/link";
import classes from "./MainNavigation.module.css";
import React from "react";
import { logout } from "@/lib";
import { redirect } from "next/navigation";

export default function MainNavigation() {
  async function handleLogout() {
    "use server"; //Yes, this is a server, Typescript App Router components are Server-side unless indicated otherwise.
    await logout();
    redirect("/login");
  }
  return (
    <header className={classes.header}>
      <div className={classes.logo}>React Meetups</div>
      <nav>
        <ul>
          <li>
            <Link href="/">All Meetups</Link>
          </li>
          <li>
            <Link href="/new-meetup">Add New Meetup</Link>
          </li>
          <li>
            <form action={handleLogout}>
              <button type="submit" className={classes.logout}>
                Log-Out
              </button>
            </form>
          </li>
        </ul>
      </nav>
    </header>
  );
}
