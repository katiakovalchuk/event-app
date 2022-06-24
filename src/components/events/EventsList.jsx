import React, { useEffect, useState } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { GoTrashcan } from "react-icons/go";
import { RiEdit2Fill } from "react-icons/ri";
import { BiDownArrow, BiUpArrow } from "react-icons/bi";

import { useDialog } from "../../context/dialogContext";
import { usePaginate2 } from "../../hooks/usePaginate2";
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
  const [order, setOrder] = useState("asc");
  const [filterBtn, setFilterBtn] = useState("all");
  const today = moment().format("yyyy-MM-DD");

  const keys = [
    "eventDate",
    "eventName",
    "cityName",
    "eventPlace",
    "eventDescription",
  ];

  useEffect(() => {
    dispatch(getNewEvents());
  }, [dispatch]);

  const filteredEvents =
    filterBtn === "all"
      ? events
      : filterBtn === "future"
      ? events.filter((event) => moment(event.eventDate).isAfter(today))
      : events.filter((event) => moment(event.eventDate).isBefore(today));

  const sortedEvents =
    order === "asc"
      ? [...filteredEvents].sort((a, b) =>
          b.eventDate.localeCompare(a.eventDate)
        )
      : [...filteredEvents].sort((a, b) =>
          a.eventDate.localeCompare(b.eventDate)
        );

  const searchedEvents = search(sortedEvents, keys, query);

  const { pageCount, handlePageClick, displayItems } = usePaginate2({
    data: searchedEvents,
    itemsPerPage: 6,
  });

  //sort
  const handleOrder = () =>
    setOrder((prev) => (prev === "asc" ? "dsc" : "asc"));

  //filter
  const filterAll = () => {
    setFilterBtn("all");
  };
  const filterFuture = () => {
    setFilterBtn("future");
  };
  const filterPast = () => {
    setFilterBtn("past");
  };

  const deleteEvent = (id) => {
    dispatch(deleteAllMembersFromEvent(id));
    dispatch(deleteNewEvent(id));
  };

  return (
    <section className="event">
      <ToastContainer limit={5} />
      {status === "loading" && <Spinner />}
      <div className="event__func">
        <div className="event__filter">
          <CustomButton
            className={`tab ${filterBtn === "all" && "tab-active"}`}
            onClick={filterAll}
          >
            All
          </CustomButton>
          <CustomButton
            className={`tab ${filterBtn === "future" && "tab-active"}`}
            onClick={filterFuture}
          >
            Future
          </CustomButton>
          <CustomButton
            className={`tab ${filterBtn === "past" && "tab-active"}`}
            onClick={filterPast}
          >
            Past
          </CustomButton>
        </div>
        <input
          className="event-search form-control"
          type="search"
          placeholder="Search..."
          aria-label="Search"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {displayItems?.length ? (
        <div className="mb-5">
          <div className="event__sort" onClick={handleOrder}>
            <span>Name</span>
            {order === "asc" ? <BiDownArrow /> : <BiUpArrow />}
          </div>
          <ul className="event__list">
            {displayItems.map((event) => (
              <ListItem link key={event.id}>
                <EventPart {...event} />
                <div className="event__actions">
                  <CustomButton
                    className="action"
                    onClick={() => {
                      startEdit(event);
                    }}
                  >
                    <RiEdit2Fill className="icon" />
                  </CustomButton>
                  <CustomButton
                    className="action"
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
          <div className="mt-3">
            <Pagination
              pageCount={pageCount}
              handlePageClick={handlePageClick}
            />
          </div>
        </div>
      ) : (
        <h3 className="check-text my-5">Sorry, there are no events</h3>
      )}
    </section>
  );
};

export default EventsList;
