import React from "react";
import Table from "react-bootstrap/Table";

const TableForm = ({ data }) => {
  return (
    <Table striped bordered hover>
      <tbody>
        <tr>
          <th>Event</th>
          <th>City</th>
          <th>E-mail</th>
        </tr>
        {data.map((item) => (
          <tr key={item.id}>
            <td>{item.event_name}</td>
            <td>{item.event_city}</td>
            <td>{item.email}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TableForm;
