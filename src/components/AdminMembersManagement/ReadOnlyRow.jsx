import React from "react";
import { Button } from "react-bootstrap";

const ReadOnlyRow = ({ data, columns, handleDeleteClick, handleEditClick }) => {
  return (
    <tr key={data.id}>
      {columns.map(({ accessor }) => {
        const tData = data[accessor] ? data[accessor] : "——";
        if (accessor === "action") {
          return (
            <td key={accessor}>
              <Button className="btn me-2" type="button" onClick={(event) => handleEditClick(event, data)} variant="warning" size="sm">
                Edit
              </Button>
              <Button type="button" onClick={() => handleDeleteClick(data.id)} variant="danger" size="sm">
                Delete
              </Button>
            </td>
          );
        } else {
          return <td key={accessor}>{tData}</td>;
        }
      })}
    </tr>
  );
};

export default ReadOnlyRow;
