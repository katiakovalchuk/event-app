import { useState } from "react";
import TableBody from "./TableBody";
import TableHead from "./TableHead";
import { doc, collection, addDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { useUserAuth } from "../../context/authContext";
import { db } from "../../lib/init-firebase.js";

import { useCollection } from "../../hooks/useCollection";
import "./style.scss";

const Table = () => {
  const { documents: users_live } = useCollection("users_test");
  // const [contacts, setContacts] = useState({});

  const [addFormData, setAddFormData] = useState({
    fullName: "",
    address: "",
    phoneNumber: "",
    email: "",
  });

  const [tableData, setTableData] = useState("");
  const { users } = useUserAuth();

  const columns = [
    { label: "Full Name", accessor: "full_name", sortable: true },
    { label: "Email", accessor: "email", sortable: false },
    { label: "Gender", accessor: "gender", sortable: true },
    { label: "Age", accessor: "age", sortable: true },
    { label: "Start date", accessor: "start_date", sortable: true },
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

  const handleAddFormSubmit = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "users_test"), {
      full_name: addFormData.fullName,
      phoneNumber: addFormData.phoneNumber,
      email: addFormData.email,
      createdAt: serverTimestamp(),
    });
  };

  // const handleAddFormSubmit = (event) => {
  //   event.preventDefault();

  //   const newContact = {
  //     id: "nanoid()",
  //     fullName: addFormData.fullName,
  //     address: addFormData.address,
  //     phoneNumber: addFormData.phoneNumber,
  //     email: addFormData.email,
  //   };

  //   // const newContacts = [...contacts, newContact];
  //   // setContacts(newContacts);
  // };

  const handleAddFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;

    setAddFormData(newFormData);
  };

  // const handleDeleteClick = (id) => {
  //   // const newContacts = [...contacts];
  //   // const index = contacts.findIndex((contact) => contact.id === contactId);
  //   // newContacts.splice(index, 1);
  //   // setContacts(newContacts);

  // };

  const handleDelete = async (id) => {
    console.log("id => ", id);
    const colRef = collection(db, "users_test");
    await deleteDoc(doc(colRef, id));
  };

  return (
    <>
      <table className="table">
        <TableHead columns={columns} handleSorting={handleSorting} />
        <TableBody columns={columns} tableData={users_live} user={users} handleDeleteClick={handleDelete} />
      </table>
      <h2>Add user</h2>
      <form onSubmit={handleAddFormSubmit}>
        <input type="text" name="fullName" required="required" placeholder="Enter a name..." onChange={handleAddFormChange} />
        <input type="text" name="address" required="required" placeholder="Enter an addres..." onChange={handleAddFormChange} />
        <input type="text" name="phoneNumber" required="required" placeholder="Enter a phone number..." onChange={handleAddFormChange} />
        <input type="email" name="email" required="required" placeholder="Enter an email..." onChange={handleAddFormChange} />
        <button type="submit">Add</button>
      </form>
    </>
  );
};

export default Table;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Table, Popconfirm, Button, Space, Form, Input } from "antd";
// import { isEmpty } from "lodash";
// import { SearchOutlined } from "@ant-design/icons";
// import Highlighter from "react-highlight-words";
// import "antd/dist/antd.min.css";
// import { Container, Row, Col } from "react-bootstrap";
// import { useUserAuth } from "../../context/authContext";

// import { getDocs, deleteDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
// import { auth, db } from "../../firebase-config";

// import { useCollection } from "../../hooks/useCollection";

// const AdminMembersManagementTemplate = () => {
//   const [gridData, setGridData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [editRowKey, setEditRowKey] = useState("");
//   const [sortedInfo, setSortedInfo] = useState({});
//   const [form] = Form.useForm();
//   const [searchText, setSearchText] = useState("");
//   const [searchColText, setSearchColText] = useState("");
//   const [searchedCol, setSearchedCol] = useState("");
//   // const [filteredInfo, setFilteredInfo] = useState({}); filtr
//   // const [showFilter, setShowFilter] = useState(true); filtr
//   let [filteredData] = useState();
//   // const { users } = useUserAuth();
//   const { documents: users } = useCollection("users_test");

//   // const { documents: users_live } = useCollection("users_test");

//   useEffect(() => {
//     loadData();
//   }, []);

//   // const getUsers = () => {
//   //   getDocs(collection(db, "users_test")).then((data) => {
//   //     setGridData(
//   //       data.docs.map((item) => {
//   //         return { ...item.data(), id: item.id };
//   //       })
//   //     );
//   //   });
//   // };

//   const loadData = async () => {
//     setLoading(true);
//     console.log(users);
//     // getUsers();
//     // const response = await axios.get("https://jsonplaceholder.typicode.com/comments");
//     setGridData(users);
//     // console.log(response.data);
//     setLoading(false);
//   };

//   const dataWithAge = gridData.map((item) => ({
//     ...item,
//     age: Math.floor(Math.random() * 6) + 20,
//   }));

