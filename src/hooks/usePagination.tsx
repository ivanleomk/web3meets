import { useState } from "react";

function usePagination<T>(data: T[] = [], itemsPerPage = 20) {
  const [currentPage, setCurrentPage] = useState(1);
  const maxPage = Math.ceil(data.length / itemsPerPage);

  function currentData() {
    const begin = (currentPage - 1) * itemsPerPage;
    const end = begin + itemsPerPage;
    return data.slice(begin, end);
  }

  function getCurrentStart() {
    return (currentPage - 1) * itemsPerPage;
  }

  function getCurrentEnd() {
    const begin = (currentPage - 1) * itemsPerPage;
    return Math.min(begin + itemsPerPage - 1, data.length);
  }

  function next() {
    setCurrentPage((currentPage) => Math.min(currentPage + 1, maxPage));
  }

  function prev() {
    setCurrentPage((currentPage) => Math.max(currentPage - 1, 1));
  }

  function jump(page: number) {
    const pageNumber = Math.max(1, page);
    setCurrentPage(Math.min(pageNumber, maxPage));
  }

  return {
    next,
    prev,
    jump,
    currentData,
    getCurrentStart,
    getCurrentEnd,
    currentPage,
    maxPage,
    dataSize: data.length,
  };
}

export default usePagination;
