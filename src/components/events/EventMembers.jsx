import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container } from "react-bootstrap";

import { deleteAllMembersFromEvent } from "../../store/slices/membersSlice";
import { deleteNewMembersList } from "../../store/slices/eventSlice";
import { search } from "../../helpers/utils";
import { usePaginate2 } from "../../hooks/usePaginate2";

import EventMember from "./EventMember";
import { CustomButton } from "../elements";
import Pagination from "../elements/Pagination";

const EventMembers = () => {
  const dispatch = useDispatch();
  const currentEvent = useSelector((state) => state.eventSlice.event);
  const { membersList } = currentEvent;
  const { members } = useSelector((state) => state.membersSlice);
  const [query, setQuery] = useState("");

  const eventMembers = members.filter((member) =>
    membersList.includes(member.id)
  );
  const keys = ["fullName"];
  const searchedEventMembers = search(eventMembers, keys, query);

  const { pageCount, handlePageClick, displayItems } = usePaginate2({
    data: searchedEventMembers,
    itemsPerPage: 4,
  });

  const deleteAllMembers = (id) => {
    dispatch(deleteNewMembersList(id));
    dispatch(deleteAllMembersFromEvent(id));
  };

  return (
    <section className="members">
      <h4 className="members__title">Registered Users</h4>
      <Container fluid="xl">
        <div className="members__statistic">
          <input
            className="event-search form-control"
            type="search"
            placeholder="Search..."
            aria-label="Search"
            onChange={(e) => setQuery(e.target.value)}
          />

          <div className="members__statistic-right">
            <span className="members__amount">
              Users: {eventMembers.length}
            </span>
            <CustomButton
              variant="danger"
              onClick={() => {
                deleteAllMembers(currentEvent.id);
              }}
            >
              Delete All
            </CustomButton>
          </div>
        </div>

        {displayItems.length ? (
          <>
            <ul className="members__list">
              {displayItems.map((member) => (
                <EventMember key={member.id} {...member} />
              ))}
            </ul>

            <div className="mt-3">
              <Pagination
                pageCount={pageCount}
                handlePageClick={handlePageClick}
              />
            </div>
          </>
        ) : (
          <p className="check-text">Please register users to the Event</p>
        )}
      </Container>
    </section>
  );
};

export default EventMembers;
