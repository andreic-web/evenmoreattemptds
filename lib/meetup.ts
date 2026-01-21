//Required for mongoDB functionalities.

import { getMeetupClient } from "./mongodb";
import { ObjectId } from "mongodb";

//Provides the delete functionality.
export async function deleteMeetup(id: string) {
  const client = await getMeetupClient();
  const db = client.db(process.env.MONGODB_DB);
  await db.collection("meetups").deleteOne({ _id: new ObjectId(id) });
}
