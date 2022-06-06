import { collection } from "firebase/firestore";
import { db } from "./init-firebase";

export const usersCollectionRef = collection(db, "users");
export const eventsCollectionRef = collection(db, "events");
