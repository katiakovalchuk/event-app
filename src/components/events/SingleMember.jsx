import React from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";

import { addUserToEvent } from "../../store/slices/eventSlice";
import {
  addEventToMember,
  addPointsToMember,
} from "../../store/slices/membersSlice";

import { ListItem, CustomButton } from "../elements";
import "../../styles/event-item.scss";

const SingleMember = ({ fullName, image, id, scores }) => {
  const dispatch = useDispatch();
  const currentEvent = useSelector((state) => state.eventSlice.event);
  const eventId = currentEvent.id;
  const points = currentEvent.points;

  //updating user score
  const updatedScore = +scores + +points;

  const createList = (uid, id, updatedScore) => {
    dispatch(
      addEventToMember({
        uid,
        id,
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
    dispatch(addPointsToMember({ uid, id, updatedScore }));
  };
  return (
    <ListItem>
      <div className="members__info">
        <div className="members__img-container">
          <img className="members__img" src={image} alt={fullName} />
        </div>
        <h4 className="members__name">{fullName}</h4>
      </div>
      <CustomButton onClick={() => createList(id, eventId, updatedScore)}>
        Register
      </CustomButton>
    </ListItem>
  );
};

SingleMember.propTypes = {
  id: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
  image: PropTypes.string,
  scores: PropTypes.number,
};

export default SingleMember;
