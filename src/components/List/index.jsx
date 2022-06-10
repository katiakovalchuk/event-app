import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../store/slices/usersSlice";
import TableForm from "./TableForm";

const List = () => {
  const [query, setQuery] = useState("");
  const keys = ["name", "city", "email"];
  const search = (data) => {
    if (data.length) {
      const result = data.filter((item) =>
        keys.some((key) => item[key].toLowerCase().includes(query))
      );
      console.log(result);
      return result;
    }
  };

  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.usersSlice);
  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);
  return (
    <>
      <input
        type="text"
        placeholder="Search..."
        className="search"
        onChange={(e) => setQuery(e.target.value)}
      />
      <TableForm data={search(users)} />
    </>
  );
};

export default List;
