/* eslint-disable react/prop-types */
import React from "react";
import { Button } from "react-bootstrap";
import { useUserAuth } from "../../context/authContext";

const ReadOnlyRow = ({ data, columns, handleDeleteClick, handleEditClick }) => {
  const { user } = useUserAuth();
  return (
    <tr key={data.id}>
      {columns.map(({ accessor }) => {
        const tData = data[accessor] ? data[accessor] : "——";
        if (accessor === "action") {
          return (
            <td className="text-center" key={accessor}>
              <Button className="btn me-2" type="button" onClick={(event) => handleEditClick(event, data)} variant="warning" size="sm">
                Edit
              </Button>
              <Button disabled={data.id === user.uid} type="button" onClick={() => handleDeleteClick(data.id)} variant="danger" size="sm">
                Delete
              </Button>
            </td>
          );
        } else {
          return (
            <td className="align-middle" key={accessor}>
              {tData}
            </td>
          );
        }
      })}
    </tr>
  );
};

export default ReadOnlyRow;
