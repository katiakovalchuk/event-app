import React from "react";
import PropTypes from "prop-types";

import { Button } from "react-bootstrap";

const CustomButton = ({ version, children, ...props }) => {
  return (
    <Button className={`btn btn-${version}`} {...props}>
      {children}
    </Button>
  );
};

CustomButton.propTypes = {
  children: PropTypes.node,
  version: PropTypes.string,
};

export default CustomButton;
