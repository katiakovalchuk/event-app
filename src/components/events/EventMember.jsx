import React from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";

import { BiCommentCheck, BiCommentAdd } from "react-icons/bi";
import { GoTrashcan } from "react-icons/go";

import { useDialog } from "../../context/dialogContext";
import { deleteUserFromEvent } from "../../store/slices/eventSlice";
import {
  deleteEventFromMember,
  subtractPointsFromScore,
} from "../../store/slices/membersSlice";

import InfoForm from "../forms/InfoForm";
import { ModalForm, ListItem, CustomButton } from "../elements";

const EventMember = ({ image, fullName, eventsList, scores }) => {
  const dispatch = useDispatch();
  const { startEdit } = useDialog();
  const currentEvent = useSelector((state) => state.eventSlice.event);
  const eventId = currentEvent.id;

  const currentInfo =
    eventsList.length > 0 && eventsList.find((event) => event.id === eventId);

  //updatedScore
  const updatedScore =
    +scores - (+currentEvent.points + +currentInfo?.additionalPoints);

  const deleteUser = (uid, id, updatedScore) => {
    dispatch(subtractPointsFromScore({ uid, updatedScore }));
    dispatch(
      deleteUserFromEvent({
        id,
        uid,
      })
    );
    dispatch(deleteEventFromMember({ uid, id }));
  };
  return (
    <>
      {eventsList.length && (
        <>
          {" "}
          <ListItem>
            <div className="members__content">
              <div className="members__img-container">
                <img className="members__img" src={image} alt={fullName} />
              </div>
              <h4 className="members__name">{fullName}</h4>
              <div className="members__addInfo">
                {currentInfo?.comment && (
                  <span className="members__comment">
                    <BiCommentCheck />
                  </span>
                )}
                {currentInfo?.additionalPoints > 0 && (
                  <span className="members__points">
                    {currentInfo?.additionalPoints}
                  </span>
                )}
              </div>
            </div>
            <div className="members__actions">
              <CustomButton
                className="action"
                onClick={() => startEdit(currentInfo)}
              >
                <BiCommentAdd />
              </CustomButton>

              <CustomButton
                variant="danger"
                className="action"
                onClick={() =>
                  deleteUser(currentInfo.uid, currentInfo.id, updatedScore)
                }
              >
                <GoTrashcan />
              </CustomButton>
            </div>
          </ListItem>
          <ModalForm title="Additional Information" form={<InfoForm />} />
        </>
      )}
    </>
  );
};

EventMember.propTypes = {
  fullName: PropTypes.string,
  image: PropTypes.string,
  scores: PropTypes.number,
  eventsList: PropTypes.arrayOf(
    PropTypes.shape({
      isPresent: PropTypes.bool,
      comment: PropTypes.string,
      additionalPoints: PropTypes.number,
      uid: PropTypes.string,
      id: PropTypes.string,
    })
  ),
};

export default EventMember;
