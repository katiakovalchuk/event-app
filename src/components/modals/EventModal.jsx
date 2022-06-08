import React from "react";
import { Modal } from "react-bootstrap";

import { useToast } from "../../context/toastContext";
import EventForm from "../forms/EventForm";

import "react-datepicker/dist/react-datepicker.css";
import "../../styles/form.scss";

const EventModal = () => {
  const { isToastShown, hideToast } = useToast();
  return (
    <Modal show={isToastShown} onHide={hideToast}>
      <Modal.Header closeButton>
        <Modal.Title>Please fill in the form</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <EventForm />
      </Modal.Body>
    </Modal>
  );
};

export default EventModal;