//   const modifiedData = dataWithAge.map(({ body, ...item }) => ({
//     ...item,
//     key: item.id,
//     // message: isEmpty(body) ? item.message : body,
//   }));

//   const deleteUser = async (id) => {
//     await deleteDoc(doc(db, "users_test", id));
//   };

//   const handleDelete = (value) => {
//     console.log("value", value.id);
//     // const dataSource = [...modifiedData];
//     // const filteredData = dataSource.filter((item) => item.id !== value.id);
//     // setGridData(filteredData);

//     // const docRef = doc(db, "books", deleteBookForm.id.value);

//     // deleteDoc(docRef).then(() => {
//     //   deleteBookForm.reset();
//     // });

//     deleteUser(value.id);

//     console.log(gridData);
//     console.log("delete");
//   };

//   const isEditing = (record) => {
//     return record.key === editRowKey;
//   };

//   const cancel = () => {
//     setEditRowKey("");
//   };
//   const save = async (key) => {
//     try {
//       const row = await form.validateFields();
//       const newData = [...modifiedData];
//       const index = newData.findIndex((item) => key === item.key);

//       console.log("index", index);
//       console.log("newData", newData[index]);

//       if (index > -1) {
//         const item = newData[index];
//         newData.splice(index, 1, { ...item, ...row });
//         setGridData(newData);
//         setEditRowKey("");
//       }
//     } catch (error) {
//       console.log("error", error);
//     }
//   };

//   const edit = (record) => {
//     form.setFieldsValue({
//       name: "",
//       email: "",
//       message: "",
//       ...record,
//     });
//     setEditRowKey(record.key);
//   };

//   const handleChange = (_, filters, sorter) => {
//     const { order, field } = sorter;
//     // setFilteredInfo(filters); filtr
//     setSortedInfo({ columnKey: field, order });
//   };

//   const getColumnSearchProps = (dataIndex) => ({
//     filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
//       <div style={{ padding: 8 }}>
//         <Input
//           placeholder={`Search ${dataIndex}`}
//           value={selectedKeys[0]}
//           onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
//           onPressEnter={() => handleSearchCol(selectedKeys, confirm, dataIndex)}
//           style={{ width: 188, marginBottom: 0, display: "block" }}
//         />
//         <Space style={{ marginTop: 4 }}>
//           <Button type="primary" onClick={() => handleSearchCol(selectedKeys, confirm, dataIndex)} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>
//             Search
//           </Button>
//           <Button onClick={() => handleResetCol(clearFilters)} size="small" style={{ width: 90 }}>
//             Resetus
//           </Button>
//         </Space>
//       </div>
//     ),
//     filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
//     onFilter: (value, record) => (record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : ""),
//     render: (text) =>
//       searchedCol === dataIndex ? (
//         <Highlighter
//           highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
//           searchWords={[searchColText]}
//           autoEscape
//           textToHighlight={text ? text.toString() : ""}
//         />
//       ) : (
//         text
//       ),
//   });

//   const handleResetCol = (clearFilters) => {
//     clearFilters();
//     setSearchColText("");

//     // setShowFilter(true); filtr
//   };

//   const handleSearchCol = (selectedKeys, confirm, dataIndex) => {
//     confirm();
//     // setShowFilter(false); filtr
//     setSearchColText(selectedKeys[0]);
//     setSearchedCol(dataIndex);
//   };

//   // const filterObj = { filtr
//   //   filters: [
//   //     { text: "20", value: "20" },
//   //     { text: "21", value: "21" },
//   //     { text: "22", value: "22" },
//   //     { text: "23", value: "23" },
//   //     { text: "24", value: "24" },
//   //     { text: "25", value: "25" },
//   //   ],
//   //   filteredValue: filteredInfo.age || null,
//   //   onFilter: (value, record) => String(record.age).includes(value),
//   // };

//   // const showFilterAge = showFilter ? filterObj : null; filtr

//   const columns = [
//     // {
//     //   title: "ID",
//     //   dataIndex: "id",
//     // },
//     {
//       title: "Name",
//       dataIndex: "full_name",
//       align: "center",
//       editTable: true,
//       // sorter: (a, b) => a.name.length - b.name.length,
//       sortOrder: sortedInfo.columnKey === "full_name" && sortedInfo.order,
//       sorter: (a, b) => a.full_name.localeCompare(b.full_name),
//       ...getColumnSearchProps("full_name"),
//     },
//     {
//       title: "Email",
//       dataIndex: "email",
//       align: "center",
//       editTable: true,
//       //sorter: (a, b) => a.email.length - b.email.length,
//       sorter: (a, b) => a.email.localeCompare(b.email),
//       sortOrder: sortedInfo.columnKey === "email" && sortedInfo.order,
//       ...getColumnSearchProps("email"),
//     },
//     {
//       title: "Telephone",
//       dataIndex: "phoneNumber",
//       align: "center",
//       editTable: true,
//       // sorter: (a, b) => a.telephone.length - b.telephone.length,
//       sorter: (a, b) => a.telephone.localeCompare(b.telephone),
//       sortOrder: sortedInfo.columnKey === "telephone" && sortedInfo.order,
//       ...getColumnSearchProps("telephone"),
//     },
//     {
//       title: "Birth",
//       dataIndex: "birth",
//       align: "center",
//       editTable: true,
//       // sorter: (a, b) => a.birth.length - b.birth.length,
//       sorter: (a, b) => a.birth - b.birth,
//       sortOrder: sortedInfo.columnKey === "birth" && sortedInfo.order,
//       ...getColumnSearchProps("telephone"),
//     },

