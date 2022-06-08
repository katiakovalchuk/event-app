import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { Table, Container } from "react-bootstrap";

import eventsList from "../data/eventsList.json";
import { useToast } from "../context/toastContext";

import { CustomButton } from "../components/elements";
import EventModal from "../components/modals/EventModal";

const EventsList = () => {
  const oderedEvents = [...eventsList].sort((a, b) =>
    b.date.localeCompare(a.date)
  );
  const { showToast } = useToast();
  return (
    <Container>
      <CustomButton variant="primary" size="lg" onClick={showToast}>
        Add a new Event
      </CustomButton>
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
      <EventModal />
    </Container>
  );
};

export default EventsList;
