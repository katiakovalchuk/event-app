import React, {useState} from "react";
import Table from "react-bootstrap/Table";
import PropTypes from "prop-types";

import {usePagination} from "../../hooks/usePagination";
import Pagination from "../Pagination";
import "./style.css";

const TableForm = ({data, handleSorting, columns, query}) => {
  const [sortField, setSortField] = useState("");
  const [order, setOrder] = useState("asc");

  const {
    pageCount,
    currentPage,
    handlePageClick,
    currentItems
  } = usePagination({query, data, order, itemsPerPage: 5});

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
          {columns.map(({label, accessor, sortable}) => {
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
        {currentItems.map((user, idx) => (
          <tr key={user.id}>
            <td className="imageField">
              <img src={user.image} className="profileImage" alt="User image"/>
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
      <Pagination pageCount={pageCount || 1} currentPage={currentPage} handlePageClick={handlePageClick}/>
    </div>
  );
};

export default TableForm;

TableForm.propTypes = {
  data: PropTypes.array,
  handleSorting: PropTypes.func,
  columns: PropTypes.array,
  query: PropTypes.string,
};
