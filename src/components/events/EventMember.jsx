import React from "react";
import {useSelector} from "react-redux";
import PropTypes from "prop-types";

import {BiCommentAdd, BiCommentCheck} from "react-icons/bi";
import {GoTrashcan} from "react-icons/go";

import {useDialog} from "../../context/dialogContext";
import {CustomButton, ListItem} from "../elements";

const EventMember = ({image, fullName, eventsList, scores}) => {
  const {startEdit, setUserModalMode, handleShowModal, addData} = useDialog();
  const currentEvent = useSelector((state) => state.eventSlice.event);
  const eventId = currentEvent.id;

  const currentInfo =
    eventsList.length > 0 && eventsList.find((event) => event.id === eventId);

  //updatedScore
  const updatedScore =
    +scores - (+currentEvent.points + +currentInfo?.additionalPoints);

  return (
    <>
      {eventsList.length && (
        <>
          {" "}
          <ListItem>
            <div className="members__content">
              <div className="members__img-container">
                <img className="members__img" src={image} alt={fullName}/>
              </div>
              <h4 className="members__name">{fullName}</h4>
              <div className="members__addInfo">
                {currentInfo?.comment && (
                  <span className="members__comment">
                    <BiCommentCheck/>
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
                onClick={() => {
                  startEdit(currentInfo);
                  setUserModalMode("comment");
                }}
              >
                <BiCommentAdd/>
              </CustomButton>

              <CustomButton
                variant="danger"
                className="action"
                onClick={() => {
                  setUserModalMode("delete");
                  handleShowModal();
                  addData({currentInfo, updatedScore});
                }
                }
              >
                <GoTrashcan/>
              </CustomButton>
            </div>
          </ListItem>
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
