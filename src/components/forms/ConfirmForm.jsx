import {useEffect} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";

import {useDialog} from "../../context/dialogContext";

const ConfirmForm = ({handleConfirmation}) => {
  const {handleCloseModal, removeRequireConfirm, requireConfirm} = useDialog();
  let timerId;

  useEffect(() => {
    if (!requireConfirm) {
      handleCloseModal();
    }
    return timerId;
  }, [requireConfirm]);

  return (
    <div className="d-flex justify-content-end">
      <Form className="d-flex justify-content-around w-50" onSubmit={handleConfirmation}>
        <Button
          variant="primary"
          type="submit"
        >
          Confirm
        </Button>
        <Button
          variant="danger"
          type="button"
          onClick={() => {
            handleCloseModal();
            timerId = setTimeout(() => {
              removeRequireConfirm();
            }, 300);
          }
          }
        >Cancel</Button>
      </Form>
    </div>
  );
};

export default ConfirmForm;

ConfirmForm.propTypes = {
  handleConfirmation: PropTypes.func,
};
