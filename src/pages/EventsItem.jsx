import React from "react";
import { useSelector } from "react-redux";

import { ToastContainer } from "react-toastify";

import AllMembers from "../components/events/AllMembers";
import EventMembers from "../components/events/EventMembers";
import EventDescription from "../components/events/EventDescription";
import Spinner from "../components/Spinner";

import "../styles/event-item.scss";

const EventsItem = () => {
  const { status } = useSelector((state) => state.eventSlice);

  return (
    <>
      <ToastContainer limit={5} />
      {status === "loading" && <Spinner />}
      <EventDescription />
      <EventMembers />
      <AllMembers />
    </>
  );
};

export default EventsItem;
