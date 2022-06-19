import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container } from "react-bootstrap";

import { deleteAllMembersFromEvent } from "../../store/slices/membersSlice";
import { deleteNewMembersList } from "../../store/slices/eventSlice";

import EventMember from "./EventMember";
import { CustomButton } from "../elements";

const EventMembers = () => {
  const dispatch = useDispatch();
  const currentEvent = useSelector((state) => state.eventSlice.event);
  const members = useSelector((state) => state.membersSlice.members);
  const { membersList } = currentEvent;

  const eventMembers = members.filter((member) =>
    membersList.includes(member.id)
  );
  const deleteAllMembers = (id) => {
    dispatch(deleteAllMembersFromEvent(id));
    dispatch(deleteNewMembersList(id));
  };
  return (
    <section className="members">
      <Container>
        <h4 className="members__title">Registered Users</h4>
        <div className="members__statistic">
          {eventMembers.length > 1 && (
            <CustomButton
              onClick={() => {
                deleteAllMembers(currentEvent.id);
              }}
            >
              Delete All
            </CustomButton>
          )}
        </div>
        {eventMembers.length ? (
          <ul className="members__list">
            {eventMembers?.map((member) => (
              <EventMember key={member.id} {...member} />
            ))}
          </ul>
        ) : (
          <p className="check-text">Please register users to the Event</p>
        )}
      </Container>
    </section>
  );
};

export default EventMembers;
