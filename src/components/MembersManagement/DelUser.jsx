/* eslint-disable no-unused-vars */
import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { usersCollectionRef } from "../../lib/firestore.collections.js";
import { doc, deleteDoc } from "firebase/firestore";
// eslint-disable-next-line react/prop-types
const DelUser = ({ modalOpenDel, closeDel, getUsers, deleteUserToast, delId }) => {
  const deleteDocument = async (id) => {
    await deleteDoc(doc(usersCollectionRef, id));
  };

  function deleteUser() {
    deleteDocument(delId);
    deleteUserToast();
    getUsers();
    closeDel();
  }

  return (
    <Modal size="sm" show={modalOpenDel} onHide={closeDel} aria-labelledby="example-modal-sizes-title-sm">
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-sm">Are you sure want to delete?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-around">
          <Button variant="danger" onClick={deleteUser}>
            Yes
          </Button>
          <Button variant="secondary" onClick={closeDel}>
            Cancel
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DelUser;
