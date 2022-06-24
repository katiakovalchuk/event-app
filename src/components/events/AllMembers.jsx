import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container } from "react-bootstrap";

import { addEventToAllMembers } from "../../store/slices/membersSlice";
import { addAllUserEvent } from "../../store/slices/eventSlice";

import { usePaginate2 } from "../../hooks/usePaginate2";
import { search } from "../../helpers/utils";

import SingleMember from "./SingleMember";
import { CustomButton } from "../elements";
import Pagination from "../elements/Pagination";

import "../../styles/event-item.scss";

const AllMembers = () => {
  const dispatch = useDispatch();
  const currentEvent = useSelector((state) => state.eventSlice.event);
  const members = useSelector((state) => state.membersSlice.members);
  const { membersList } = currentEvent;
  const [query, setQuery] = useState("");

  const otherMembers = members.filter(
    (member) => !membersList.includes(member.id)
  );
  const keys = ["fullName"];
  const searchedAllMembers = search(otherMembers, keys, query);
  const { displayItems, handlePageClick, pageCount } = usePaginate2({
    data: searchedAllMembers,
    itemsPerPage: 4,
  });

  const addAllMembers = (id) => {
    dispatch(
      addEventToAllMembers({
        id,
        comment: "",
        additionalPoints: 0,
        isPresent: false,
      })
    );
    dispatch(addAllUserEvent(id));
  };

  return (
    <section className="members">
      <h4 className="members__title">Event App Users</h4>
      <Container fluid="xl">
        <div className="members__statistic">
          {otherMembers.length > 0 && (
            <input
              className="event-search form-control"
              type="search"
              placeholder="Search..."
              aria-label="Search"
              onChange={(e) => setQuery(e.target.value)}
            />
          )}
          {otherMembers.length > 1 && (
            <div className="members__statistic-right">
              <span className="members__amount">
                Users: {otherMembers.length}
              </span>
              <CustomButton
                onClick={() => {
                  addAllMembers(currentEvent.id);
                }}
              >
                Add All
              </CustomButton>
            </div>
          )}
        </div>

        {displayItems.length ? (
          <>
            <ul className="members__list">
              {displayItems?.map((member) => (
                <SingleMember key={member.id} {...member} />
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
          <p className="check-text">Sorry, no app users</p>
        )}
      </Container>
    </section>
  );
};

export default AllMembers;
