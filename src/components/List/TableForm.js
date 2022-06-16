import React from "react";
import Table from "react-bootstrap/Table";
import "./style.css";

const TableForm = ({ data, sortData }) => {
  return (
    <Table striped bordered hover>
      <tbody>
        <tr>
          <th>Image</th>
          <th>User name</th>
          <th>City</th>
          <th
            onClick={() => {
              sortData("email");
            }}
          >
            E-mail
          </th>
          <th
            onClick={() => {
              sortData("scores");
            }}
          >
            Scores
          </th>
        </tr>
        {data &&
          data.map((user, idx) => (
            <tr key={user.id}>
              <td className="imageField">
                <img src={user.image} className="profileImage"></img>
              </td>
              <td>
                {idx + 1}. {user.fullName}
              </td>
              <td>{user?.city ?? ""}</td>
              <td>{user.email}</td>
              <td>{user.scores}</td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
};

/*eslint react/prop-types: 0 */

export default TableForm;
