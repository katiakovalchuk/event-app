import React from "react";
import ReactPaginate from "react-paginate";
import PropTypes from "prop-types";

const Pagination = ({ pageCount, changePage }) => {
  return (
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
  );
};

Pagination.propTypes = {
  pageCount: PropTypes.number,
  changePage: PropTypes.func,
};

export default Pagination;
