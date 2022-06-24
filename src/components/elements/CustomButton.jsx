import React from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import "../../styles/form.scss";

const CustomButton = ({ children, ...props }) => {
  return <Button {...props}>{children}</Button>;
};

CustomButton.propTypes = {
  children: PropTypes.node,
  version: PropTypes.string,
};

export default CustomButton;
