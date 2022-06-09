/* eslint-disable react/prop-types */
import ReactPaginate from "react-paginate";
import ReadOnlyRow from "./ReadOnlyRow";
// import EditableRow from "./EditableRow";

const TableBody = ({ tableData, columns, pagesVisited, setPageNumber, handleDeleteClick, usersPerPage, handleEditClick }) => {
  const pageCount = Math.ceil(tableData && tableData.length / usersPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
  return (
    <tbody>
      {tableData &&
        tableData
          .slice(pagesVisited, pagesVisited + usersPerPage)
          .map((data) => <ReadOnlyRow key={data.id} {...{ data, columns, handleDeleteClick, handleEditClick }} />)}
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        pageCount={pageCount}
        onPageChange={changePage}
        containerClassName={"paginationBttns"}
        previousLinkClassName={"previousBttn"}
        nextLinkClassName={"nextBttn"}
        disabledClassName={"paginationDisabled"}
        activeClassName={"paginationActive"}
      />
    </tbody>
  );
};
export default TableBody;
// users.slice(pagesVisited, pagesVisited + usersPerPage).map((user) => {
//     return (

//     );
