import React from "react";
import "./EventTable.css";
import logo from "../../assets/images/logo.png";

const EventTable = () => {
  return (
    <div className="event-wrapper">
      <div className="home-header">
        <img src={logo} alt="app-logo" />
        <h1>Web application поДія</h1>
      </div>
      <div className="app-description animate-charcter">
        Hello. Welcome to поДія app. This is new start-up application, that can
        help you create you personal events and add wishlist with your users. We
        have a lot of benefits:
        <ul>
          <li> - personal account;</li>
          <li> - different roles for users;</li>
          <li> - for different type of roles;</li>
          <li> - unique permissions;</li>
          <li> - scores for events.</li>
        </ul>
      </div>
    </div>
  );
};

export default EventTable;
