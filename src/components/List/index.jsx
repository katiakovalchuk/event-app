import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../store/slices/usersSlice";
import TableForm from "./TableForm";

const List = () => {
  const [query, setQuery] = useState("");
  const [localusers, setLocalusers] = useState([]);
  const keys = ["fullName", "image", "email", "score"];
  const search = (data) => {
    if (data.length) {
      const result = data.filter((item) =>
        keys.some((key) =>
          item[key]?.toLowerCase().includes(query.toLowerCase())
        )
      );
      return result;
    }
    return null;
  };

  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.usersSlice);
  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  useEffect(() => {
    if (users && !localusers.length) setLocalusers(users);
  }, [users]);

  const columns = [
    { label: "User image", accessor: "image", sortable: false },
    { label: "Full Name", accessor: "fullName", sortable: true },
    { label: "Email", accessor: "email", sortable: true },
    { label: "Scores", accessor: "scores", sortable: true },
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
      setLocalusers(sorted);
    }
  };

  return (
    <>
      <div className="membersForm">
        <input
          type="text"
          placeholder="Search..."
          className="search"
          onChange={(e) => setQuery(e.target.value)}
        />
        <TableForm
          data={search(localusers)}
          handleSorting={handleSorting}
          columns={columns}
        />
      </div>
    </>
  );
};

export default List;