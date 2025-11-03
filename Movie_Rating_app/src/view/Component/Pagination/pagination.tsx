import "./pagination.css";
import React, { useState } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const [jumpPage, setJumpPage] = useState<number | "">("");

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const handleJump = () => {
    if (jumpPage !== "" && jumpPage >= 1 && jumpPage <= totalPages) {
      onPageChange(jumpPage);
      setJumpPage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleJump();
  };

  return (
    <div className="pagination">
      <button
        className="page-arrow"
        onClick={handlePrev}
        disabled={currentPage === 1}
      >
        &#8592; {/* Left arrow */}
      </button>

      <span className="page-current">
        {currentPage} / {totalPages}
      </span>

      <button
        className="page-arrow"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        &#8594; {/* Right arrow */}
      </button>

      {/* Jump to page */}
      <div className="page-jump">
        <input
          type="number"
          min={1}
          max={totalPages}
          placeholder="Page"
          value={jumpPage}
          onChange={(e) => setJumpPage(Number(e.target.value))}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleJump}>Go</button>
      </div>
    </div>
  );
};

export default Pagination;
