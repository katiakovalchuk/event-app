import React, { useState } from "react";
import { Events } from "./users";
import TableForm from "./TableForm";
import "./EventTable.css";

const EventTable = () => {
  const [query, setQuery] = useState("");
  const keys = ["event_name", "event_city", "email"];
  const search = (data) => {
    return data.filter((item) =>
      keys.some((key) => item[key].toLowerCase().includes(query))
    );
  };
  return (
    <div className="event">
      <input
        type="text"
        placeholder="Search..."
        className="search"
        onChange={(e) => setQuery(e.target.value)}
      />
      <TableForm data={search(Events)} className="table_form" />
    </div>
  );
};

export default EventTable;
