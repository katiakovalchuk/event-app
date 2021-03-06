import React from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";

import { addUserToEvent } from "../../store/slices/eventSlice";
import {
  addEventToMember,
  addNewPointsToMember,
} from "../../store/slices/membersSlice";

import { ListItem, CustomButton } from "../elements";
import "../../styles/event-item.scss";

const SingleMember = ({ firstName, lastName, image, id, scores }) => {
  const dispatch = useDispatch();
  const currentEvent = useSelector((state) => state.eventSlice.event);
  const eventId = currentEvent.id;
  const points = currentEvent.points;

  //check date
  const today = moment().format("yyyy-MM-DD HH:mm");
  const check = moment(currentEvent.eventDate).isAfter(today);

  //updating user score
  const updatedScore = +scores + +points;

  const createList = (uid, id, updatedScore) => {
    dispatch(addNewPointsToMember({ uid, id, updatedScore }));
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
  };
  return (
    <ListItem>
      <div className="members__info">
        <div className="members__img-container">
          <img className="members__img" src={image} alt={lastName} />
        </div>
        <h4 className="members__name">{`${firstName} ${lastName}`}</h4>
      </div>
      <CustomButton
        disabled={check}
        onClick={() => createList(id, eventId, updatedScore)}
      >
        Register
      </CustomButton>
    </ListItem>
  );
};

SingleMember.propTypes = {
  id: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  image: PropTypes.string,
  scores: PropTypes.number,
};

export default SingleMember;
