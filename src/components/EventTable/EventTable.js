import React from "react";
import "./EventTable.css";

const EventTable = () => {
  return (
    <div className="event-wrapper">
      <div className="app-description">
        <p>
          Hello. Welcome to поДія app. This is new start-up application, that
          can help you create you personal events and add wishlist with your
          users. We have a lot of benefits:
        </p>
        <ul>
          <li> - personal account</li>
          <li> - different roles for users</li>
          <li> - for different type of roles</li>
          <li> - unique permissions</li>
          <li> - scores for events</li>
        </ul>
      </div>
    </div>
  );
};

export default EventTable;
