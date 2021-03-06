import PropTypes from "prop-types";
import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useDispatch } from "react-redux";
import { getIndex } from "../../helpers/utils.js";

import { deleteNewMember } from "../../store/slices/membersSlice.js";
import { deleteMemberFromAllEvents } from "../../store/slices/eventsSlice.js";
import {useLocation} from "react-router-dom";

const DelUser = ({ modalOpenDel, closeDel, deleteUserToast, delId, setUsers, allUsers }) => {
  const dispatch = useDispatch();
  const deleteDocument = (id) => {
    dispatch(deleteMemberFromAllEvents(id));
    dispatch(deleteNewMember(id));
  };
  const {pathname} = useLocation();

  function deleteUser() {
    const userIndex = getIndex(allUsers, delId);
    deleteDocument(delId);
    setUsers(allUsers.filter((user, index) => index !== userIndex));
    deleteUserToast();
    closeDel();
  }

  return (
    <Modal
      size="sm"
      show={modalOpenDel}
      onHide={closeDel}
      aria-labelledby="example-modal-sizes-title-sm"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-sm">
          {pathname.startsWith("/managers-management") ? "You confirm deleting manager?" : "You confirm deleting user?"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-around">
          <Button variant="danger" onClick={deleteUser}>
            Confirm
          </Button>
          <Button variant="secondary" onClick={closeDel}>
            Cancel
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

DelUser.propTypes = {
  modalOpenDel: PropTypes.bool.isRequired,
  closeDel: PropTypes.func.isRequired,
  deleteUserToast: PropTypes.func.isRequired,
  delId: PropTypes.string.isRequired,
  setUsers: PropTypes.func.isRequired,
  allUsers: PropTypes.array.isRequired,
};

export default DelUser;
