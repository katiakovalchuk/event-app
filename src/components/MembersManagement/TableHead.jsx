/* eslint-disable react/prop-types */
import { useState } from "react";

const TableHead = ({ columns, handleSorting, getOrder }) => {
  const [sortField, setSortField] = useState("");
  const [order, setOrder] = useState("asc");

  const handleSortingChange = (accessor) => {
    const sortOrder = accessor === sortField && order === "asc" ? "desc" : "asc";
    setSortField(accessor);
    setOrder(sortOrder);
    handleSorting(accessor, sortOrder);
    getOrder(sortOrder);
  };

  return (
    <thead>
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
              onClick={sortable ? () => handleSortingChange(accessor) : null}
              className={`${cl} tablehead`}
            >
              {label}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default TableHead;
