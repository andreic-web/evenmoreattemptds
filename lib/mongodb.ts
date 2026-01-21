//MongoDB functionality is here.
import { MongoClient } from "mongodb";

//To provide lazy runtime access.
let clientPromise: Promise<MongoClient> | null = null;

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    if (process.env.NODE_ENV === "production") {
      return "";
    }
    throw new Error(`What is wrong with you, ${name}!?!?!?`);
  }
  return value;
}

export async function getMeetupClient() {
  if (!clientPromise) {
    const uri = getEnv("MONGODB_URI");
    const client = new MongoClient(uri);
    clientPromise = client.connect();
  }

  return clientPromise;
}
