/* eslint-disable react/prop-types */
import React from "react";
import { Button } from "react-bootstrap";
import { useUserAuth } from "../../context/authContext";
import { useDialog } from "../../context/dialogContext";

const ReadOnlyRow = ({ data, columns, handleDeleteClick, handleEditClick }) => {
  const { user } = useUserAuth();
  const { removeRequireConfirm } = useDialog();

  return (
    <tr key={data.id}>
      {columns.map(({ accessor }) => {
        const tData = data[accessor] ? data[accessor] : "——";
        if (accessor === "action") {
          return (
            <td className="text-center align-middle" key={accessor}>
              <Button
                className="btn me-2"
                type="button"
                onClick={(event) => {
                  handleEditClick(event, data);
                  removeRequireConfirm();
                }}
                variant="primary"
                size="sm"
              >
                Edit
              </Button>
              <Button
                disabled={data.id === user.uid}
                type="button"
                onClick={() => handleDeleteClick(data)}
                variant="danger"
                size="sm"
              >
                Delete
              </Button>
            </td>
          );
        } else if (accessor === "image") {
          return (
            <td className="imageField" key={accessor}>
              <img src={tData} className="profileImage" alt="User image" />
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
