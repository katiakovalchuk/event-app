import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { doc, setDoc, updateDoc, getDocs, where, query } from "firebase/firestore";
import { getIndex } from "../../helpers/utils.js";
import { debounce } from "lodash";
import { ToastContainer, toast } from "react-toastify";
import PropTypes from "prop-types";

import AddUser from "./AddUser";
import EditUser from "./EditUser";
import DelUser from "./DelUser";
import TableBody from "./TableBody";
import TableHead from "./TableHead";
import SearchInput from "../elements/SearchInput";

import { useUserAuth } from "../../context/authContext";
import { usersCollectionRef } from "../../lib/firestore.collections.js";
import useModalAdd from "../../hooks/useModalAdd";
import useModalEdit from "../../hooks/useModalEdit";
import useModalDel from "../../hooks/useModalDel";

import "./style.scss";
import "react-toastify/dist/ReactToastify.css";
import { useDialog } from "../../context/dialogContext";
import { ROLES } from "../../store/data";

const Table = ({ showManagers }) => {
  const [query_, setQuery] = useState("");

  const { sendLink } = useUserAuth();
  const [delId, setDelId] = useState("");

  const [editContactId, setEditContactId] = useState(null);
  const [addFormData, setAddFormData] = useState({ role: "user" });

  const { modalOpenAdd, closeAdd, openAdd } = useModalAdd();
  const { modalOpenEdit, closeEdit, openEdit } = useModalEdit();
  const { modalOpenDel, closeDel, openDel } = useModalDel();

  const { removeRequireConfirm } = useDialog();

  const [allUsers, setUsers] = useState([]);
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = showManagers ? "Managers Management" : "Members Management";
  });

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    let q = "";
    if (showManagers) {
      q = query(usersCollectionRef, where("role", "==", "manager"));
    } else {
      q = query(usersCollectionRef, where("role", "==", "user"));
    }
    getDocs(q).then((data) => {
      setUsers(
        data.docs.map((item) => {
          return { ...item.data(), id: item.id };
        })
      );
    });
  };

  const searchData = (data) => {
    const keys = ["firstName", "lastName", "company", "email", "phoneNumber"];
    return data.filter((item) =>
      keys.some((key) => item[key]?.toLowerCase().includes(query_.toLowerCase()))
    );
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

  const sameEmailToast = () => {
    toast.error("User with this email already exists", {
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

  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    company: "",
    birth: "",
  });

  const columns = [
    { label: "User image", accessor: "image", sortable: false },
    { label: "First name", accessor: "firstName", sortable: true },
    { label: "Last name", accessor: "lastName", sortable: true },
    { label: "Email", accessor: "email", sortable: true },
    { label: "Phone number", accessor: "phoneNumber", sortable: true },
    { label: "Company", accessor: "company", sortable: true },
    { label: "Scores", accessor: "scores", sortable: true },
    { label: "Date of birth", accessor: "birth", sortable: false },
    { label: "Actions", accessor: "action", sortable: false },
  ];

  const handleSorting = (sortField, sortOrder) => {
    if (sortField) {
      const sorted = [...allUsers].sort((a, b) => {
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

  const handleAddFormSubmit = async (e) => {
    e.preventDefault();
    const isUserEmail = allUsers.some((user) => user.email === addFormData.email);
    if (isUserEmail) {
      sameEmailToast();
      removeRequireConfirm();
      return;
    }
    closeAdd();
    sendLink(addFormData.email);
    const newUser = {
      firstName: addFormData.firstName,
      lastName: addFormData.lastName,
      phoneNumber: addFormData.phoneNumber,
      email: addFormData.email,
      company: addFormData.company,
      scores: 0,
      birth: addFormData.birth || "",
      role: pathname.startsWith("/managers-management") ? ROLES.manager : ROLES.user,
      rank: 0,
      isShowBirthday: false,
      image:
        "https://firebasestorage.googleapis.com/v0/b/event-app-98f7d.appspot.com/o/Circle-icons-profile.svg?alt=media&token=d038c042-4cdf-493d-9a79-157127867e65",
    };
    console.log(newUser);
    await setDoc(doc(usersCollectionRef, addFormData.email), {
      ...newUser,
    });
    setUsers([...allUsers, newUser]);
    addUserToast();
    removeRequireConfirm();
    getUsers();
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
      firstName: editFormData.firstName,
      lastName: editFormData.lastName,
      phoneNumber: editFormData.phoneNumber,
      email: editFormData.email,
      scores: allUsers[getIndex(allUsers, editContactId)].scores,
      company: editFormData.company,
      birth: editFormData.birth,
      isShowBirthday: allUsers[getIndex(allUsers, editContactId)].isShowBirthday,
    };
    updateDoc(docRef, {
      ...user,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err.message));

    const newUsers = allUsers.map((obj) => {
      if (obj.email === editContactId) {
        return { ...user, image: obj.image };
      }
      return obj;
    });
    setUsers([...newUsers]);
    setEditContactId(null);
    editUserToast();
    removeRequireConfirm();
    getUsers();
    setStatus((prev) => !prev);
  };

  const handleEditClick = (event, contact) => {
    setEditContactId(contact.email);
    openEdit();
    const formValues = {
      firstName: contact.firstName,
      lastName: contact.lastName,
      phoneNumber: contact.phoneNumber,
      email: contact.email,
      company: contact.company,
      birth: contact.birth,
    };
    setEditFormData(formValues);
  };

  const getOrder = (order) => setOrder(order);

  return (
    <Container>
      <Row>
        <Col md={12}>
          <div className="mt-5 d-flex justify-content-between">
            <Button
              variant="primary"
              className="btn btn-primary "
              onClick={() => {
                openAdd();
                removeRequireConfirm();
              }}
            >
              {pathname.startsWith("/managers-management") ? "Add manager" : "Add user"}
            </Button>

            <div>
              <SearchInput handleChange={search} />
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
                editFormData,
              }}
            />
          )}
          {
            <DelUser
              {...{
                modalOpenDel,
                closeDel,
                deleteUserToast,
                delId,
                setUsers,
                allUsers,
              }}
            />
          }

          <form onSubmit={handleEditFormSubmit}>
            <div className="table-responsive-lg">
              <table className="table table-admin">
                <TableHead {...{ columns, handleSorting, getOrder }} />
                <TableBody
                  tableData={searchData(allUsers)}
                  {...{
                    editContactId,
                    editFormData,
                    columns,
                    handleDeleteClick,
                    handleEditClick,
                    handleEditFormChange,
                    handleCancelClick,
                    query_,
                    order,
                    status,
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
