import React from "react";
import PropTypes from "prop-types";
import { Toast, ToastContainer } from "react-bootstrap";
import { FaLock } from "react-icons/fa";

import { useDialog } from "../../context/dialogContext";

const CustomToast = ({ toastHeading, toastText, variant }) => {
  const { showToast, handleCloseToast } = useDialog();
  return (
    <ToastContainer className="pt-5" position="top-end" delay={5000} autohide>
      <Toast
        onClose={handleCloseToast}
        show={showToast}
        delay={7000}
        autohide
        bg={variant}
      >
        <Toast.Header>
          <FaLock className="me-1" />
          <strong className="me-auto">{toastHeading}</strong>
          <small>just now</small>
        </Toast.Header>
        <Toast.Body>{toastText}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

CustomToast.propTypes = {
  toastHeading: PropTypes.string,
  toastText: PropTypes.string,
  variant: PropTypes.string,
};

export default CustomToast;
