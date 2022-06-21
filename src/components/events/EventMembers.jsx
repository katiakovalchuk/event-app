import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container } from "react-bootstrap";

import {
  deleteAllMembersFromEvent,
  toggleSelectAll,
  showIsPresentForAllMembers,
  hideIsPresentForAllMembers,
} from "../../store/slices/membersSlice";
import { deleteNewMembersList } from "../../store/slices/eventSlice";

import EventMember from "./EventMember";
import { CustomButton, CustomCheckbox } from "../elements";

const EventMembers = () => {
  const dispatch = useDispatch();
  const currentEvent = useSelector((state) => state.eventSlice.event);
  const { membersList } = currentEvent;
  const { members, selectAll } = useSelector((state) => state.membersSlice);

  const eventMembers = members.filter((member) =>
    membersList.includes(member.id)
  );

  useEffect(() => {
    selectAll
      ? dispatch(showIsPresentForAllMembers(currentEvent.id))
      : dispatch(hideIsPresentForAllMembers(currentEvent.id));
  }, [selectAll]);

  localStorage.setItem("selectAll", JSON.stringify(selectAll));

  const deleteAllMembers = (id) => {
    dispatch(deleteNewMembersList(id));
    dispatch(deleteAllMembersFromEvent(id));
  };

  return (
    <section className="members">
      <Container>
        <h4 className="members__title">Registered Users</h4>
        {eventMembers.length > 1 && (
          <div className="members__statistic">
            <CustomCheckbox
              version="big"
              type="checkbox"
              label="Select All"
              checked={selectAll}
              onChange={() => {
                dispatch(toggleSelectAll());
              }}
            />
            <div className="members__statistic-right">
              <span className="members__amount">
                Users: {eventMembers.length}
              </span>
              <CustomButton
                version="cancel"
                onClick={() => {
                  deleteAllMembers(currentEvent.id);
                }}
              >
                Delete All
              </CustomButton>
            </div>
          </div>
        )}
        {eventMembers.length ? (
          <ul className="members__list">
            {eventMembers.map((member) => (
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
