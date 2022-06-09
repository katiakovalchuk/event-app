/* eslint-disable react/prop-types */
import React from "react";
import { Button } from "react-bootstrap";

const EditableRow = ({ editFormData, handleEditFormChange, handleCancelClick }) => {
  return (
    <tr>
      <td>
        <input
          type="text"
          required="required"
          placeholder="Enter a name..."
          name="fullName"
          value={editFormData.fullName}
          onChange={handleEditFormChange}
        ></input>
      </td>

      <td>
        <input type="email" required="required" placeholder="Enter an email..." name="email" value={editFormData.email} onChange={handleEditFormChange}></input>
      </td>

      <td>
        <input
          type="text"
          required="required"
          placeholder="Enter a phone number..."
          name="phoneNumber"
          value={editFormData.phoneNumber}
          onChange={handleEditFormChange}
        ></input>
      </td>

      <td>
        <input
          type="text"
          required="required"
          placeholder="Enter a company name..."
          name="company"
          value={editFormData.company}
          onChange={handleEditFormChange}
        ></input>
      </td>
      <td>
        <input type="text" name="scores" required="required" placeholder="Enter scores..." value={editFormData.scores} onChange={handleEditFormChange} />
      </td>

      <td>
        <input type="date" name="birth" required="required" value={editFormData.birth} onChange={handleEditFormChange} />
      </td>

      <td>
        <Button className="btn me-2" type="submit" variant="success" size="sm">
          Save
        </Button>
        <Button className="btn" type="button" onClick={handleCancelClick} variant="warning" size="sm">
          Cancel
        </Button>
      </td>
    </tr>
  );
};

export default EditableRow;
