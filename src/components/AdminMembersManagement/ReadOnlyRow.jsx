import React from "react";

const ReadOnlyRow = ({ data, columns, handleDeleteClick }) => {
  return (
    <tr key={data.id}>
      {columns.map(({ accessor }) => {
        const tData = data[accessor] ? data[accessor] : "——";
        if (accessor === "action") {
          return (
            <td key={accessor}>
              <button type="button" onClick={() => handleDeleteClick(data.id)}>
                Delete
              </button>{" "}
              <button type="button" onClick={() => handleDeleteClick(data.id)}>
                Edit
              </button>
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
