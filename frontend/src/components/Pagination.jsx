// src/components/Pagination.jsx
// Reusable pagination component

import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Do not show pagination if there is only one page
  if (totalPages <= 1) return null;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    // Adjust start if we are near the end
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
        style={{ color: "var(--color-text-secondary)" }}
      >
        <HiChevronLeft className="w-4 h-4" />
      </button>

      {/* Page numbers */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={
            "w-9 h-9 rounded-lg text-sm font-medium transition-colors " +
            (page === currentPage
              ? "bg-indigo-500 text-white"
              : "hover:bg-gray-100 dark:hover:bg-gray-700")
          }
          style={
            page !== currentPage
              ? { color: "var(--color-text-secondary)" }
              : {}
          }
        >
          {page}
        </button>
      ))}

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
        style={{ color: "var(--color-text-secondary)" }}
      >
        <HiChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
