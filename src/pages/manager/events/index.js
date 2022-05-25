import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { Table, Container } from "react-bootstrap";

import events from "../../../data/events-data.json";

const EventsList = () => {
  const oderedEvents = [...events].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <Container>
      {/* Button */}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Date</th>
          </tr>
        </thead>
        {oderedEvents.length ? (
          <tbody>
            {oderedEvents.map(({ id, eventName, date }) => (
              <tr key={id}>
                <td>
                  <Link to={`/events/${id}`}>{eventName}</Link>
                </td>
                <td>{moment(date).format("MMMM Do YYYY, h:mm a")}</td>
              </tr>
            ))}
          </tbody>
        ) : (
          <span>No Events</span>
        )}
      </Table>
    </Container>
  );
};

export default EventsList;
