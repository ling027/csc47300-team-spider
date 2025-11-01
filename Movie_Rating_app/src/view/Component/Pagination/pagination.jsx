
import "./pagination.css"; 

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(
      <button
        key={i}
        onClick={() => onPageChange(i)}
        className={`page-btn ${currentPage === i ? "active" : ""}`}
      >
        {i}
      </button>
    );
  }

  return <div className="pagination">{pages}</div>;
}

export default Pagination;
