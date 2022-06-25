import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Container } from "react-bootstrap";
import { BsPlusLg } from "react-icons/bs";
import moment from "moment";

import { CustomButton, ModalForm } from "../components/elements";
import EventsList from "../components/events/EventsList";
import EventForm from "../components/forms/EventForm";
import ConfirmForm from "../components/forms/ConfirmForm";
import { capitalizeFirstLet } from "../helpers/string";
import {
  addNewEvent,
  deleteNewEvent,
  updateNewEvent,
} from "../store/slices/eventsSlice";
import { useDialog } from "../context/dialogContext";
import { deleteEventFromAllUsers } from "../store/slices/membersSlice";

const Events = () => {
  const {
    handleShowModal,
    handleCloseModal,
    requireConfirm,
    removeRequireConfirm,
    itemEdit,
    hideEdit,
    deleteMode,
    removeDelete,
  } = useDialog();
  const [formData, setFormData] = useState({});
  const [idToDelete, setIdToDelete] = useState(null);
  const dispatch = useDispatch();
  let timerId;

  useEffect(() => {
    return timerId;
  }, []);

  const requestData = (data) => {
    setFormData(data);
  };

  const requestIdToDelete = (id) => {
    setIdToDelete(id);
  };

  const onSubmitEventForm = (data) => {
    const event = {
      ...data,
      eventName: capitalizeFirstLet(data.eventName),
      eventDate: moment(data.eventDate).format("yyyy-MM-DD HH:mm"),
      membersList: [],
    };
    itemEdit.edit
      ? dispatch(updateNewEvent(event))
      : dispatch(addNewEvent(event));
    hideEdit();
  };

  const deleteEvent = (id) => {
    dispatch(deleteEventFromAllUsers(id));
    dispatch(deleteNewEvent(id));
  };

  return (
    <Container fluid="xl">
      <CustomButton
        variant="primary"
        version="add"
        onClick={() => {
          handleShowModal();
          removeRequireConfirm();
        }}
      >
        <BsPlusLg />
      </CustomButton>
      <EventsList requestIdToDelete={requestIdToDelete} />
      <ModalForm
        title={
          requireConfirm && deleteMode
            ? "Do You confirm deleting event?"
            : requireConfirm && !itemEdit.edit
            ? "Do You confirm adding new event?"
            : !requireConfirm && !itemEdit.edit
            ? "Add a new Event"
            : requireConfirm && itemEdit.edit
            ? "Do You confirm updating event?"
            : "Update event"
        }
        form={
          requireConfirm && deleteMode ? (
            <ConfirmForm
              handleConfirmation={(e) => {
                e.preventDefault();
                deleteEvent(idToDelete);
                removeDelete();
                handleCloseModal();
              }}
            />
          ) : requireConfirm ? (
            <ConfirmForm
              handleConfirmation={(e) => {
                e.preventDefault();
                onSubmitEventForm(formData);
                timerId = setTimeout(() => {
                  removeRequireConfirm();
                }, 300);
              }}
            />
          ) : (
            <EventForm requestData={requestData} />
          )
        }
      />
    </Container>
  );
};

export default Events;