//     // { filtr
//     //   title: "Age",
//     //   dataIndex: "age",
//     //   align: "center",
//     //   editTable: false,
//     //   sorter: (a, b) => a.age.length - b.age.length,
//     //   sortOrder: sortedInfo.columnKey === "age" && sortedInfo.order,
//     //   ...showFilterAge,
//     // },
//     {
//       title: "Company",
//       dataIndex: "company",
//       align: "center",
//       editTable: true,
//       // sorter: (a, b) => a.company.length - b.company.length,
//       sortOrder: sortedInfo.columnKey === "company" && sortedInfo.order,
//       sorter: (a, b) => a.company.localeCompare(b.company),
//       ...getColumnSearchProps("company"),
//       // ...showFilterAge, filtr
//     },
//     {
//       title: "Scores",
//       dataIndex: "scores",
//       align: "center",
//       editTable: true,
//       // sorter: (a, b) => a.scores.length - b.scores.length,
//       sorter: (a, b) => a.scores - b.scores,
//       sortOrder: sortedInfo.columnKey === "scores" && sortedInfo.order,
//       ...getColumnSearchProps("telephone"),
//     },
//     {
//       title: "Action",
//       dataIndex: "action",
//       align: "center",
//       render: (_, record) => {
//         const editable = isEditing(record);
//         return modifiedData.length >= 1 ? (
//           <Space>
//             <Popconfirm title="Do you really want to delete?" onConfirm={() => handleDelete(record)}>
//               <Button danger type="primary" disabled={editable}>
//                 Delete
//               </Button>
//             </Popconfirm>
//             {editable ? (
//               <span>
//                 <Space size="middle">
//                   <Button onClick={() => save(record.key)} type="primary" style={{ marginRight: 8 }}>
//                     Save
//                   </Button>
//                   <Popconfirm title="Are you sure to cancel?" onConfirm={cancel}>
//                     <Button>Cancel</Button>
//                   </Popconfirm>
//                 </Space>
//               </span>
//             ) : (
//               <Button onClick={() => edit(record)} type="primary">
//                 Edit
//               </Button>
//             )}
//           </Space>
//         ) : null;
//       },
//     },
//   ];

//   const mergedColumns = columns.map((col) => {
//     if (!col.editTable) {
//       return col;
//     }
//     return {
//       ...col,
//       onCell: (record) => ({
//         record,
//         dataIndex: col.dataIndex,
//         title: col.title,
//         editing: isEditing(record),
//       }),
//     };
//   });

//   const EditableCell = ({ editing, dataIndex, title, record, children, ...restProps }) => {
//     const input = <Input />;
//     return (
//       <td {...restProps}>
//         {editing ? (
//           <Form.Item
//             name={dataIndex}
//             style={{ margin: 0 }}
//             rules={[
//               {
//                 required: true,
//                 message: `Please input some value in ${title} field`,
//               },
//             ]}
//           >
//             {input}
//           </Form.Item>
//         ) : (
//           children
//         )}
//       </td>
//     );
//   };

//   const globalSearch = () => {
//     filteredData = modifiedData.filter((value) => {
//       return value.name.toLowerCase().includes(searchText.toLowerCase()) || value.email.toLowerCase().includes(searchText.toLowerCase());
//     });
//     setGridData(filteredData);
//   };

//   const handleInputChange = (e) => {
//     setSearchText(e.target.value);
//     if (e.target.value === "") {
//       loadData();
//     }
//   };

//   const reset = () => {
//     setSortedInfo({});
//     // setFilteredInfo({}); filtr
//     setSearchText("");
//     loadData();
//   };

//   return (
//     <Container>
//       <Row>
//         <Col md={12}>
//           <Space style={{ marginBottom: 16 }}>
//             <Input placeholder="Enter Search Text" onChange={handleInputChange} type="text" allowClear value={searchText} />
//             <Button onClick={globalSearch} type="primary">
//               Searchqq
//             </Button>
//             <Button onClick={reset}>Reset</Button>
//           </Space>
//           <Form form={form} component={false}>
//             <Table
//               columns={mergedColumns}
//               components={{
//                 body: {
//                   cell: EditableCell,
//                 },
//               }}
//               dataSource={filteredData && filteredData.length ? filteredData : modifiedData}
//               bordered
//               loading={loading}
//               onChange={handleChange}
//               pagination={{ position: ["bottomCenter"] }}
//             />
//           </Form>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default AdminMembersManagementTemplate;
