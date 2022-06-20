import ReactPaginate from "react-paginate";
import PropTypes from "prop-types";

const Pagination = ({pageCount, currentPage, handlePageClick}) => {

    return (
        <ReactPaginate
            breakLabel="..."
            previousLabel="Previous"
            nextLabel="Next"
            pageCount={pageCount}
            forcePage={currentPage}
            onPageChange={handlePageClick}
            containerClassName={"pagination justify-content-center"}
            pageLinkClassName={"page-link"}
            previousLinkClassName={"page-link me-2"}
            nextLinkClassName={"page-link ms-2"}
            activeLinkClassName={"page-item active"}
        />
    );
};

export default Pagination;

Pagination.propTypes = {
    pageCount: PropTypes.number,
    currentPage: PropTypes.number,
    handlePageClick: PropTypes.func
};
