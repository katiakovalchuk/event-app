import { db } from "./init-firebase";
import { collection } from "firebase/firestore";

export const usersCollectionRef = collection(db, "users_test");
export const eventsCollectionRef = collection(db, "events");
