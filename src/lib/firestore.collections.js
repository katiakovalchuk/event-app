import { db } from "./init-firebase";
import { collection } from "firebase/firestore";

export const usersCollectionRef = collection(db, "test_users");
export const eventsCollectionRef = collection(db, "events");
export const infoCollectionRef = collection(db, "info");
