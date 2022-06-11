import { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, deleteDoc, updateDoc, getDocs } from "firebase/firestore";
import { debounce } from "lodash";

import AddUser from "./AddUser";
import EditUser from "./EditUser";
import TableBody from "./TableBody";
import TableHead from "./TableHead";

import { auth } from "../../lib/init-firebase.js";
import { useUserAuth } from "../../context/authContext";
import { usersCollectionRef } from "../../lib/firestore.collections.js";

import "./style.scss";

const Table = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const { sendResetEmail } = useUserAuth();

  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const handleClose = () => setShow(false);
  const handleCloseEdit = () => setShowEdit(false);
  const handleShow = () => setShow(true);
  const handleShowEdit = () => setShowEdit(true);

  const [editContactId, setEditContactId] = useState(null);
  const [addFormData, setAddFormData] = useState({ role: "user" });

  useEffect(() => {
    document.title = "Admin members management";
  });

  const getUsers = () => {
    getDocs(usersCollectionRef).then((data) => {
      setUsers(
        data.docs.map((item) => {
          return { ...item.data(), id: item.id };
        })
      );
    });
  };

  const search = debounce((e) => {
    setQuery(e.target.value);
  }, 350);

  useEffect(() => {
    if (query.length === 0) {
      getUsers();
    } else if (query.length > 2) {
      const keys = ["fullName", "company", "email", "phoneNumber"];
      setUsers(users.filter((item) => keys.some((key) => item[key].toLowerCase().includes(query.toLowerCase()))));
    }
  }, [query]);

  const [editFormData, setEditFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    company: "",
    scores: "",
    birth: "",
  });

  const [pageNumber, setPageNumber] = useState(0);

  const usersPerPage = 5;
  const pagesVisited = pageNumber * usersPerPage;

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

  const handleAddFormSubmit = async (e) => {
    e.preventDefault();
    const res = await createUserWithEmailAndPassword(auth, addFormData.email, "123456");
    await setDoc(doc(usersCollectionRef, res.user.uid), {
      fullName: addFormData.fullName,
      phoneNumber: addFormData.phoneNumber,
      email: addFormData.email,
      company: addFormData.company,
      scores: addFormData.scores,
      birth: addFormData.birth,
      role: addFormData.role,
      rank: 0,
      image: "https://firebasestorage.googleapis.com/v0/b/event-app-98f7d.appspot.com/o/default.png?alt=media&token=ae160ba0-243b-48d9-bc24-c87d990b0cb7",
    });
    await sendResetEmail(addFormData.email);
    getUsers();
  };

  const handleDeleteClick = async (id) => {
    await deleteDoc(doc(usersCollectionRef, id));
    getUsers();
  };

  const handleCancelClick = () => {
    setEditContactId(null);
  };

  const handleEditFormSubmit = (event) => {
    event.preventDefault();
    handleCloseEdit();
    const docRef = doc(usersCollectionRef, editContactId);
    updateDoc(docRef, {
      fullName: editFormData.fullName,
      phoneNumber: editFormData.phoneNumber,
      email: editFormData.email,
      company: editFormData.company,
      scores: editFormData.scores,
      birth: editFormData.birth,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err.message));
    setEditContactId(null);
    getUsers();
  };

  const handleEditClick = (event, contact) => {
    // event.preventDefault();
    setEditContactId(contact.id);
    handleShowEdit();

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
            <Button variant="primary" className="btn btn-primary " onClick={handleShow}>
              Add user
            </Button>

            <div>
              <input onChange={search} className="form-control me-2" type="search" placeholder="Search..." aria-label="Search"></input>
            </div>
          </div>

          <AddUser {...{ show, handleClose, handleAddFormSubmit, handleAddFormChange, addFormData }} />
          {showEdit && <EditUser {...{ showEdit, editContactId, handleCloseEdit, handleEditFormSubmit, handleEditFormChange, addFormData }} />}

          <form onSubmit={handleEditFormSubmit}>
            <table className="table table-admin">
              <TableHead {...{ columns, handleSorting }} />
              <TableBody
                tableData={users}
                {...{
                  editContactId,
                  pagesVisited,
                  usersPerPage,
                  editFormData,
                  columns,
                  setPageNumber,
                  handleDeleteClick,
                  handleEditClick,
                  handleEditFormChange,
                  handleCancelClick,
                }}
              />
            </table>
          </form>
        </Col>
      </Row>
    </Container>
  );
};
export default Table;
