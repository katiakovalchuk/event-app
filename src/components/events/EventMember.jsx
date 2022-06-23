import React from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";

import { BiCommentCheck, BiCommentAdd } from "react-icons/bi";
import { GoTrashcan } from "react-icons/go";

import { useDialog } from "../../context/dialogContext";
import { deleteUserFromEvent } from "../../store/slices/eventSlice";
import {
  deleteEventFromMember,
  toggleStatus,
} from "../../store/slices/membersSlice";

import InfoForm from "../forms/InfoForm";
import { ModalForm, ListItem, CustomCheckbox, CustomButton } from "../elements";

const EventMember = ({ fullName, eventsList }) => {
  const dispatch = useDispatch();
  const { startEdit } = useDialog();
  const currentEvent = useSelector((state) => state.eventSlice.event);
  const eventId = currentEvent.id;

  const currentInfo =
    eventsList.length && eventsList.find((event) => event.id === eventId);
  const { isPresent, comment, additionalPoints, uid, id } = currentInfo;

  const deleteUser = (uid, id) => {
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
      <ListItem>
        <div className="members__content">
          <CustomCheckbox
            version="name"
            label={fullName}
            type="checkbox"
            checked={isPresent}
            onChange={() => {
              dispatch(toggleStatus({ uid, id }));
            }}
          />

          <div className="members__addInfo">
            {comment && (
              <span className="members__comment">
                <BiCommentCheck />
              </span>
            )}
            {additionalPoints > 0 && (
              <span className="members__points">{additionalPoints}</span>
            )}
          </div>
        </div>
        <div className="members__actions">
          <CustomButton
            className="action"
            disabled={!isPresent}
            onClick={() => startEdit(currentInfo)}
          >
            <BiCommentAdd />
          </CustomButton>

          <CustomButton
            variant="danger"
            className="action"
            onClick={() => deleteUser(uid, id)}
          >
            <GoTrashcan />
          </CustomButton>
        </div>
      </ListItem>

      <ModalForm title="Additional Information" form={<InfoForm />} />
    </>
  );
};

EventMember.propTypes = {
  fullName: PropTypes.string,
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
