import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import { getEvent } from "../store/slices/eventSlice";
import { getMembers } from "../store/slices/usersSlice";

import AllMembers from "../components/events/AllMembers";
import EventMembers from "../components/events/EventMembers";
import EventDescription from "../components/events/EventDescription";

import "../styles/event-item.scss";

const EventsItem = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getEvent(id));
  }, [id]);

  useEffect(() => {
    dispatch(getMembers());
  }, [dispatch]);

  return (
    <>
      <EventDescription />
      <EventMembers />
      <AllMembers />
    </>
  );
};

export default EventsItem;
