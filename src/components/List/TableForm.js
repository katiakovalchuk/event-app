import React from "react";
import Table from "react-bootstrap/Table";
import { useState } from "react";
import "./style.css";

const TableForm = ({ data, handleSorting, columns }) => {
  const [sortField, setSortField] = useState("");
  const [order, setOrder] = useState("asc");

  const handleSortingChange = (accessor) => {
    const sortOrder =
      accessor === sortField && order === "asc" ? "desc" : "asc";
    setSortField(accessor);
    setOrder(sortOrder);
    handleSorting(accessor, sortOrder);
  };

  return (
    <div className="table-responsive-md">
      <Table striped bordered hover className="members-table">
        <tbody>
          <tr>
            {columns.map(({ label, accessor, sortable }) => {
              const cl = sortable
                ? sortField && sortField === accessor && order === "asc"
                  ? "up"
                  : sortField && sortField === accessor && order === "desc"
                  ? "down"
                  : "default"
                : "";
              return (
                <th
                  key={label}
                  onClick={
                    sortable ? () => handleSortingChange(accessor) : null
                  }
                  className={cl}
                >
                  {label}
                </th>
              );
            })}
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
                <td>{user.email}</td>
                <td>{user.scores}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
};

/*eslint react/prop-types: 0 */

export default TableForm;