import React from "react";
import { BiDownArrow, BiUpArrow } from "react-icons/bi";
import { useDialog } from "../../context/dialogContext";

const EventSort = () => {
  const { order, handleOrder } = useDialog();
  return (
    <div className="event__sort" onClick={handleOrder}>
      <span>Name</span>
      {order === "asc" ? <BiUpArrow /> : <BiDownArrow />}
    </div>
  );
};

export default EventSort;
