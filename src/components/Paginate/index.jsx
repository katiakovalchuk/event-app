import ReactPaginate from "react-paginate";
import {useEffect, useState} from "react";

const Paginate = () => {
    const itemsPerPage = 5;
    const [currentItems, setCurrentItems] = useState(searchedEvents.slice(0, itemsPerPage));
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    useEffect(() => {
        // Fetch items from another resources.
        const endOffset = itemOffset + itemsPerPage;
        console.log(`Loading items from ${itemOffset} to ${endOffset}`);
        setCurrentItems(searchedEvents.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(searchedEvents.length / itemsPerPage));
    }, [itemOffset, itemsPerPage]);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % searchedEvents.length;
        console.log(
            `User requested page number ${event.selected}, which is offset ${newOffset}`
        );
        setItemOffset(newOffset);
    };

    return (
        <div>Paginate</div>
    )
}

export default Paginate;
