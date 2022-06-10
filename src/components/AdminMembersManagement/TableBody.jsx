/* eslint-disable react/prop-types */
import ReactPaginate from "react-paginate";
import ReadOnlyRow from "./ReadOnlyRow";

const TableBody = ({ tableData, columns, pagesVisited, setPageNumber, handleDeleteClick, usersPerPage, handleEditClick }) => {
  const pageCount = Math.ceil(tableData && tableData.length / usersPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
  return (
    <>
      <tbody>
        {tableData &&
          tableData
            .slice(pagesVisited, pagesVisited + usersPerPage)
            .map((data) => <ReadOnlyRow key={data.id} {...{ data, columns, handleDeleteClick, handleEditClick }} />)}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan="7">
            <ReactPaginate
              breakLabel="..."
              previousLabel={"Previous"}
              nextLabel={"Next"}
              pageCount={pageCount}
              onPageChange={changePage}
              containerClassName={"pagination justify-content-center"}
              pageLinkClassName={"page-link"}
              previousLinkClassName={"page-link"}
              nextLinkClassName={"page-link"}
              activeLinkClassName={"page-item active"}
            />
          </td>
        </tr>
      </tfoot>
    </>
  );
};
export default TableBody;
