import React, { useEffect, useState } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { GoTrashcan } from "react-icons/go";
import { RiEdit2Fill } from "react-icons/ri";
import PropTypes from "prop-types";

import { useDialog } from "../../context/dialogContext";
import { getNewEvents, selectAllEvents } from "../../store/slices/eventsSlice";
import { search } from "../../helpers/utils";
import { usePagination } from "../../hooks/usePagination";

import EventPart from "./EventPart";
import Spinner from "../Spinner";
import Pagination from "../Pagination";
import SearchInput from "../elements/SearchInput";
import EventSort from "./EventSort";
import { CustomButton, ListItem } from "../elements";

const EventsList = ({ requestIdToDelete }) => {
  const {
    order,
    startEdit,
    setDelete,
    handleShowModal,
    addRequireConfirm,
    removeRequireConfirm,
  } = useDialog();
  const dispatch = useDispatch();
  const events = useSelector(selectAllEvents);
  const { status } = useSelector((state) => state.eventsSlice);

  const [query, setQuery] = useState("");
  const [filterBtn, setFilterBtn] = useState("all");
  const today = moment().format("yyyy-MM-DD HH:mm");

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

  const { pageCount, currentPage, handlePageClick, currentItems } =
    usePagination({
      query,
      status,
      order,
      data: searchedEvents,
      filterBtn,
      itemsPerPage: 6,
    });

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

  return (
    <section className="event">
      <ToastContainer limit={5} />
      {status === "loading" && <Spinner />}
      {events.length > 0 && (
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
          <SearchInput handleChange={(e) => setQuery(e.target.value)} />
        </div>
      )}

      {currentItems?.length ? (
        <div className="mb-5">
          <EventSort />
          <ul className="event__list">
            {currentItems.map((event) => (
              <ListItem link key={event.id}>
                <EventPart {...event} />
                <div className="event__actions">
                  <CustomButton
                    className="action"
                    onClick={() => {
                      startEdit(event);
                      removeRequireConfirm();
                    }}
                  >
                    <RiEdit2Fill className="icon" />
                  </CustomButton>
                  <CustomButton
                    className="action"
                    variant="danger"
                    onClick={() => {
                      addRequireConfirm();
                      setDelete();
                      handleShowModal();
                      requestIdToDelete(event.id);
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
              currentPage={currentPage}
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

EventsList.propTypes = {
  requestIdToDelete: PropTypes.func,
};
