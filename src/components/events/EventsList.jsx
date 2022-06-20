import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {ToastContainer} from "react-toastify";
import {GoTrashcan} from "react-icons/go";
import {RiEdit2Fill} from "react-icons/ri";

import {useDialog} from "../../context/dialogContext";
import {usePagination} from "../../hooks/usePagination";
import {deleteNewEvent, getNewEvents, selectAllEvents,} from "../../store/slices/eventsSlice";
import {deleteEvents} from "../../store/slices/membersSlice";

import EventPart from "./EventPart";
import Spinner from "../Spinner";
import Pagination from "../Pagination";
import {CustomButton, ListItem} from "../elements";
import {search} from "../../helpers/utils";

const EventsList = () => {
    const {startEdit} = useDialog();
    const dispatch = useDispatch();
    const events = useSelector(selectAllEvents);
    const {status} = useSelector((state) => state.eventsSlice);
    const [query, setQuery] = useState("");
    const keys = ["eventDate", "eventName", "eventPlace", "cityName", "eventDescription"];

    const oderedEvents = [...events].sort((a, b) =>
        b.eventDate.localeCompare(a.eventDate)
    );
    const searchedEvents = search(oderedEvents, keys, query);
    const {
        pageCount,
        currentPage,
        handlePageClick,
        currentItems
    } = usePagination({query, status, data: searchedEvents});

    useEffect(() => {
        dispatch(getNewEvents());
    }, [dispatch]);

    const deleteEvent = (id) => {
        dispatch(deleteEvents(id));
        dispatch(deleteNewEvent(id));
    };

    return (
        <>
            <ToastContainer limit={5}/>
            {status === "loading" && <Spinner/>}
            <div className="d-flex justify-content-end">
                <input className="event-search form-control me-2 mt-5" type="search" placeholder="Search..."
                       aria-label="Search"
                       onChange={(e) => setQuery(e.target.value)}
                />
            </div>
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
                                            deleteEvent(event.id);
                                        }}
                                    >
                                        <GoTrashcan/>
                                    </CustomButton>
                                    <CustomButton
                                        version="action"
                                        onClick={() => {
                                            startEdit(event);
                                        }}
                                    >
                                        <RiEdit2Fill/>
                                    </CustomButton>
                                </div>
                            </ListItem>
                        ))}
                    </ul>
                    <Pagination pageCount={pageCount} currentPage={currentPage} handlePageClick={handlePageClick}/>
                </div>
            ) : events.length ? (
                <h3 className="text-center my-3">No events found</h3>
            ) : <h3 className="text-center my-3">Please add your first Event</h3>}
        </>
    );
};

export default EventsList;
