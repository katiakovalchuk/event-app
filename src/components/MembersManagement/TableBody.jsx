/* eslint-disable react/prop-types */
import Pagination from "../Pagination";
import ReadOnlyRow from "./ReadOnlyRow";
import { usePagination } from "../../hooks/usePagination";

const TableBody = ({
  tableData,
  columns,
  handleDeleteClick,
  handleEditClick,
  query_,
  order,
  status,
}) => {
  const { pageCount, currentPage, handlePageClick, currentItems } = usePagination({
    query: query_,
    status,
    order,
    data: tableData,
    itemsPerPage: 6,
  });

  return (
    <>
      <tbody>
        {currentItems &&
          currentItems.map((data) => (
            <ReadOnlyRow key={data.id} {...{ data, columns, handleDeleteClick, handleEditClick }} />
          ))}
      </tbody>
      <tfoot>
        {currentItems.length === 0 && (
          <tr className="text-center">
            <td colSpan="9">
              <div className="text-center mt-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="gray"
                  className="bi bi-archive text-center"
                  viewBox="0 0 16 16"
                >
                  <path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1V2zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5H2zm13-3H1v2h14V2zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
                </svg>
                <p className="gray mt-1">No Data</p>
              </div>
            </td>
          </tr>
        )}
        {!!tableData.length && (
          <tr className="no-data">
            <td colSpan="9">
              <Pagination
                pageCount={pageCount || 1}
                currentPage={currentPage}
                handlePageClick={handlePageClick}
              />
            </td>
          </tr>
        )}
      </tfoot>
    </>
  );
};
export default TableBody;
