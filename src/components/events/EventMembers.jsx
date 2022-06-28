import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "react-bootstrap";

import { getNewMembers } from "../../store/slices/membersSlice";
import { getNewEvent } from "../../store/slices/eventSlice";
import { search } from "../../helpers/utils";
import { usePagination } from "../../hooks/usePagination";
import { useDialog } from "../../context/dialogContext";

import EventMember from "./EventMember";
import { CustomButton } from "../elements";
import Pagination from "../Pagination";
import SearchInput from "../elements/SearchInput";

const EventMembers = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const currentEvent = useSelector((state) => state.eventSlice.event);
  const { membersList } = currentEvent;
  const { members, status } = useSelector((state) => state.membersSlice);
  const [query, setQuery] = useState("");
  const { handleShowModal, setUserModalMode } = useDialog();

  const eventMembers = members.filter((member) =>
    membersList.includes(member.id)
  );
  const keys = ["fullName"];
  const searchedEventMembers = search(eventMembers, keys, query);

  const { pageCount, currentPage, handlePageClick, currentItems } =
    usePagination({
      query,
      status,
      data: searchedEventMembers,
      itemsPerPage: 4,
    });

  useEffect(() => {
    dispatch(getNewEvent(id));
  }, [id]);

  useEffect(() => {
    dispatch(getNewMembers());
  }, [dispatch]);

  return (
    <section className="members">
      <h4 className="members__title">Registered Users</h4>
      <Container fluid="xl">
        <div className="members__statistic">
          {eventMembers.length > 0 && (
            <SearchInput onChange={(e) => setQuery(e.target.value)} />
          )}
          {eventMembers.length > 1 && (
            <div className="members__statistic-right">
              <span className="members__amount">
                Users: {eventMembers.length}
              </span>
              <CustomButton
                variant="danger"
                onClick={() => {
                  handleShowModal();
                  setUserModalMode("deleteAll");
                }}
              >
                Delete All
              </CustomButton>
            </div>
          )}
        </div>

        {currentItems.length ? (
          <>
            <ul className="members__list">
              {currentItems.map((member) => (
                <EventMember key={member.id} {...member} />
              ))}
            </ul>

            <div className="mt-3">
              <Pagination
                pageCount={pageCount}
                handlePageClick={handlePageClick}
                currentPage={currentPage}
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
