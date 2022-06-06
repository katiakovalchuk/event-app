import React from "react";
import { useParams } from "react-router-dom";

const EventsItem = () => {
  const { id } = useParams();
  return <div> Event Item with id {id}</div>;
};

export default EventsItem;
