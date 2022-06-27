import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Container } from "react-bootstrap";
import { BiComment, BiDownArrow, BiUpArrow } from "react-icons/bi";

import { usePagination } from "../hooks/usePagination";

import { getUserEventsList } from "../store/slices/userSlice";
import { getNewEvents } from "../store/slices/eventsSlice";

import { search } from "../helpers/utils";
import { ellipsify, capitalizeFirstLet } from "../helpers/string";

import SearchInput from "../components/elements/SearchInput";
import Spinner from "../components/Spinner";
import { ListItem } from "../components/elements";
import Pagination from "../components/Pagination";

import "../styles/eventlist.scss";

const UserEvents = () => {
  const dispatch = useDispatch();
  const id = useSelector((state) => state.userSlice.user.email);
  const { eventsList, status } = useSelector((state) => state.userSlice);
  const { events } = useSelector((state) => state.eventsSlice);
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState("asc");
  const keys = [
    "eventDate",
    "eventName",
    "cityName",
    "eventPlace",
    "eventDescription",
  ];

  const userEvents = events.filter((event) => {
    return eventsList.some((item) => item.id === event.id);
  });

  const handleOrder = () =>
    setOrder((prev) => (prev === "asc" ? "dsc" : "asc"));

  const sortedEvents =
    order === "asc"
      ? [...userEvents].sort((a, b) => b.eventDate.localeCompare(a.eventDate))
      : [...userEvents].sort((a, b) => a.eventDate.localeCompare(b.eventDate));

  const searchedEvents = search(sortedEvents, keys, query);

  const { pageCount, currentPage, handlePageClick, currentItems } =
    usePagination({ query, status, order, data: searchedEvents });

  useEffect(() => {
    dispatch(getUserEventsList(id));
  }, [id]);

  useEffect(() => {
    dispatch(getNewEvents());
  }, []);

  return (
    <>
      {status === "loading" && <Spinner />}
      <article className="event">
        <Container fluid="xl">
          <div className="mb-3">
            <SearchInput
              className="event-search"
              handleChange={(e) => setQuery(e.target.value)}
            />
          </div>
          {currentItems?.length ? (
            <>
              <div className="event__sort" onClick={handleOrder}>
                <span>Name</span>
                {order === "asc" ? <BiDownArrow /> : <BiUpArrow />}
              </div>
              <ul className="event__list">
                {currentItems?.map((event) => {
                  const currentInfo = eventsList.find(
                    (item) => item.id === event.id
                  );
                  const totalScore =
                    event?.points + currentInfo?.additionalPoints;
                  return (
                    <ListItem link key={event.id}>
                      <Link
                        className="event__userlink"
                        to={`/u-events/${event?.id}`}
                      >
                        <div className="event__userleft">
                          <h4 className="event__name">{event?.eventName}</h4>
                          {event?.eventDescription && (
                            <p className="event__descr">
                              {ellipsify(
                                capitalizeFirstLet(event?.eventDescription),
                                100
                              )}
                            </p>
                          )}
                        </div>
                        <div className="event__usermiddle">
                          <span className="event__points">
                            {currentInfo?.additionalPoints
                              ? totalScore
                              : event?.points}
                          </span>
                          {currentInfo?.comment && <BiComment />}
                        </div>
                        <div className="event__userright">
                          {event?.eventPlace === "city" ? (
                            <h4 className="event__place">
                              {capitalizeFirstLet(event?.cityName)}
                            </h4>
                          ) : (
                            <div className="event__place">
                              {event?.eventPlace}
                            </div>
                          )}
                          <div className="event__date">{event?.eventDate}</div>
                        </div>
                      </Link>
                    </ListItem>
                  );
                })}
              </ul>
              <div className="mt-3">
                <Pagination
                  pageCount={pageCount}
                  currentPage={currentPage}
                  handlePageClick={handlePageClick}
                />
              </div>
            </>
          ) : (
            <p className="check-text">There are no events</p>
          )}
        </Container>
      </article>
    </>
  );
};

export default UserEvents;
