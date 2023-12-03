import React from "react";

const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination">
        <li className="page-item">
          <button className="page-link" onClick={() => handlePageChange(1)}>
            First Page
          </button>
        </li>
        <li className="page-item">
          <button
            className="page-link"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous Page
          </button>
        </li>
        {[...Array(totalPages).keys()].map((pageNumber) => (
          <li key={pageNumber + 1} className="page-item">
            <button
              className={`page-link ${
                pageNumber + 1 === currentPage ? "active" : ""
              }`}
              onClick={() => handlePageChange(pageNumber + 1)}
            >
              {pageNumber + 1}
            </button>
          </li>
        ))}
        <li className="page-item">
          <button
            className="page-link"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next Page
          </button>
        </li>
        <li className="page-item">
          <button
            className="page-link"
            onClick={() => handlePageChange(totalPages)}
          >
            Last Page
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
