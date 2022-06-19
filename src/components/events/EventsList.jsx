import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";

import { GoTrashcan } from "react-icons/go";
import { RiEdit2Fill } from "react-icons/ri";

import { useDialog } from "../../context/dialogContext";
import {
  getNewEvents,
  selectAllEvents,
  deleteNewEvent,
} from "../../store/slices/eventsSlice";
import { deleteAllMembersFromEvent } from "../../store/slices/membersSlice";

import EventPart from "./EventPart";
import Spinner from "../Spinner";
import { CustomButton, ListItem } from "../elements";

const EventsList = () => {
  const { startEdit } = useDialog();
  const dispatch = useDispatch();
  const events = useSelector(selectAllEvents);
  const { status } = useSelector((state) => state.eventsSlice);

  const oderedEvents = [...events].sort((a, b) =>
    b.eventDate.localeCompare(a.eventDate)
  );

  useEffect(() => {
    dispatch(getNewEvents());
  }, [dispatch]);

  const deleteEvent = (id) => {
    dispatch(deleteAllMembersFromEvent(id));
    dispatch(deleteNewEvent(id));
  };

  return (
    <>
      <ToastContainer limit={5} />
      {status === "loading" && <Spinner />}
      {oderedEvents.length ? (
        <ul className="event__list">
          {oderedEvents.map((event) => (
            <ListItem link key={event.id}>
              <EventPart {...event} />
              <div className="event__actions">
                <CustomButton
                  version="action"
                  onClick={() => {
                    deleteEvent(event.id);
                  }}
                >
                  <GoTrashcan />
                </CustomButton>
                <CustomButton
                  version="action"
                  onClick={() => {
                    startEdit(event);
                  }}
                >
                  <RiEdit2Fill />
                </CustomButton>
              </div>
            </ListItem>
          ))}
        </ul>
      ) : (
        <h3 className="check-text">Please add your first event</h3>
      )}
    </>
  );
};

export default EventsList;
