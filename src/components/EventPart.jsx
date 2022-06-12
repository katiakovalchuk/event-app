import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import { ellipsify } from "../helpers/string";

import "../styles/eventlist.scss";

const EventPart = ({
  eventName,
  eventDescription,
  eventPlace,
  cityName,
  eventDate,
  id,
}) => {
  return (
    <Link className="event__link" to={`/events/${id}`}>
      <div className="event__left">
        <h4 className="event__name">{eventName}</h4>
        {eventDescription && (
          <p className="event__descr">{ellipsify(eventDescription, 250)}</p>
        )}
      </div>
      <div className="event__right">
        {eventPlace === "city" ? (
          <h4 className="event__place">{cityName}</h4>
        ) : (
          <div className="event__place">{eventPlace}</div>
        )}
        <div className="event__date">{eventDate}</div>
      </div>
    </Link>
  );
};

EventPart.propTypes = {
  eventName: PropTypes.string,
  eventDate: PropTypes.string,
  eventDescription: PropTypes.string,
  eventPlace: PropTypes.string,
  cityName: PropTypes.string,
  id: PropTypes.string,
};

export default EventPart;
