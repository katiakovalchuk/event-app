import React from "react";
import PropTypes from "prop-types";

import { Button } from "react-bootstrap";

const CustomButton = ({ arrow, children, ...props }) => {
  return (
    <Button className={`button ${arrow && "btn-arrow"} `} {...props}>
      {children}
    </Button>
  );
};

CustomButton.propTypes = {
  children: PropTypes.node,
  arrow: PropTypes.bool,
};

export default CustomButton;
