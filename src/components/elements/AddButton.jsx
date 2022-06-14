import React from "react";
import { BsPlusLg } from "react-icons/bs";

import "../../styles/add-button.scss";

const AddButton = ({ ...props }) => {
  return (
    <span className="add-button" {...props}>
      <BsPlusLg />
    </span>
  );
};

export default AddButton;
