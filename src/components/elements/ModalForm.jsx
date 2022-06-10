import React from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";

import { useDialog } from "../../context/dialogContext";

const ModalForm = ({ title, form, ...props }) => {
  const { show, handleClose } = useDialog();
  return (
    <Modal show={show} onHide={handleClose} {...props}>
      <Modal.Header closeButton>
        <Modal.Title className="text-center">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{form}</Modal.Body>
    </Modal>
  );
};

ModalForm.propTypes = {
  title: PropTypes.string,
  form: PropTypes.node,
};

export default ModalForm;
