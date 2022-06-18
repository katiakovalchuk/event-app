import React from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";

import { addUserToEvent } from "../../store/slices/eventSlice";
import { addEventToMember } from "../../store/slices/usersSlice";

import { ListItem, CustomButton } from "../elements";
import "../../styles/event-item.scss";

const SingleMember = ({ fullName, image, id }) => {
  const dispatch = useDispatch();
  const currentEvent = useSelector((state) => state.eventSlice.event);
  const eventId = currentEvent.id;
  const createList = (uid, id) => {
    dispatch(
      addEventToMember({
        uid,
        id,
        isPresent: false,
        comment: "",
        additionalPoints: 0,
      })
    );
    dispatch(
      addUserToEvent({
        uid,
        id,
      })
    );
  };
  return (
    <ListItem>
      <div className="members__info">
        <div className="members__img-container">
          <img className="members__img" src={image} alt={fullName} />
        </div>
        <h4 className="members__name">{fullName}</h4>
      </div>
      <CustomButton onClick={() => createList(id, eventId)}>Add</CustomButton>
    </ListItem>
  );
};

SingleMember.propTypes = {
  id: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
  image: PropTypes.string,
};

export default SingleMember;
