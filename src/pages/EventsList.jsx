import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "react-bootstrap";

import { GoTrashcan } from "react-icons/go";
import { RiEdit2Fill } from "react-icons/ri";

import { useDialog } from "../context/dialogContext";
import { getEvents, selectAllEvents } from "../store/slices/eventsSlice";

import { AddButton, ModalForm } from "../components/elements";
import EventForm from "../components/forms/EventForm";
import EventPart from "../components/EventPart";

const EventsList = () => {
  const { handleShow } = useDialog();
  const dispatch = useDispatch();
  const events = useSelector(selectAllEvents);

  const oderedEvents = [...events].sort((a, b) =>
    b.eventDate.localeCompare(a.date)
  );
  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);
  return (
    <Container>
      <AddButton onClick={handleShow} />
      <ul className="event__list">
        {oderedEvents.map((event) => (
          <li className="event__item" key={event.id}>
            <EventPart {...event} />
            <div className="event__actions">
              <span
                className="event__action"
                onClick={() => {
                  console.log("click");
                }}
              >
                <GoTrashcan />
              </span>
              <span className="event__action">
                <RiEdit2Fill />
              </span>
            </div>
          </li>
        ))}
      </ul>

      <ModalForm title="Add a new Event" form={<EventForm />} />
    </Container>
  );
};

export default EventsList;
