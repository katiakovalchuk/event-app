import { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import {
  doc,
  setDoc,
  updateDoc,
  getDocs,
  where,
  query,
} from "firebase/firestore";
import { debounce } from "lodash";
import { ToastContainer, toast } from "react-toastify";
import PropTypes from "prop-types";

import AddUser from "./AddUser";
import EditUser from "./EditUser";
import DelUser from "./DelUser";
import TableBody from "./TableBody";
import TableHead from "./TableHead";

import { useUserAuth } from "../../context/authContext";
import { usersCollectionRef } from "../../lib/firestore.collections.js";
import useModalAdd from "../../hooks/useModalAdd";
import useModalEdit from "../../hooks/useModalEdit";
import useModalDel from "../../hooks/useModalDel";

import "./style.scss";
import "react-toastify/dist/ReactToastify.css";
import {useDialog} from "../../context/dialogContext";

const Table = ({ showManagers }) => {
  const [query_, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const { sendLink } = useUserAuth();
  const [delId, setDelId] = useState("");

  const [editContactId, setEditContactId] = useState(null);
  const [addFormData, setAddFormData] = useState({ role: "user" });

  const { modalOpenAdd, closeAdd, openAdd } = useModalAdd();
  const { modalOpenEdit, closeEdit, openEdit } = useModalEdit();
  const { modalOpenDel, closeDel, openDel } = useModalDel();

  const {removeRequireConfirm} = useDialog();

  useEffect(() => {
    if (showManagers) {
      document.title = "Managers Management";
    } else {
      document.title = "Members Management";
    }
  });

  const getUsers = () => {
    let q = "";
    if (showManagers) {
      q = query(usersCollectionRef, where("role", "==", "manager"));
    } else {
      q = query(usersCollectionRef, where("role", "==", "user"));
    }
    const keys = ["fullName", "company", "email", "phoneNumber"];
    getDocs(q).then((data) => {
      setUsers(
        data.docs
          .map((item) => {
            return { ...item.data(), id: item.id };
          })
          .filter((item) =>
            keys.some((key) =>
              item[key].toLowerCase().includes(query_.toLowerCase())
            )
          )
      );
      console.table(users);
    });
  };

  const addUserToast = () => {
    toast.success("User Account has been created", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const deleteUserToast = () => {
    toast.success("A user account was deleted", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

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

  const search = debounce((e) => {
    setQuery(e.target.value);
  }, 350);

  useEffect(() => {
    if (query_.length === 0 || query_.length > 2) {
      getUsers();
    }
  }, [query_]);

  const [editFormData, setEditFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    company: "",
    scores: "",
    birth: "",
  });

  const columns = [
    { label: "Full Name", accessor: "fullName", sortable: true },
    { label: "Email", accessor: "email", sortable: true },
    { label: "Phone number", accessor: "phoneNumber", sortable: true },
    { label: "Company", accessor: "company", sortable: true },
    { label: "Scores", accessor: "scores", sortable: true },
    { label: "Date of birth", accessor: "birth", sortable: true },
    { label: "Actions", accessor: "action", sortable: false },
  ];

  const handleSorting = (sortField, sortOrder) => {
    if (sortField) {
      const sorted = [...users].sort((a, b) => {
        if (a[sortField] === null) return 1;
        if (b[sortField] === null) return -1;
        if (a[sortField] === null && b[sortField] === null) return 0;
        return (
          a[sortField].toString().localeCompare(b[sortField].toString(), "en", {
            numeric: true,
          }) * (sortOrder === "asc" ? 1 : -1)
        );
      });
      setUsers(sorted);
    }
  };

  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...addFormData };
    newFormData[name] = value;
    setAddFormData(newFormData);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...editFormData };
    newFormData[name] = value;
    setEditFormData(newFormData);
  };

  const handleAddFormSubmit = async e => {
    e.preventDefault();
    closeAdd();
    sendLink(addFormData.email);
    const newUser = {
      fullName: addFormData.fullName,
      phoneNumber: addFormData.phoneNumber,
      email: addFormData.email,
      company: addFormData.company,
      scores: addFormData.scores,
      birth: addFormData.birth,
      role: addFormData.role,
      rank: 0,
      image:
        "https://firebasestorage.googleapis.com/v0/b/event-app-98f7d.appspot.com/o/default.png?alt=media&token=ae160ba0-243b-48d9-bc24-c87d990b0cb7",
    };
    await setDoc(doc(usersCollectionRef, addFormData.email), {
      ...newUser,
    });
    setUsers([...users, newUser]);
    addUserToast();
    removeRequireConfirm();
    if (showManagers) {
      getUsers();
    }
  };

  const handleDeleteClick = (data) => {
    setDelId(data.email);
    openDel();
  };

  const handleCancelClick = () => {
    setEditContactId(null);
  };

  const handleEditFormSubmit = () => {
    closeEdit();
    const docRef = doc(usersCollectionRef, editContactId);
    const user = {
      fullName: editFormData.fullName,
      phoneNumber: editFormData.phoneNumber,
      email: editFormData.email,
      company: editFormData.company,
      scores: editFormData.scores,
      birth: editFormData.birth,
    };
    updateDoc(docRef, {
      ...user,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err.message));

    const newUsers = users.map((obj) => {
      if (obj.email === editContactId) {
        return { ...user };
      }
      return obj;
    });
    setUsers([...newUsers]);
    setEditContactId(null);
    editUserToast();
    removeRequireConfirm();
  };

  const handleEditClick = (event, contact) => {
    setEditContactId(contact.email);
    openEdit();
    const formValues = {
      fullName: contact.fullName,
      phoneNumber: contact.phoneNumber,
      email: contact.email,
      company: contact.company,
      scores: contact.scores,
      birth: contact.birth,
    };
    setEditFormData(formValues);
  };

  return (
    <Container>
      <Row>
        <Col md={12}>
          <div className="mt-5 d-flex justify-content-between">
            <Button
              variant="primary"
              className="btn btn-primary "
              onClick={openAdd}
            >
              Add user
            </Button>

            <div>
              <input
                onChange={search}
                className="form-control me-2"
                type="search"
                placeholder="Search..."
                aria-label="Search"
              ></input>
            </div>
          </div>

          <AddUser
            {...{
              modalOpenAdd,
              closeAdd,
              handleAddFormSubmit,
              handleAddFormChange,
              addFormData,
            }}
          />
          {modalOpenEdit && (
            <EditUser
              {...{
                modalOpenEdit,
                editContactId,
                closeEdit,
                handleEditFormSubmit,
                handleEditFormChange,
                addFormData,
              }}
            />
          )}
          {
            <DelUser
              {...{
                modalOpenDel,
                closeDel,
                getUsers,
                deleteUserToast,
                delId,
                setUsers,
                users,
              }}
            />
          }

          <form onSubmit={handleEditFormSubmit}>
            <div className="table-responsive-lg">
              <table className="table table-admin">
                <TableHead {...{ columns, handleSorting }} />
                <TableBody
                  tableData={users}
                  {...{
                    editContactId,
                    editFormData,
                    columns,
                    handleDeleteClick,
                    handleEditClick,
                    handleEditFormChange,
                    handleCancelClick,
                  }}
                />
              </table>
            </div>
          </form>
          <ToastContainer />
        </Col>
      </Row>
    </Container>
  );
};

Table.propTypes = {
  showManagers: PropTypes.bool,
};
export default Table;
