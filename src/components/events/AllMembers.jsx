import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container } from "react-bootstrap";
import { addEventToAllMembers } from "../../store/slices/membersSlice";
import { addAllUserEvent } from "../../store/slices/eventSlice";
import SingleMember from "./SingleMember";
import { CustomButton } from "../elements";

import "../../styles/event-item.scss";

const AllMembers = () => {
  const dispatch = useDispatch();
  const currentEvent = useSelector((state) => state.eventSlice.event);
  const members = useSelector((state) => state.membersSlice.members);
  const { membersList } = currentEvent;

  const otherMembers = members.filter(
    (member) => !membersList.includes(member.id)
  );

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
      <Container>
        <h4 className="members__title">Event App Users</h4>
        {otherMembers.length > 1 && (
          <div className="members__statistic">
            <div className="members__statistic-right">
              <CustomButton
                onClick={() => {
                  addAllMembers(currentEvent.id);
                }}
              >
                Add All
              </CustomButton>
            </div>
          </div>
        )}
        {otherMembers.length ? (
          <ul className="members__list">
            {otherMembers?.map((member) => (
              <SingleMember key={member.id} {...member} />
            ))}
          </ul>
        ) : (
          <p className="check-text">Sorry, no app users</p>
        )}
      </Container>
    </section>
  );
};

export default AllMembers;
