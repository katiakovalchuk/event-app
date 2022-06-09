/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, deleteDoc, updateDoc } from "firebase/firestore";

import AddUser from "./AddUser";
import TableBody from "./TableBody";
import TableHead from "./TableHead";

import { auth } from "../../lib/init-firebase.js";
import { useUserAuth } from "../../context/authContext";
import { useCollection } from "../../hooks/useCollection";
import { usersCollectionRef } from "../../lib/firestore.collections.js";

import "./style.scss";

const Table = () => {
  const { documents: users_live } = useCollection("users");
  const { users, sendResetEmail } = useUserAuth();
  const [tableData, setTableData] = useState(users);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [editContactId, setEditContactId] = useState(null);

  const [addFormData, setAddFormData] = useState({ role: "user" });

  const [editFormData, setEditFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    company: "",
    scores: "",
    birth: "",
  });

  const columns = [
    { label: "Full Name", accessor: "fullName", sortable: false },
    { label: "Email", accessor: "email", sortable: false },
    { label: "Phone number", accessor: "phoneNumber", sortable: false },
    { label: "Company", accessor: "company", sortable: false },
    { label: "Scores", accessor: "scores", sortable: false },
    { label: "Date of birth", accessor: "birth", sortable: false },
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
      setTableData(sorted);
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
  };

  const handleDeleteClick = async (id) => {
    await deleteDoc(doc(usersCollectionRef, id));
  };

  const handleCancelClick = () => {
    setEditContactId(null);
  };

  const handleEditFormSubmit = (event) => {
    event.preventDefault();
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
  };

  const handleEditClick = (event, contact) => {
    event.preventDefault();
    setEditContactId(contact.id);
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
          <Button variant="primary" className="btn btn-primary mt-5" onClick={handleShow}>
            Add user
          </Button>
          <AddUser {...{ show, handleClose, handleAddFormSubmit, handleAddFormChange, addFormData }} />
          <form onSubmit={handleEditFormSubmit}>
            <table className="table">
              <TableHead {...{ columns, handleSorting }} />
              <TableBody
                tableData={users_live}
                {...{ editContactId, editFormData, columns, handleDeleteClick, handleEditClick, handleEditFormChange, handleCancelClick }}
              />
            </table>
          </form>
        </Col>
      </Row>
    </Container>
  );
};
export default Table;
