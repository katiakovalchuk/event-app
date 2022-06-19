import React from "react";
import { Container } from "react-bootstrap";

import { useDialog } from "../context/dialogContext";

import { AddButton, ModalForm } from "../components/elements";
import EventsList from "../components/events/EventsList";
import EventForm from "../components/forms/EventForm";

const Events = () => {
  const { handleShowModal } = useDialog();

  return (
    <Container>
      <AddButton onClick={handleShowModal} />
      <EventsList />
      <ModalForm title="Add a new Event" form={<EventForm />} />
    </Container>
  );
};

export default Events;
