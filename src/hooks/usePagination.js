import { useEffect, useState } from "react";

export const usePagination = ({
  query,
  data,
  order,
  status,
  filterBtn,
  itemsPerPage = 5,
}) => {
  const [currentItems, setCurrentItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    if (filterBtn){
      setItemOffset(0);
    }
  }, [filterBtn]);

  useEffect(() => {
    if (query) {
      setItemOffset(0);
    }
  }, [query]);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(data?.slice(itemOffset, endOffset));
    setCurrentPage(endOffset / itemsPerPage - 1);
    setPageCount(Math.ceil(data?.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, data?.length, status, order, filterBtn]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % data.length;
    setItemOffset(newOffset);
  };

  return {
    pageCount,
    currentPage,
    handlePageClick,
    currentItems
  };
};
