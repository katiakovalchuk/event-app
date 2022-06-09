import { db } from "./init-firebase";
import { collection } from "firebase/firestore";

export const usersCollectionRef = collection(db, "users");
export const eventsCollectionRef = collection(db, "events");
