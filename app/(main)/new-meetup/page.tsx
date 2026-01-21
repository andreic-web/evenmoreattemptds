//Server component (Displays the title)
import NewMeetup from "./NewMeetup";
import { getSession } from "@/lib";
import { redirect } from "next/navigation";

// The title and description
export const metadata = {
  title: "The Form to my Actual First Website!",
  description:
    "Anyways, make your own meetups, both real and in your mind. From a church to the literal edge of the universe, your networking creativity is the limit!",
};

export default async function Page() {
  const session = await getSession();

  if (!session) {
    redirect("/login"); // Told you.
  }
  // This is a server component wrapping the client component
  return <NewMeetup />;
}
