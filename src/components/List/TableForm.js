import React from "react";
import Table from "react-bootstrap/Table";

const TableForm = ({ data }) => {
  return (
    <Table striped bordered hover>
      <tbody>
        <tr>
          <th>User name</th>
          <th>City</th>
          <th>E-mail</th>
        </tr>
        {data &&
          data.map((user, idx) => (
            <tr key={user.id}>
              <td>
                {idx + 1}. {user.name}
              </td>
              <td>{user.city}</td>
              <td>{user.email}</td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
};

/*eslint react/prop-types: 0 */

export default TableForm;
