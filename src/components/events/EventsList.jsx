import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { GoTrashcan } from "react-icons/go";
import { RiEdit2Fill } from "react-icons/ri";

import { useDialog } from "../../context/dialogContext";
import {
  getEvents,
  selectAllEvents,
  deleteNewEvent,
} from "../../store/slices/eventsSlice";

import EventPart from "./EventPart";
import Spinner from "../Spinner";
import { CustomToast } from "../elements";

const EventsList = () => {
  const { startEdit, handleShowToast } = useDialog();
  const dispatch = useDispatch();
  const events = useSelector(selectAllEvents);
  const { status, error } = useSelector((state) => state.eventsSlice);

  const oderedEvents = [...events].sort((a, b) =>
    b.eventDate.localeCompare(a.eventDate)
  );

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  useEffect(() => {
    if (status === "failed") {
      handleShowToast();
    }
  }, [status]);

  return (
    <>
      {status === "loading" && <Spinner />}

      {status === "failed" && (
        <CustomToast
          toastHeading="Server Error"
          toastText={error}
          variant="danger"
        />
      )}

      {oderedEvents.length ? (
        <ul className="event__list">
          {oderedEvents.map((event) => (
            <li className="event__item" key={event.id}>
              <EventPart {...event} />
              <div className="event__actions">
                <span
                  className="event__action"
                  onClick={() => {
                    dispatch(deleteNewEvent(event.id));
                  }}
                >
                  <GoTrashcan />
                </span>
                <span
                  className="event__action"
                  onClick={() => {
                    startEdit(event);
                  }}
                >
                  <RiEdit2Fill />
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <h3 className="text-center">Please add your first Event</h3>
      )}
    </>
  );
};

export default EventsList;
