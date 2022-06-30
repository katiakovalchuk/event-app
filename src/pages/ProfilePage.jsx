/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Container, Row } from "react-bootstrap";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { toast, ToastContainer } from "react-toastify";
import { useForm } from "react-hook-form";
import { useUserAuth } from "../context/authContext";
import { useDialog } from "../context/dialogContext";
import { ModalForm } from "../components/elements";
import PasswordForm from "../components/forms/PasswordForm";
import ConfirmForm from "../components/forms/ConfirmForm";
import { getUsers, updateUser } from "../store/slices/usersSlice";
import { storage } from "../lib/init-firebase.js";
import { usersCollectionRef } from "../lib/firestore.collections.js";
import { capitalizeFirstLetter, getIndex } from "../helpers/utils.js";
import { getErrorMessage } from "../helpers/getErrorMessage";
import { errMessages } from "../components/Login/messages";

import styles from "../styles/Profile.module.scss";
import Switch from "../components/Switch/Switch";
import { ROLES } from "../store/data";

const ProfilePage = () => {
  const [file, setFile] = useState(null);
  const [addFormData, setAddFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    company: "",
    birth: "",
  });
  const [data, setData] = useState({});
  const [per, setPerc] = useState(null);
  const [loginData, setLoginData] = useState({});
  const { user, changePassword } = useUserAuth();
  const {
    handleShowModal,
    handleCloseModal,
    requireConfirm,
    notifySuccess,
    notifyError,
    removeRequireConfirm,
  } = useDialog();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.usersSlice.users);
  let timerId;
  const isEmptyObject = Object.prototype.hasOwnProperty.call(data, "img");

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

  const isDisabled = (!isValid || !isDirty) && !isEmptyObject;

  useEffect(() => {
    dispatch(getUsers());
    const formValues = {
      birth: users.length && users[getIndex(users, user.email)].birth,
    };
    setAddFormData(formValues);
  }, []);

  useEffect(() => {
    if (!requireConfirm) {
      handleCloseModal();
    }
    return timerId;
  }, [requireConfirm]);

  useEffect(() => {
    document.title = "Profile page";
  });

  const editUserToast = () => {
    toast.success("Your data has been successfully saved!", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...addFormData };
    newFormData[name] = value;
    setAddFormData(newFormData);
  };

  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime() + file.name;
      const storageRef = ref(storage, name);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setPerc(progress);
          switch (snapshot.state) {
            case "paused":
              break;
            case "running":
              break;
            default:
              break;
          }
        },
        (error) => {
          console.error(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setData((prev) => ({ ...prev, img: downloadURL }));
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  const handleAdd = () => {
    const firstName =
      addFormData.firstName ||
      (users.length && capitalizeFirstLetter(users[getIndex(users, user.email)].firstName));
    const lastName =
      addFormData.lastName ||
      (users.length && capitalizeFirstLetter(users[getIndex(users, user.email)].lastName));
    const email = addFormData.email || (users.length && users[getIndex(users, user.email)].email);
    const phoneNumber =
      addFormData.phoneNumber || (users.length && users[getIndex(users, user.email)].phoneNumber);
    const company =
      addFormData.company || (users.length && users[getIndex(users, user.email)].company);
    const birth = addFormData.birth || (users.length && users[getIndex(users, user.email)].birth);
    const image = data.img || (users.length && users[getIndex(users, user.email)].image);

    const docRef = doc(usersCollectionRef, user.email);
    updateDoc(docRef, {
      firstName,
      lastName,
      email,
      phoneNumber,
      company,
      birth,
      image,
    }).then((e) => {
      console.error(e);
      editUserToast();
    });
    setData({});
  };

  const requestData = (data) => {
    setLoginData(data);
  };

  const handleSubmitConfirmation = async (e) => {
    e.preventDefault();
    try {
      await changePassword(user, loginData.newPassword);
      handleCloseModal();
      notifySuccess("Password has been changed!");
      timerId = setTimeout(() => {
        removeRequireConfirm();
      }, 300);
    } catch (err) {
      notifyError(getErrorMessage(err.message, errMessages));
    }
  };

  const getRank = () => {
    let currUser;

    for (const innerUser of users) {
      if (user.email === innerUser.email) {
        currUser = innerUser;
      }
    }
    if (currUser.scores === 0) return 0;

    const copy = JSON.parse(JSON.stringify(users));
    const scores = [];

    const filtered = copy
      .sort((a, b) => b.scores - a.scores)
      .filter((user) => +user.scores !== 0 && user.role === ROLES.user);

    filtered.forEach((user) => {
      if (!scores.includes(user.scores)) {
        scores.push(user.scores);
      }
    });

    const step = Math.ceil(scores.length / 10);
    let rank = 10;
    for (let i = 0; i < scores.length; i++) {
      if (+currUser.scores === +scores[i]) {
        rank -= Math.floor(i / step);
        return `${rank}/10`;
      }
    }
  };

  const updateRank = () => {
    dispatch(updateUser({ id: user.email, rank: getRank() }));
  };

  useEffect(() => {
    updateRank();
  }, []);

  return (
    <section id="profile" className="pt-4">
      {requireConfirm ? (
        <ModalForm
          title="Confirm to change password?"
          form={<ConfirmForm handleConfirmation={handleSubmitConfirmation} />}
        />
      ) : (
        <ModalForm title="Change password" form={<PasswordForm requestData={requestData} />} />
      )}
      <ToastContainer limit={5} />
      <Container fluid="xl">
        <Row>
          <Col md={8}>
            <form onSubmit={handleSubmit(handleAdd)} className="profileForm">
              <label htmlFor="firstName" className="form-label">
                First name:
              </label>
              <div className="mb-4 input-group w-75">
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
                  name="firstName"
                  {...register("firstName", {
                    pattern: {
                      value: /^(?=.{1,50}$)[a-z\u0400-\u04FF]+(?:['_.\s][a-z\u0400-\u04FF]+)*$/i,
                      message: "First name shouldn't include any special character or number!",
                    },
                    onChange: handleAddFormChange,
                  })}
                  type="tel"
                  id="firstName"
                  className="form-control"
                  placeholder={
                    users.length &&
                    capitalizeFirstLetter(users[getIndex(users, user.email)].firstName)
                  }
                />
                {<span className={styles.inputError}>{errors.firstName?.message}</span>}
              </div>

              <label htmlFor="lastName" className="form-label">
                Last name:
              </label>
              <div className="mb-4 input-group w-75">
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
                  name="lastName"
                  {...register("lastName", {
                    pattern: {
                      value: /^(?=.{1,50}$)[a-z\u0400-\u04FF]+(?:['_.\s][a-z\u0400-\u04FF]+)*$/i,
                      message: "Last name name shouldn't include any special character or number!",
                    },
                    onChange: handleAddFormChange,
                  })}
                  type="text"
                  id="lastName"
                  className="form-control"
                  placeholder={
                    users.length &&
                    capitalizeFirstLetter(users[getIndex(users, user.email)].lastName)
                  }
                />
                {<span className={styles.inputError}>{errors.lastName?.message}</span>}
              </div>

              <label htmlFor="email" className="form-label">
                Email address:
              </label>
              <div className="input-group mb-4 w-75">
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
                  type="email"
                  disabled
                  name="email"
                  id="email"
                  className="form-control"
                  onChange={handleAddFormChange}
                  placeholder={users.length && users[getIndex(users, user.email)].email}
                />
                {<span className={styles.inputError}>{errors.email?.message}</span>}
              </div>
              <label htmlFor="phoneNumber" className="form-label">
                Phone number:
              </label>
              <div className="input-group mb-4 w-75">
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
                  type="tel"
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
                    onChange: handleAddFormChange,
                  })}
                  name="phoneNumber"
                  id="phoneNumber"
                  className="form-control"
                  placeholder={users.length && users[getIndex(users, user.email)].phoneNumber}
                />
                {<span className={styles.inputError}>{errors.phoneNumber?.message}</span>}
              </div>
              <label htmlFor="company" className="form-label">
                Company:
              </label>
              <div className="input-group mb-4 w-75">
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
                  type="text"
                  {...register("company", {
                    minLength: {
                      value: 3,
                      message: "You need to enter at least 3 characters",
                    },
                    onChange: handleAddFormChange,
                  })}
                  id="company"
                  name="company"
                  className="form-control"
                  placeholder={
                    users.length &&
                    capitalizeFirstLetter(users[getIndex(users, user.email)].company)
                  }
                />
                {<span className={styles.inputError}>{errors.company?.message}</span>}
              </div>
              <label htmlFor="birth" className="form-label">
                Date of birth:
              </label>
              <div className="input-group mb-4 w-75">
                <span className="input-group-text ms-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-calendar-event"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z" />
                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
                  </svg>
                </span>
                <input
                  name="birth"
                  value={addFormData.birth}
                  {...register("birth", {
                    onChange: handleAddFormChange,
                  })}
                  type="date"
                  id="birth"
                  className="form-control"
                />
              </div>
              <div className="mb-4 text-center">
                <button disabled={isDisabled} type="submit" className="btn btn-secondary">
                  Save
                </button>
              </div>
            </form>
          </Col>
          <Col md={4} className="">
            <div className="card text-center align-items-center shadow rounded">
              <img
                src={require("../assets/images/profile/profile-3.jpg")}
                className="card-img-top"
                alt="profile"
              />
              <div className={styles.imageContainer}>
                {per > 0 && per < 100 ? (
                  <div className={styles.innerbar}>{per}%</div>
                ) : (
                  <>
                    <label htmlFor="file" style={{ width: "100%", height: "100%" }}>
                      <img
                        className={styles.profileImg}
                        src={
                          file
                            ? URL.createObjectURL(file)
                            : users.length && users[getIndex(users, user.email)].image
                        }
                        alt="profile"
                      />
                    </label>
                    <input
                      type="file"
                      id="file"
                      onChange={(e) => setFile(e.target.files[0])}
                      style={{ display: "none" }}
                    />
                  </>
                )}
              </div>

              <div className="card-body ">
                <h5 className="card-title">
                  {users.length && capitalizeFirstLetter(users[getIndex(users, user.email)].role)}
                </h5>
                <p>Rank: {users.length && users[getIndex(users, user.email)].rank}</p>
                <p>Scores: {users.length && users[getIndex(users, user.email)].scores}</p>
                <Switch label={"Show birthday"} user={users[getIndex(users, user.email)]} />
                <button className="btn btn-secondary mt-3" onClick={() => handleShowModal()}>
                  Change password
                </button>
              </div>
            </div>
            <div className="card shadow rounded mt-3">
              <h5 className="card-title m-2 p-2 mb-0">Select profile photo</h5>
              <div className="d-flex flex-row m-2 p-2">
                <div className="p-1">
                  <label htmlFor="file">
                    <img
                      className="icon"
                      src={require("../assets/images/profile/folder-upload.png")}
                      alt="upload"
                      height={64}
                    />
                  </label>
                  <input
                    type="file"
                    id="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    style={{ display: "none" }}
                  />
                </div>
                <div className="p-1 pt-0">
                  <p className="mb-1 ps-2">Choose Image</p>
                  <p className="text-muted mb-1 ms-2">JPG, GIF or PNG. MAX size of 800K</p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ProfilePage;
