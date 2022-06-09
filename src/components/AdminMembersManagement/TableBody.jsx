/* eslint-disable react/prop-types */
import ReactPaginate from "react-paginate";
import ReadOnlyRow from "./ReadOnlyRow";

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
      <tr>
        <td colSpan="7" className="pageRow">
          <ReactPaginate
            breakLabel="..."
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={pageCount}
            onPageChange={changePage}
            containerClassName={"paginationBttns"}
            pageLinkClassName={"page-num"}
            previousLinkClassName={"page-num"}
            nextLinkClassName={"page-num"}
            activeLinkClassName={"paginationActive"}
          />
        </td>
      </tr>
    </tbody>
  );
};
export default TableBody;
