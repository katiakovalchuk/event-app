import React from "react";
import { Button, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { getDocs } from "firebase/firestore";
import { usersCollectionRef } from "../../lib/firestore.collections.js";
import { getIndex } from "../../helpers/utils.js";
import ConfirmForm from "../forms/ConfirmForm";
import { useDialog } from "../../context/dialogContext";
import {useLocation} from "react-router-dom";

const EditUser = ({
  modalOpenEdit,
  editContactId,
  closeEdit,
  handleEditFormSubmit,
  handleEditFormChange,
  editFormData,
}) => {
  const [users, setUsers] = useState([]);
  const { requireConfirm, addRequireConfirm } = useDialog();
  const {pathname} = useLocation();

  const getUsers = () => {
    getDocs(usersCollectionRef).then((data) => {
      setUsers(
        data.docs.map((item) => {
          return { ...item.data(), id: item.id };
        })
      );
    });
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      company: "",
      birth: "",
    },
  });

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <Modal show={modalOpenEdit} onHide={closeEdit}>
      {requireConfirm ? (
        <>
          <Modal.Header closeButton className="bg-light">
            <Modal.Title>Do You confirm changing user data?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ConfirmForm handleConfirmation={handleEditFormSubmit} />
          </Modal.Body>
        </>
      ) : (
        <>
          <Modal.Header closeButton className="bg-light">
            <Modal.Title>
              {pathname.startsWith("/managers-management") ? "Update manager data" : "Update user data"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form
              onSubmit={handleSubmit(() => {
                addRequireConfirm();
              })}
            >
              <label htmlFor="firstName" className="form-label">
                First name:
              </label>
              <div className="mb-2 input-group ">
                <span className="input-group-text ms-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-person-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                  </svg>
                </span>
                <input
                  autoFocus
                  {...register("firstName", {
                    pattern: {
                      value: /^(?=.{1,50}$)[a-z\u0400-\u04FF]+(?:['_.\s][a-z\u0400-\u04FF]+)*$/i,
                      message: "First name shouldn't include any special character or number!",
                    },
                    onChange: handleEditFormChange,
                  })}
                  type="text"
                  id="name"
                  name="firstName"
                  className="form-control"
                  placeholder={users.length && users[getIndex(users, editContactId)].firstName}
                />
                {<span className="inputError">{errors.firstName?.message}</span>}
              </div>

              <label htmlFor="lastName" className="form-label">
                Last name:
              </label>
              <div className="mb-2 input-group ">
                <span className="input-group-text ms-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-person-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                  </svg>
                </span>
                <input
                  {...register("lastName", {
                    pattern: {
                      value: /^(?=.{1,50}$)[a-z\u0400-\u04FF]+(?:['_.\s][a-z\u0400-\u04FF]+)*$/i,
                      message: "Last name shouldn't include any special character or number!",
                    },
                    onChange: handleEditFormChange,
                  })}
                  type="text"
                  id="name"
                  name="lastName"
                  className="form-control"
                  placeholder={users.length && users[getIndex(users, editContactId)].lastName}
                />
                {<span className="inputError">{errors.lastName?.message}</span>}
              </div>

              <label htmlFor="email" className="form-label">
                Email address:
              </label>
              <div className="input-group mb-2 ">
                <span className="input-group-text ms-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-envelope-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z" />
                  </svg>
                </span>
                <input
                  disabled
                  type="email"
                  name="email"
                  id="email"
                  className="form-control"
                  placeholder={users.length && users[getIndex(users, editContactId)].email}
                  onChange={handleEditFormChange}
                />
              </div>

              <label htmlFor="number" className="form-label">
                Phone number:
              </label>
              <div className="input-group mb-2 ">
                <span className="input-group-text ms-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-telephone-fill"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"
                    />
                  </svg>
                </span>
                <input
                  name="phoneNumber"
                  {...register("phoneNumber", {
                    pattern: {
                      value: /^[0-9+-]+$/,
                      message: "This is not a valid mobile phone to me, try again!",
                    },
                    minLength: {
                      value: 5,
                      message: "This phone number is too short, try again, at least 5 numbers",
                    },
                    maxLength: {
                      value: 12,
                      message: "The phone number is too long, maximum 12 numbers, +380991332801",
                    },
                    onChange: handleEditFormChange,
                  })}
                  type="number"
                  id="number"
                  className="form-control"
                  placeholder={users.length && users[getIndex(users, editContactId)].phoneNumber}
                />
                {<span className="inputError">{errors.phoneNumber?.message}</span>}
              </div>

              <label htmlFor="firm" className="form-label">
                Company:
              </label>
              <div className="input-group mb-2">
                <span className="input-group-text ms-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-building"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .342-.474L6 7.64V4.5a.5.5 0 0 1 .276-.447l8-4a.5.5 0 0 1 .487.022zM6 8.694 1 10.36V15h5V8.694zM7 15h2v-1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V15h2V1.309l-7 3.5V15z"
                    />
                    <path d="M2 11h1v1H2v-1zm2 0h1v1H4v-1zm-2 2h1v1H2v-1zm2 0h1v1H4v-1zm4-4h1v1H8V9zm2 0h1v1h-1V9zm-2 2h1v1H8v-1zm2 0h1v1h-1v-1zm2-2h1v1h-1V9zm0 2h1v1h-1v-1zM8 7h1v1H8V7zm2 0h1v1h-1V7zm2 0h1v1h-1V7zM8 5h1v1H8V5zm2 0h1v1h-1V5zm2 0h1v1h-1V5zm0-2h1v1h-1V3z" />
                  </svg>
                </span>
                <input
                  name="company"
                  {...register("company", {
                    minLength: {
                      value: 3,
                      message: "You need to enter at least 3 characters",
                    },
                    onChange: handleEditFormChange,
                  })}
                  type="text"
                  id="firm"
                  className="form-control"
                  placeholder={users.length && users[getIndex(users, editContactId)].company}
                />
                {<span className="inputError">{errors.company?.message}</span>}
              </div>

              <label htmlFor="startDate" className="form-label">
                Birth date:
              </label>
              <div className="input-group mb-2">
                <span className="input-group-text ms-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-calendar-date"
                    viewBox="0 0 16 16"
                  >
                    <path d="M6.445 11.688V6.354h-.633A12.6 12.6 0 0 0 4.5 7.16v.695c.375-.257.969-.62 1.258-.777h.012v4.61h.675zm1.188-1.305c.047.64.594 1.406 1.703 1.406 1.258 0 2-1.066 2-2.871 0-1.934-.781-2.668-1.953-2.668-.926 0-1.797.672-1.797 1.809 0 1.16.824 1.77 1.676 1.77.746 0 1.23-.376 1.383-.79h.027c-.004 1.316-.461 2.164-1.305 2.164-.664 0-1.008-.45-1.05-.82h-.684zm2.953-2.317c0 .696-.559 1.18-1.184 1.18-.601 0-1.144-.383-1.144-1.2 0-.823.582-1.21 1.168-1.21.633 0 1.16.398 1.16 1.23z" />
                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
                  </svg>
                </span>
                <input
                  name="birth"
                  value={editFormData.birth}
                  {...register("birth", {
                    onChange: handleEditFormChange,
                  })}
                  id="startDate"
                  className="form-control "
                  type="date"
                />
              </div>

              <div className="container  text-center">
                <Button
                  type="submit"
                  variant="success"
                  className="mt-4"
                  disabled={!isDirty || !isValid}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer className="bg-light">
            <Button variant="secondary" onClick={closeEdit}>
              Close
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
};

EditUser.propTypes = {
  modalOpenEdit: PropTypes.bool,
  editContactId: PropTypes.string,
  closeEdit: PropTypes.func,
  handleEditFormSubmit: PropTypes.func,
  handleEditFormChange: PropTypes.func,
  editFormData: PropTypes.object,
};

export default EditUser;
