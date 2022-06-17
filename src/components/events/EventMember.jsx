import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { deleteUserFromEvent } from "../../store/slices/eventSlice";
import {
  deleteEventFromMember,
  toggleStatus,
} from "../../store/slices/usersSlice";

const EventMember = ({ member }) => {
  const dispatch = useDispatch();
  const currentEvent = useSelector((state) => state.eventSlice.event);
  const eventId = currentEvent.id;
  const { fullName, eventsList } = member;

  const currentInfo = eventsList?.find((event) => event.eid === eventId);
  const { isPresent, comment, additionalPoints, uid, id } = currentInfo;

  const deleteUser = (eventId, uid, id) => {
    dispatch(
      deleteUserFromEvent({
        eid: eventId,
        uid,
      })
    );
    dispatch(deleteEventFromMember({ id, uid }));
  };
  return (
    <li>
      <input
        type="checkbox"
        checked={isPresent}
        onChange={dispatch(toggleStatus({ uid }))}
      />
      <h4>{fullName}</h4>
      {comment && <p>{comment}</p>}
      {additionalPoints && <span>{additionalPoints}</span>}
      <div>
        <button>change</button>
        <button onClick={() => deleteUser(eventId, uid, id)}>delete</button>
      </div>
    </li>
  );
};

export default EventMember;
