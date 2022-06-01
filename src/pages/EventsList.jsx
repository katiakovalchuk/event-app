import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { Table, Container } from "react-bootstrap";

import eventsList from "../data/eventsList.json";
import EventForm from "../components/forms/EventForm";

const EventsList = () => {
  const oderedEvents = [...eventsList].sort((a, b) =>
    b.date.localeCompare(a.date)
  );
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
          <p>No Events</p>
        )}
      </Table>
      <EventForm />
    </Container>
  );
};

export default EventsList;
