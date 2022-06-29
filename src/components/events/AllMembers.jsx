import React, { useEffect, useState } from "react";
import moment from "moment";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "react-bootstrap";

import {
  addEventToAllMembers,
  addPointstoAllMembers,
  getNewMembers,
} from "../../store/slices/membersSlice";
import { addAllUserEvent, getNewEvent } from "../../store/slices/eventSlice";
import { usePagination } from "../../hooks/usePagination";
import { search } from "../../helpers/utils";

import SingleMember from "./SingleMember";
import { CustomButton } from "../elements";
import Pagination from "../Pagination";
import SearchInput from "../elements/SearchInput";

import "../../styles/event-item.scss";

const AllMembers = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const currentEvent = useSelector((state) => state.eventSlice.event);
  const members = useSelector((state) => state.membersSlice.members);
  const { membersList } = currentEvent;
  const points = currentEvent.points;
  const [query, setQuery] = useState("");

  //check date
  const today = moment().format("yyyy-MM-DD HH:mm");
  const check = moment(currentEvent.eventDate).isAfter(today);

  const otherMembers = members.filter(
    (member) => !membersList.includes(member.id)
  );

  const keys = ["firstName", "lastName"];
  const searchedAllMembers = search(otherMembers, keys, query);
  const { pageCount, currentPage, handlePageClick, currentItems } =
    usePagination({ query, data: searchedAllMembers, itemsPerPage: 4 });

  useEffect(() => {
    dispatch(getNewEvent(id));
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(getNewMembers());
  }, [dispatch]);

  const addAllMembers = (id, points, membersList) => {
    dispatch(addPointstoAllMembers({ points }));
    dispatch(
      addEventToAllMembers({
        info: {
          id,
          comment: "",
          additionalPoints: 0,
        },
        membersList,
      })
    );
    dispatch(addAllUserEvent({ id, membersList }));
  };

  return (
    <section className="members">
      <h4 className="members__title">Event App Users</h4>
      <Container fluid="xl">
        <div className="members__statistic">
          {otherMembers.length > 0 && (
            <SearchInput handleChange={(e) => setQuery(e.target.value)} />
          )}
          <div className="members__statistic-right">
            {otherMembers.length > 0 && (
              <span className="members__amount">
                Users: {otherMembers.length}
              </span>
            )}
            {otherMembers.length > 1 && (
              <CustomButton
                disabled={check}
                onClick={() => {
                  addAllMembers(
                    currentEvent.id,
                    points,
                    currentEvent.membersList
                  );
                }}
              >
                Register All
              </CustomButton>
            )}
          </div>
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
