import ReadOnlyRow from "./ReadOnlyRow";

const TableBody = ({ tableData, columns, user, handleDeleteClick }) => {
  return (
    <tbody>
      {tableData &&
        tableData.map((data) => {
          return <ReadOnlyRow data={data} columns={columns} handleDeleteClick={handleDeleteClick} />;
        })}
    </tbody>
  );
};

export default TableBody;
