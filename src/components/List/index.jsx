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

  const sortData = (field = "scores") => {
    const copyData = users.concat();
    const res = copyData.sort((a, b) => {
      return a[field] > b[field] ? 1 : -1;
    });
    setLocalusers(res);
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
        <TableForm data={search(localusers)} sortData={sortData} />
      </div>
    </>
  );
};

export default List;
