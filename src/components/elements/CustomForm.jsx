import React from "react";
import PropTypes from "prop-types";

import "../../styles/form.scss";

const CustomForm = ({ children }) => {
  return <form className="form">{children}</form>;
};

CustomForm.propTypes = {
  children: PropTypes.node,
};

export default CustomForm;
