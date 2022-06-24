import { useState } from "react";

export const usePaginate2 = ({ data, itemsPerPage = 5 }) => {
  const [itemOffset, setItemOffset] = useState(0);

  const endOffset = itemOffset + itemsPerPage;
  const displayItems = data.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(data.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    const newOffset = (selected * itemsPerPage) % data.length;
    setItemOffset(newOffset);
  };

  return {
    pageCount,
    handlePageClick,
    displayItems,
  };
};
