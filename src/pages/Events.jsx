import React from "react";
import { Container } from "react-bootstrap";
import { BsPlusLg } from "react-icons/bs";

import { useDialog } from "../context/dialogContext";

import { CustomButton, ModalForm } from "../components/elements";
import EventsList from "../components/events/EventsList";
import EventForm from "../components/forms/EventForm";

const Events = () => {
  const { handleShowModal } = useDialog();

  return (
    <Container fluid="xl">
      <CustomButton variant="primary" version="add" onClick={handleShowModal}>
        <BsPlusLg />
      </CustomButton>
      <EventsList />
      <ModalForm title="Add a new Event" form={<EventForm />} />
    </Container>
  );
};

export default Events;
