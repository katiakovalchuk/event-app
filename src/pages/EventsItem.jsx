import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { getNewEvent } from "../store/slices/eventSlice";
import { getNewMembers } from "../store/slices/membersSlice";

import AllMembers from "../components/events/AllMembers";
import EventMembers from "../components/events/EventMembers";
import EventDescription from "../components/events/EventDescription";
import Spinner from "../components/Spinner";

import "../styles/event-item.scss";

const EventsItem = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.eventSlice);
  useEffect(() => {
    dispatch(getNewEvent(id));
  }, [id]);

  useEffect(() => {
    dispatch(getNewMembers());
  }, [dispatch]);

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
