import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../store/slices/usersSlice";
import TableForm from "./TableForm";
import SearchInput from "../elements/SearchInput";

const List = () => {
  const [query, setQuery] = useState("");
  const [localusers, setLocalusers] = useState([]);
  const keys = ["fullName", "lastName", "image", "email", "score"];
  const search = (data) => {
    if (data.length) {
      const result = data.filter((item) =>
        keys.some((key) =>
          item[key]?.toLowerCase().includes(query.toLowerCase())
        )
      );
      return result;
    }
    return [];
  };

  const dispatch = useDispatch();
  const { users, status } = useSelector((state) => state.usersSlice);
  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  useEffect(() => {
    const newUsers = users.filter(
      (item) => item.role != "admin" && item.role != "manager"
    );
    if (users && !localusers.length) setLocalusers(newUsers);
  }, [users]);

  const columns = [
    { label: "User image", accessor: "image", sortable: false },
    { label: "First Name", accessor: "firstName", sortable: true },
    { label: "Last Name", accessor: "lastName", sortable: true },
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
      <Container fluid="xl">
        <div className="membersForm">
          <SearchInput handleChange={(e) => setQuery(e.target.value)} />
          <TableForm
            data={search(localusers)}
            handleSorting={handleSorting}
            columns={columns}
            query={query}
            status={status}
          />
        </div>
      </Container>
    </>
  );
};

export default List;
