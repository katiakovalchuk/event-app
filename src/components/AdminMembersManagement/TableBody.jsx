/* eslint-disable react/prop-types */
import ReadOnlyRow from "./ReadOnlyRow";
// import EditableRow from "./EditableRow";

const TableBody = ({ tableData, columns, handleDeleteClick, handleEditClick }) => {
  return <tbody>{tableData && tableData.map((data) => <ReadOnlyRow key={data.id} {...{ data, columns, handleDeleteClick, handleEditClick }} />)}</tbody>;
};
export default TableBody;
