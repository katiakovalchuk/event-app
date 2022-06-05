import ReadOnlyRow from "./ReadOnlyRow";
import EditableRow from "./EditableRow";

const TableBody = ({ tableData, columns, handleDeleteClick, editContactId, handleEditClick, editFormData, handleEditFormChange, handleCancelClick }) => {
  return (
    <tbody>
      {tableData &&
        tableData.map((data) => (
          <>
            {editContactId === data.id ? (
              <EditableRow key={data.id} {...{ editFormData, handleEditFormChange, handleCancelClick }} />
            ) : (
              <ReadOnlyRow key={data.id} {...{ data, columns, handleDeleteClick, handleEditClick }} />
            )}
          </>
        ))}
    </tbody>
  );
};
export default TableBody;
