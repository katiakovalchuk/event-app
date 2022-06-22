import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { GoTrashcan } from "react-icons/go";
import { RiEdit2Fill } from "react-icons/ri";
import { BiDownArrow, BiUpArrow } from "react-icons/bi";

import { useDialog } from "../../context/dialogContext";
import { usePagination } from "../../hooks/usePagination";
import {
  deleteNewEvent,
  getNewEvents,
  selectAllEvents,
} from "../../store/slices/eventsSlice";
import { deleteAllMembersFromEvent } from "../../store/slices/membersSlice";

import EventPart from "./EventPart";
import Spinner from "../Spinner";
import Pagination from "../Pagination";
import { CustomButton, ListItem } from "../elements";
import { search } from "../../helpers/utils";

const EventsList = () => {
  const { startEdit } = useDialog();
  const dispatch = useDispatch();
  const events = useSelector(selectAllEvents);
  const { status } = useSelector((state) => state.eventsSlice);
  const [query, setQuery] = useState("");
  const [asc, setAsc] = useState(true);
  const keys = [
    "eventDate",
    "eventName",
    "cityName",
    "eventPlace",
    "eventDescription",
  ];

  const handleOrder = () => setAsc((prev) => !prev);

  const oderedEvents = asc
    ? [...events].sort((a, b) => b.eventDate.localeCompare(a.eventDate))
    : [...events].sort((a, b) => a.eventDate.localeCompare(b.eventDate));
  console.log(oderedEvents);

  const searchedEvents = search(oderedEvents, keys, query);

  const { pageCount, currentPage, handlePageClick, currentItems } =
    usePagination({ query, status, data: searchedEvents });

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
      <div className="d-flex justify-content-end">
        <input
          className="event-search form-control me-2 mt-5"
          type="search"
          placeholder="Search..."
          aria-label="Search"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div onClick={handleOrder}>{asc ? <BiUpArrow /> : <BiDownArrow />}</div>

      {currentItems?.length ? (
        <div className="mb-5">
          <ul className="event__list">
            {currentItems.map((event) => (
              <ListItem link key={event.id}>
                <EventPart {...event} />
                <div className="event__actions">
                  <CustomButton
                    version="action"
                    onClick={() => {
                      startEdit(event);
                    }}
                  >
                    <RiEdit2Fill className="icon" />
                  </CustomButton>
                  <CustomButton
                    version="action"
                    variant="danger"
                    onClick={() => {
                      deleteEvent(event.id);
                    }}
                  >
                    <GoTrashcan className="icon" />
                  </CustomButton>
                </div>
              </ListItem>
            ))}
          </ul>
          <Pagination
            pageCount={pageCount}
            currentPage={currentPage}
            handlePageClick={handlePageClick}
          />
        </div>
      ) : (
        <h3 className="check-text my-5">Sorry, there are no events</h3>
      )}
    </>
  );
};

export default EventsList;
