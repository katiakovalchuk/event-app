/* eslint-disable react/prop-types */
import { useState } from "react";
import {ROLES} from "../../store/data";
import {useLocation} from "react-router-dom";
import {useSelector} from "react-redux";

const TableHead = ({ columns, handleSorting, getOrder }) => {
  const [sortField, setSortField] = useState("");
  const [order, setOrder] = useState("asc");
  const {pathname} = useLocation();
  const {
    user: { role },
  } = useSelector((state) => state.userSlice);

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
            {
              return accessor === "scores" && role === ROLES.admin && pathname.startsWith("/managers-management") ?
              null :
              (
                <th
                  key={label}
                  onClick={sortable ? () => handleSortingChange(accessor) : null}
                  className={`${cl} tablehead`}
                >
                  {label}
                </th>
              );
            }
        })}
      </tr>
    </thead>
  );
};

export default TableHead;
