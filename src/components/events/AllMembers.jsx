import React from "react";
import { useSelector } from "react-redux";
import { Container } from "react-bootstrap";

import SingleMember from "./SingleMember";

import "../../styles/event-item.scss";

const AllMembers = () => {
  const currentEvent = useSelector((state) => state.eventSlice.event);
  const members = useSelector((state) => state.membersSlice.members);
  const { membersList } = currentEvent;

  const otherMembers = members.filter(
    (member) => !membersList.includes(member.id)
  );

  return (
    <section className="members">
      <Container>
        <h4 className="members__title">Event App Users</h4>
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
