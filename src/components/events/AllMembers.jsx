import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Container} from "react-bootstrap";

import {addEventToAllMembers, addPointstoAllMembers, getNewMembers,} from "../../store/slices/membersSlice";
import {addAllUserEvent, getNewEvent} from "../../store/slices/eventSlice";
import {search} from "../../helpers/utils";

import SingleMember from "./SingleMember";
import {CustomButton} from "../elements";
import Pagination from "../Pagination";
import {usePagination} from "../../hooks/usePagination";

import "../../styles/event-item.scss";

const AllMembers = () => {
  const dispatch = useDispatch();
  const {id} = useParams();
  const currentEvent = useSelector((state) => state.eventSlice.event);
  const members = useSelector((state) => state.membersSlice.members);
  const {membersList} = currentEvent;
  const points = currentEvent.points;
  const [query, setQuery] = useState("");

  const otherMembers = members.filter(
    (member) => !membersList.includes(member.id)
  );
  const keys = ["fullName"];
  const searchedAllMembers = search(otherMembers, keys, query);
  const {pageCount, currentPage, handlePageClick, currentItems} =
    usePagination({query, data: searchedAllMembers, itemsPerPage: 4});

  useEffect(() => {
    dispatch(getNewEvent(id));
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(getNewMembers());
  }, [dispatch]);

  const addAllMembers = (id, points) => {
    dispatch(addPointstoAllMembers({points}));
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
                  addAllMembers(currentEvent.id, points);
                }}
              >
                Register All
              </CustomButton>
            </div>
          )}
        </div>

        {currentItems.length ? (
          <>
            <ul className="members__list">
              {currentItems?.map((member) => (
                <SingleMember key={member.id} {...member} />
              ))}
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
          <p className="check-text">Sorry, no app users</p>
        )}
      </Container>
    </section>
  );
};

export default AllMembers;
