import React from "react";
import { useParams } from "react-router-dom";

const EventsItem = () => {
  const { id } = useParams();
  return (
    <div>
      <h2>EventItem with {id}</h2>
    </div>
  );
};

export default EventsItem;
