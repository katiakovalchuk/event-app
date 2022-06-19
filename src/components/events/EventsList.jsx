import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import ReactPaginate from "react-paginate";

import {GoTrashcan} from "react-icons/go";
import {RiEdit2Fill} from "react-icons/ri";

import {useDialog} from "../../context/dialogContext";
import {deleteNewEvent, getEvents, selectAllEvents,} from "../../store/slices/eventsSlice";
import {deleteEvents} from "../../store/slices/usersSlice";

import EventPart from "./EventPart";
import Spinner from "../Spinner";
import {CustomButton, CustomToast, ListItem} from "../elements";
import {search} from "../../helpers/utils";

const EventsList = () => {
    const {startEdit, handleShowToast} = useDialog();
    const dispatch = useDispatch();
    const events = useSelector(selectAllEvents);
    const {status, error} = useSelector((state) => state.eventsSlice);
    const [query, setQuery] = useState("");
    const keys = ["eventDate", "eventName", "eventPlace", "cityName", "eventDescription"];
    const oderedEvents = [...events].sort((a, b) =>
        b.eventDate.localeCompare(a.eventDate)
    );
    const searchedEvents = search(oderedEvents, keys, query);

    useEffect(() => {
        dispatch(getEvents());
    }, [dispatch]);

    useEffect(() => {
        if (status === "failed") {
            handleShowToast();
        }
    }, [status]);

    const deleteEvent = (id) => {
        dispatch(deleteEvents(id));
        dispatch(deleteNewEvent(id));
    };

    const itemsPerPage = 5;
    const [currentItems, setCurrentItems] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);

    useEffect(() => {
        // Fetch items from another resources.
        const endOffset = itemOffset + itemsPerPage;
        console.log(`Loading items from ${itemOffset} to ${endOffset}`);
        setCurrentItems(searchedEvents.slice(itemOffset, endOffset));
        console.log(searchedEvents);
        console.log(searchedEvents.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(searchedEvents.length / itemsPerPage));
    }, [itemOffset, itemsPerPage, searchedEvents.length]);


    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % searchedEvents.length;
        console.log(
            `User requested page number ${event.selected}, which is offset ${newOffset}`
        );
        setItemOffset(newOffset);
    };


    return (
        <>
            {status === "loading" && <Spinner/>}

            {status === "failed" && (
                <CustomToast
                    toastHeading="Server Error"
                    toastText={error}
                    variant="danger"
                />
            )}
            <div className="d-flex justify-content-end">
                <input className="event-search form-control me-2 mt-5" type="search" placeholder="Search..."
                       aria-label="Search"
                       onChange={(e) => setQuery(e.target.value)}
                />
            </div>
            {searchedEvents.length ? (
                <div>
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
                    <ReactPaginate
                        breakLabel="..."
                        previousLabel="Previous"
                        nextLabel="Next"
                        pageCount={pageCount}
                        onPageChange={handlePageClick}
                        containerClassName={"pagination justify-content-center"}
                        pageLinkClassName={"page-link"}
                        previousLinkClassName={"page-link"}
                        nextLinkClassName={"page-link"}
                        activeLinkClassName={"page-item active"}
                    />
                </div>
            ) : events.length ? (
                <h3 className="text-center my-3">No events found</h3>
            ) : <h3 className="text-center my-3">Please add your first Event</h3>}
        </>
    );
};

export default EventsList;
