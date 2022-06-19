import React from "react";
import { useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import EventMember from "./EventMember";

const EventMembers = () => {
  const currentEvent = useSelector((state) => state.eventSlice.event);
  const members = useSelector((state) => state.usersSlice.members);
  const { membersList } = currentEvent;

  const eventMembers = members.filter((member) =>
    membersList.includes(member.id)
  );
  return (
    <section className="members">
      <Container>
        <h4 className="members__title">Registered Users</h4>
        {eventMembers.length ? (
          <ul className="members__list">
            {eventMembers?.map((member) => (
              <EventMember key={member.id} {...member} />
            ))}
          </ul>
        ) : (
          <p className="check-text"> Soory, no registered users</p>
        )}
      </Container>
    </section>
  );
};

export default EventMembers;
