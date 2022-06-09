import React from "react";
import PropTypes from "prop-types";

import { Button } from "react-bootstrap";

const CustomButton = ({ children, ...props }) => {
  return (
    <Button className="button" {...props}>
      {children}
    </Button>
  );
};

CustomButton.propTypes = {
  children: PropTypes.node,
};

export default CustomButton;
