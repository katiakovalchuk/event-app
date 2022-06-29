import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ToastContainer } from "react-toastify";

import AllMembers from "../components/events/AllMembers";
import EventMembers from "../components/events/EventMembers";
import EventDescription from "../components/events/EventDescription";
import Spinner from "../components/Spinner";

import "../styles/event-item.scss";
import { ModalForm } from "../components/elements";
import InfoForm from "../components/forms/InfoForm";
import { useDialog } from "../context/dialogContext";
import ConfirmForm from "../components/forms/ConfirmForm";
import {
  deleteAllMembersFromEvent,
  deleteEventFromMember,
  subtractPointsFromScore,
  subtractPointsOfAllFromScore,
} from "../store/slices/membersSlice";
import {
  deleteNewMembersList,
  deleteUserFromEvent,
} from "../store/slices/eventSlice";

const EventsItem = () => {
  const { status, event: currentEvent } = useSelector(
    (state) => state.eventSlice
  );
  const { membersList } = currentEvent;
  const { userMode, requestData, handleCloseModal } = useDialog();
  const { currentInfo, updatedScore } = requestData();
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = "Event Page";
  }, []);

  const deleteAllMembers = (id, points, membersList) => {
    dispatch(subtractPointsOfAllFromScore({ id, points, membersList }));
    dispatch(deleteNewMembersList(id));
    dispatch(deleteAllMembersFromEvent({ id, membersList }));
  };

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
      <ToastContainer limit={5} />
      {userMode === "comment" && (
        <ModalForm title="Additional Information" form={<InfoForm />} />
      )}
      {userMode === "deleteAll" && (
        <ModalForm
          title="Confirm deleting all users from event?"
          form={
            <ConfirmForm
              handleConfirmation={(e) => {
                e.preventDefault();
                deleteAllMembers(
                  currentEvent.id,
                  currentEvent.points,
                  membersList
                );
                handleCloseModal();
              }}
            />
          }
        />
      )}
      {userMode === "delete" && (
        <ModalForm
          title="Confirm deleting user from event?"
          form={
            <ConfirmForm
              handleConfirmation={(e) => {
                e.preventDefault();
                deleteUser(currentInfo.uid, currentInfo.id, updatedScore);
                handleCloseModal();
              }}
            />
          }
        />
      )}
      {status === "loading" && <Spinner />}
      <EventDescription />
      <EventMembers />
      <AllMembers />
    </>
  );
};

export default EventsItem;
