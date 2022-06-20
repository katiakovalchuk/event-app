import React from "react";
import PropTypes from "prop-types";

import "../../styles/list-item.scss";

const ListItem = ({ children, link, ...props }) => {
  return (
    <li className={`list-item my-2 ${link ? "list-item--hover" : ""}`} {...props}>
      {children}
    </li>
  );
};

ListItem.propTypes = {
  children: PropTypes.node,
  link: PropTypes.bool,
};

export default ListItem;
